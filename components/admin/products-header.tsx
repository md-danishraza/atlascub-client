"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductsHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="heading-md font-primary">Products</h1>
        <p className="text-muted-foreground">Manage your product catalog</p>
      </div>
      <Button asChild className="gap-2">
        <Link href="/admin/products/new">
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </Button>
    </div>
  );
}