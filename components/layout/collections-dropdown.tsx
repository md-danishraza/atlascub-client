"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Tag, Sun, Flame, Loader2 } from "lucide-react";
import { categories } from "@/lib/constants/navigation";
import { useGetCollectionsQuery } from "@/lib/store/apis/collection-api";

const typeIcons: Record<string, React.ReactNode> = {
  festival: <Sparkles className="h-4 w-4" />,
  campaign: <Sun className="h-4 w-4" />,
  season: <Flame className="h-4 w-4" />,
  sale: <Tag className="h-4 w-4" />,
};

export function CollectionsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  
  // 🛡️ API Integration
  const { data: dbCollections, isLoading, isError } = useGetCollectionsQuery();

  // Smart Fallback Logic
  const displayCollections = useMemo(() => {
    if (isLoading) return []; // Optional: could show skeletons here, but skipping to avoid nav flickering
    
    if (!isError && dbCollections && dbCollections.length > 0) {
      // Map database collections to match the UI structure
      return dbCollections
        .filter((c) => c.isActive)
        .map((c) => ({
          name: c.name,
          slug: c.slug,
          description: c.description || "Explore this collection",
          type: c.type || "season",
          badge: c.badge,
          href: `/collections/${c.slug}`,
        }));
    }
    
    // Fallback to static mock data on error or empty DB
    return categories.collections || [];
  }, [dbCollections, isLoading, isError]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href="/collections/all"
        className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
      >
        Collections
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full pt-4 z-50"
          >
            <div className="w-80 rounded-lg border bg-popover p-4 shadow-lg">
              <div className="mb-3 flex items-center justify-between px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span>Curated for you</span>
                {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
              </div>
              <div className="grid gap-2">
                {displayCollections.map((collection) => (
                  <Link
                    key={collection.slug}
                    href={collection.href}
                    className="group flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-accent"
                  >
                    <div className="mt-0.5 text-muted-foreground group-hover:text-primary">
                      {typeIcons[collection.type as keyof typeof typeIcons] || <Sparkles className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{collection.name}</span>
                        {collection.badge && (
                          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                            {collection.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {collection.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-3 border-t pt-3">
                <Link
                  href="/collections/all"
                  className="block rounded-md p-2 text-center text-sm font-medium text-primary transition-colors hover:bg-accent"
                >
                  View All Collections →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}