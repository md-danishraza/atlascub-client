"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SortDropdown } from "@/components/products/sort-dropdown";
import { ProductGrid } from "@/components/products/product-grid";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { useGetCollectionProductsQuery, useGetCollectionsQuery } from "@/lib/store/apis/collection-api";

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "popularity">("newest");
  const [, setPage] = useState(1); // Used for future pagination integration

  const { data: collections } = useGetCollectionsQuery();
  const collection = collections?.find((c) => c.slug === slug);
  
  const { data, isLoading, isError } = useGetCollectionProductsQuery(collection?.id || "", {
    skip: !collection?.id,
  });

  const products = data?.products || [];
  const collectionData = data?.collection;
  const totalProducts = data?.totalProducts || 0;

  const getSortedProducts = () => {
    const sorted = [...products];
    switch (sortBy) {
      case "price_asc": return sorted.sort((a, b) => a.price - b.price);
      case "price_desc": return sorted.sort((a, b) => b.price - a.price);
      case "popularity": return sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      default: return sorted;
    }
  };

  const sortedProducts = getSortedProducts();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <SlugBreadcrumb />
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isError || !collectionData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <SlugBreadcrumb />
        <EmptyState
          title="Collection not found"
          description="The collection you're looking for doesn't exist."
          icon={Package}
          action={{ label: "Browse All Collections", href: "/collections/all" }}
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-background"
    >
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden bg-muted">
        {collectionData.image && (
          <Image
            src={collectionData.image}
            alt={collectionData.name}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative container mx-auto flex h-full flex-col justify-end px-4 pb-12"
        >
          <Link href="/collections/all" className="mb-4 inline-flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Collections
          </Link>
          <h1 className="text-4xl md:text-6xl font-primary text-white">{collectionData.name}</h1>
          {collectionData.description && <p className="mt-2 text-white/80 max-w-2xl">{collectionData.description}</p>}
          <p className="mt-3 text-sm text-white/60">{totalProducts} products found</p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6"><SlugBreadcrumb /></div>

        <div className="mb-8 flex items-center justify-end">
          <SortDropdown value={sortBy} onChange={(val) => { setSortBy(val); setPage(1); }} />
        </div>

        {sortedProducts.length === 0 ? (
          <EmptyState title="No products found" description="Check back soon for new arrivals" icon={Package} />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <ProductGrid products={sortedProducts} isLoading={false} columns={4} />
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Showing {sortedProducts.length} of {totalProducts} products
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}