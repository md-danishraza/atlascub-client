"use client";

import { motion } from "framer-motion";
import { Product } from "@/lib/store/apis/product-api"; // Use API type
import { ProductCard } from "./product-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, isLoading = false, columns = 4 }: ProductGridProps) {
  if (isLoading) {
    const skeletonCount = 8;
    return (
      <div className={`grid grid-cols-2 gap-4 sm:gap-6 ${
        columns === 4 ? "lg:grid-cols-3 xl:grid-cols-4" : 
        columns === 3 ? "lg:grid-cols-3" : 
        "lg:grid-cols-2"
      }`}>
        {[...Array(skeletonCount)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try adjusting your filters or search terms"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`grid grid-cols-2 gap-4 sm:gap-6 ${
        columns === 4 ? "lg:grid-cols-3 xl:grid-cols-4" : 
        columns === 3 ? "lg:grid-cols-3" : 
        "lg:grid-cols-2"
      }`}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} />
      ))}
    </motion.div>
  );
}