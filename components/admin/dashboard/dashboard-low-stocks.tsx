"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface LowStockProduct {
  id: string;
  name: string;
  inventory: number;
  images: string[];
  price: number;
}

interface LowStockProps {
  products: LowStockProduct[];
  isLoading?: boolean;
}

export function LowStockAlert({ products, isLoading = false }: LowStockProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alert</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Low Stock Alert
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/products" className="gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <EmptyState
            title="All products in stock"
            description="No low inventory alerts at this time"
          />
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}/edit`}
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={product.images[0] || "/images/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={product.inventory <= 2 ? "destructive" : "outline"}
                    className={
                      product.inventory <= 2
                        ? "bg-red-100 text-red-700"
                        : "border-amber-500 text-amber-600"
                    }
                  >
                    {product.inventory} left
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}