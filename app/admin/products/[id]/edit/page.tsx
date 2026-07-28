"use client";

import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { useGetProductByIdQuery } from "@/lib/store/apis/product-api";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="heading-md font-primary">Edit Product</h1>
          <p className="text-muted-foreground">Product not found</p>
        </div>
        <EmptyState
          title="Product Not Found"
          description="The product you're trying to edit doesn't exist."
          action={{
            label: "Back to Products",
            href: "/admin/products",
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-md font-primary">Edit Product</h1>
        <p className="text-muted-foreground">Update product information</p>
      </div>
      <ProductForm initialData={product} isEditing />
    </div>
  );
}