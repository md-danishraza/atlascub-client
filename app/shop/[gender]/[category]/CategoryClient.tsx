"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import { SortDropdown } from "@/components/products/sort-dropdown";
import { ProductGrid } from "@/components/products/product-grid";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useGetProductsQuery } from "@/lib/store/apis/product-api";
import { useGetCategoryBySlugQuery } from "@/lib/store/apis/category-api";

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function CategoryClient() {
  const params = useParams();
  const gender = params.gender as string;
  const categorySlug = params.category as string;

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "popularity">("newest");
  const [page, setPage] = useState(1);

  const { data: category, isLoading: categoryLoading } = useGetCategoryBySlugQuery({
    gender,
    slug: categorySlug,
  });

  // Build query params - send sizes as array
  const queryParams = {
    gender: gender,
    category: categorySlug,
    sizes: selectedSizes.length > 0 ? selectedSizes : undefined, // This is already an array
    sortBy: sortBy !== "newest" ? sortBy : undefined,
    page,
    limit: 12,
  };

  const { data, isLoading, isFetching } = useGetProductsQuery(queryParams);
  
  const products = data?.data || [];
  const totalProducts = data?.total || 0;
  const totalPages = data?.totalPages || 0;

  const categoryTitle = category?.name || categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
  const categoryDescription = category?.description || `Explore our collection of ${categoryTitle.toLowerCase()}`;

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
    setPage(1);
  };

  const clearSizeFilter = () => {
    setSelectedSizes([]);
    setPage(1);
  };

  const hasActiveFilters = selectedSizes.length > 0;

  // Size Filter Component
  const SizeFilterContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Size</h3>
        {hasActiveFilters && (
          <button onClick={clearSizeFilter} className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Clear all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {availableSizes.map((size) => (
          <button
            key={size}
            onClick={() => toggleSize(size)}
            className={`h-10 w-12 rounded-md border text-sm font-medium transition-all ${
              selectedSizes.includes(size)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:border-primary"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <SlugBreadcrumb />
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="heading-lg font-primary">{categoryTitle}</h1>
        <p className="mt-2 text-muted-foreground">{categoryDescription}</p>
      </div>

      {/* Filters and Sort Row */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 lg:hidden">
                <Filter className="h-4 w-4" />
                Size
                {hasActiveFilters && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {selectedSizes.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm p-4">
              <SheetHeader>
                <SheetTitle>Filter by Size</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <SizeFilterContent />
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Size Filter - Only show on larger screens */}
          <div className="hidden lg:block">
            <SizeFilterContent />
          </div>

          {/* Clear Filters Button - Only show when filters are active */}
          {hasActiveFilters && (
            <button
              onClick={clearSizeFilter}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <X className="h-3 w-3" />
              Clear size filters
            </button>
          )}
        </div>

        <SortDropdown value={sortBy} onChange={(value) => { setSortBy(value); setPage(1); }} />
      </div>

      {/* Product Grid */}
      <div className="flex-1">
        <ProductGrid
          products={products}
          isLoading={isLoading || isFetching || categoryLoading}
          columns={4}
        />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
        
        {/* Results Count */}
        {!isLoading && products.length > 0 && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Showing {products.length} of {totalProducts} products
          </div>
        )}
      </div>
    </div>
  );
}