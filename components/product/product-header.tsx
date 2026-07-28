"use client";

import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/store/apis/product-api";
import { ReviewStar } from "./review-star";

interface ProductHeaderProps {
  product: Product;
}

export function ProductHeader({ product }: ProductHeaderProps) {
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {product.isNew && (
          <Badge className="bg-primary text-primary-foreground">New In</Badge>
        )}
        {product.isBestSeller && (
          <Badge variant="secondary">Best Seller</Badge>
        )}
        {discount > 0 && (
          <Badge variant="outline" className="border-destructive text-destructive">
            {discount}% OFF
          </Badge>
        )}
      </div>

      {/* Title */}
      <h1 className="heading-lg font-primary">{product.name}</h1>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-semibold text-foreground">
          ₹{product.price.toLocaleString()}
        </span>
        {product.compareAtPrice && (
          <span className="text-muted-foreground line-through">
            ₹{product.compareAtPrice.toLocaleString()}
          </span>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <ReviewStar rating={Math.round(product.rating)} />
        <span className="text-sm text-muted-foreground">
          {product.reviewCount} {product.reviewCount === 1 ? "review" : "reviews"}
        </span>
      </div>
    </div>
  );
}