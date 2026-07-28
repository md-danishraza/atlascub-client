"use client";

import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-md font-primary">Add New Product</h1>
        <p className="text-muted-foreground">Create a new product for your catalog</p>
      </div>
      <ProductForm />
    </div>
  );
}