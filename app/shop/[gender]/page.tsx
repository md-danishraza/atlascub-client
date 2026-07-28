"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { genderMetadata } from "@/lib/constants/categories";
import { ProductGrid } from "@/components/products/product-grid";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";
import {
  useGetCategoriesQuery,
} from "@/lib/store/apis/category-api";
import {
  useGetNewArrivalsQuery,
  useGetBestSellersQuery,
} from "@/lib/store/apis/product-api";

export default function GenderPage() {
  const params = useParams();
  const gender = params.gender as string;
  const metadata = genderMetadata[gender as keyof typeof genderMetadata];

  // Fetch categories dynamically from API
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery(gender);
  
  // Fetch real data from API
  const { data: newArrivals, isLoading: newArrivalsLoading } = useGetNewArrivalsQuery({ 
    limit: 8 
  });
  const { data: bestSellers, isLoading: bestSellersLoading } = useGetBestSellersQuery({ 
    limit: 8 
  });

  // Filter products by gender (API returns all, we filter client-side)
  const filteredNewArrivals = newArrivals?.filter(p => p.gender === gender) || [];
  const filteredBestSellers = bestSellers?.filter(p => p.gender === gender) || [];

  if (!metadata) return null;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <SlugBreadcrumb />
      </div>

      {/* Category Navigation - Horizontal Scroll - DYNAMIC */}
      <div className="mb-12 overflow-x-auto scrollbar-hide">
        {categoriesLoading ? (
          // Loading skeleton for categories
          <div className="flex gap-3 pb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-24 rounded-full bg-muted animate-pulse" />
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="flex gap-3 pb-4 min-w-max">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop/${gender}/${category.slug}`}
                className="group whitespace-nowrap rounded-full border border-border px-5 py-2 text-sm font-medium transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                {category.name}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No categories available</p>
        )}
      </div>

      {/* new arrivals */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="heading-md font-primary">New Arrivals</h2>
            <p className="text-sm text-muted-foreground">Fresh styles just landed</p>
          </div>
          <Link
            href={`/shop/${gender}/all?sortBy=newest`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ProductGrid
          products={filteredNewArrivals}
          isLoading={newArrivalsLoading}
          columns={4}
        />
      </section>

        {/* best sellers */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="heading-md font-primary">Best Sellers</h2>
            <p className="text-sm text-muted-foreground">Customer favorites</p>
          </div>
          <Link
            href={`/shop/${gender}/all?sortBy=popularity`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ProductGrid
          products={filteredBestSellers}
          isLoading={bestSellersLoading}
          columns={4}
        />
      </section>
    </div>
  );
}