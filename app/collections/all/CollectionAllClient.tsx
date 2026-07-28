"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Tag, Sun, Flame, Loader2 } from "lucide-react";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { useGetCollectionsQuery } from "@/lib/store/apis/collection-api";

const typeIcons = {
  festival: <Sparkles className="h-5 w-5" />,
  campaign: <Sun className="h-5 w-5" />,
  season: <Flame className="h-5 w-5" />,
  sale: <Tag className="h-5 w-5" />,
};

export default function CollectionsAllPage() {
  const { data: collections, isLoading, isError, refetch } = useGetCollectionsQuery();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <SlugBreadcrumb />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] rounded-xl bg-muted" />
              <div className="mt-4 h-6 w-32 bg-muted rounded" />
              <div className="mt-2 h-4 w-48 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <SlugBreadcrumb />
        <EmptyState
          title="Failed to load collections"
          description="There was an error loading collections. Please try again."
          action={{ label: "Retry", onClick: () => refetch() }}
        />
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <SlugBreadcrumb />
        <EmptyState
          title="No collections yet"
          description="Check back soon for our curated collections"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <SlugBreadcrumb />
      </div>

      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="heading-xl font-primary">All Collections</h1>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Discover our curated campaigns, seasonal drops, and festive edits
        </p>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group"
            onMouseEnter={() => setHoveredId(collection.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Link href={`/collections/${collection.slug}`}>
              <div className="relative overflow-hidden rounded-xl bg-muted aspect-[4/3]">
                {/* Collection Image */}
                {collection.image ? (
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                    {typeIcons[collection.type as keyof typeof typeIcons] || <Sparkles className="h-12 w-12 text-primary/40" />}
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Badge */}
                {collection.badge && (
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-primary/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {collection.badge}
                    </span>
                  </div>
                )}

                {/* Hover Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="rounded-full bg-white/20 backdrop-blur-md p-3">
                    <ArrowRight className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <h3 className="heading-sm font-primary group-hover:text-primary transition-colors">
                    {collection.name}
                  </h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {collection.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0">
                  Explore Collection
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Editorial Note */}
      <div className="mt-16 border-t border-border pt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Each collection is thoughtfully curated to bring you the finest in contemporary fashion.
          <br />
          New collections are added seasonally — stay tuned.
        </p>
      </div>
    </div>
  );
}

// Add useState import
import { useState } from "react";