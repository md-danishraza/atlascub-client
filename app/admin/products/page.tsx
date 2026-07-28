"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { toast } from "sonner";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useHardDeleteProductMutation,
  useRestoreProductMutation,  // Add this import
} from "@/lib/store/apis/product-api";
import { ProductsHeader } from "@/components/admin/products-header";
import { ProductsFilters } from "@/components/admin/products-filter";
import { CollectionsManager } from "@/components/admin/collections-manager";
import { ProductsTable } from "@/components/admin/products-table";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [showHidden, setShowHidden] = useState(true); // Default true for admin to see hidden products
  const [page, setPage] = useState(1);
  const [productToAction, setProductToAction] = useState<{ id: string; name: string; action: 'soft' | 'hard' | 'restore' } | null>(null);
  const limit = 10;

  const { data, isLoading, isError, refetch } = useGetProductsQuery({
    search: search || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    gender: selectedGender !== "all" ? selectedGender : undefined,
    page,
    limit,
    includeDeleted: showHidden, // Show hidden products when toggle is on
  });

  // console.log(data)
  // console.log("Query params:", { 
  //   search, selectedCategory, selectedGender, page, showHidden 
  // });
  

  const [softDelete, { isLoading: isSoftDeleting }] = useDeleteProductMutation();
  const [hardDelete, { isLoading: isHardDeleting }] = useHardDeleteProductMutation();
  const [restoreProduct, { isLoading: isRestoring }] = useRestoreProductMutation();

  const products = data?.data || [];
  const totalPages = data?.totalPages || 0;
  const isDeleting = isSoftDeleting || isHardDeleting || isRestoring;

  const handleSoftDelete = async (id: string, name: string) => {
    try {
      await softDelete(id).unwrap();
      toast.success(`"${name}" has been hidden from storefront`);
      refetch();
    } catch (error) {
      toast.error("Failed to hide product");
    }
    setProductToAction(null);
  };

  const handleRestore = async (id: string, name: string) => {
    try {
      await restoreProduct(id).unwrap();
      toast.success(`"${name}" has been restored to storefront`);
      refetch();
    } catch (error) {
      toast.error("Failed to restore product");
    }
    setProductToAction(null);
  };

  const handleHardDelete = async (id: string, name: string) => {
    try {
      await hardDelete(id).unwrap();
      toast.success(`"${name}" has been permanently deleted`);
      refetch();
    } catch (error) {
      toast.error("Failed to delete product permanently");
    }
    setProductToAction(null);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedGender("all");
    setPage(1);
  };

  const hasActiveFilters = search !== "" || selectedCategory !== "all" || selectedGender !== "all";

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <ProductsHeader />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
        <CollectionsManager />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <ProductsHeader />
        <Card>
          <CardContent className="py-12">
            <EmptyState
              title="Failed to load products"
              description="There was an error loading your products. Please try again."
              action={{ label: "Retry", onClick: () => refetch() }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductsHeader />

      <ProductsFilters
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        selectedGender={selectedGender}
        onGenderChange={(val) => { setSelectedGender(val); setPage(1); }}
        selectedCategory={selectedCategory}
        onCategoryChange={(val) => { setSelectedCategory(val); setPage(1); }}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        showHidden={showHidden}
        onShowHiddenChange={setShowHidden}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total {data?.total || 0} products found
          </p>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <EmptyState
              title="No products found"
              description={hasActiveFilters ? "Try adjusting your filters" : "Start adding products to your catalog"}
              action={{
                label: hasActiveFilters ? "Clear Filters" : "Add Your First Product",
                onClick: hasActiveFilters ? clearFilters : undefined,
                href: !hasActiveFilters ? "/admin/products/new" : undefined,
              }}
            />
          ) : (
            <>
              <ProductsTable
                products={products}
                onHide={(id, name) => setProductToAction({ id, name, action: 'soft' })}
                onRestore={(id, name) => handleRestore(id, name)}  // Direct restore without dialog
                onDelete={(id, name) => setProductToAction({ id, name, action: 'hard' })}
                isDeleting={isDeleting}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Collections Manager Section */}
      <CollectionsManager />

      {/* Confirmation Dialog - Only for destructive actions */}
      <AlertDialog open={!!productToAction} onOpenChange={() => setProductToAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {productToAction?.action === 'soft' ? 'Hide Product' : 'Permanently Delete Product'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {productToAction?.action === 'soft' 
                ? `"${productToAction?.name}" will be hidden from the storefront. You can restore it later.`
                : `Are you sure you want to permanently delete "${productToAction?.name}"? This action cannot be undone and will also delete all product images from Cloudinary.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (productToAction) {
                  if (productToAction.action === 'soft') {
                    handleSoftDelete(productToAction.id, productToAction.name);
                  } else {
                    handleHardDelete(productToAction.id, productToAction.name);
                  }
                }
              }}
              className={productToAction?.action === 'soft' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-destructive hover:bg-destructive/90'}
            >
              {productToAction?.action === 'soft' ? 'Hide Product' : 'Permanently Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}