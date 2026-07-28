"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import { SortDropdown } from "@/components/products/sort-dropdown";
import { ProductGrid } from "@/components/products/product-grid";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useGetProductsQuery } from "@/lib/store/apis/product-api";
import { genderMetadata } from "@/lib/constants/categories";

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function GenderAllClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const gender = params.gender as string;
  const metadata = genderMetadata[gender as keyof typeof genderMetadata];

  // Initialize state from URL params
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "popularity">("newest");
  const [page, setPage] = useState(1);

  // Read sortBy from URL on mount
  useEffect(() => {
    const urlSortBy = searchParams.get("sortBy") as "newest" | "price_asc" | "price_desc" | "popularity";
    if (urlSortBy && ["newest", "price_asc", "price_desc", "popularity"].includes(urlSortBy)) {
      setSortBy(urlSortBy);
    }
  }, [searchParams]);

  // Build query params
  const queryParams = {
    gender: gender,
    sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
    sortBy: sortBy !== "newest" ? sortBy : undefined,
    page,
    limit: 12,
  };

  const { data, isLoading, isFetching } = useGetProductsQuery(queryParams);
  
  const products = data?.data || [];
  const totalProducts = data?.total || 0;
  const totalPages = data?.totalPages || 0;

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

  const handleSortChange = (value: "newest" | "price_asc" | "price_desc" | "popularity") => {
    setSortBy(value);
    setPage(1);
  };

  const hasActiveFilters = selectedSizes.length > 0;

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
        <h1 className="heading-lg font-primary">All {metadata?.title || gender.charAt(0).toUpperCase() + gender.slice(1)}</h1>
        <p className="mt-2 text-muted-foreground">
          Explore our complete collection of {metadata?.title?.toLowerCase() || gender} wear
        </p>
      </div>

      {/* Filters and Sort Row */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
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

          <div className="hidden lg:block">
            <SizeFilterContent />
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearSizeFilter}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <X className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>

        <SortDropdown value={sortBy} onChange={handleSortChange} />
      </div>

      {/* Product Grid */}
      <div className="flex-1">
        <ProductGrid
          products={products}
          isLoading={isLoading || isFetching}
          columns={4}
        />
        
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
        
        {!isLoading && products.length > 0 && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Showing {products.length} of {totalProducts} products
          </div>
        )}
      </div>
    </div>
  );
}