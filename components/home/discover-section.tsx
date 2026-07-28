"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/product-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { 
  useGetNewArrivalsQuery, 
  useGetBestSellersQuery 
} from "@/lib/store/apis/product-api";

export function DiscoverMore() {
  const [activeTab, setActiveTab] = useState<"new" | "trending">("new");

  // 1. Fetch from specialized NestJS endpoints natively
  const { data: newArrivals = [], isLoading: isLoadingNew } = useGetNewArrivalsQuery({ limit: 4 });
  const { data: trendingProducts = [], isLoading: isLoadingTrending } = useGetBestSellersQuery({ limit: 4 });

  // 2. Resolve active state
  const currentProducts = activeTab === "new" ? newArrivals : trendingProducts;
  const isLoading = activeTab === "new" ? isLoadingNew : isLoadingTrending;

  return (
    <section className="py-20 md:py-28 bg-background border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-lg md:heading-xl font-primary font-semibold text-foreground tracking-tight"
          >
            Discover More
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl font-body"
          >
            Explore our latest arrivals and most coveted pieces, handpicked for your wardrobe.
          </motion.p>

          {/* Interactive Tab Switcher */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex items-center p-1 bg-muted/50 border border-border/50 rounded-full shadow-sm"
          >
            <button
              onClick={() => setActiveTab("new")}
              className={`relative flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-full transition-colors duration-300 ${
                activeTab === "new" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              New Arrivals
              {activeTab === "new" && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute inset-0 bg-background rounded-full shadow-sm border border-border/50" 
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("trending")}
              className={`relative flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-full transition-colors duration-300 ${
                activeTab === "trending" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Trending Now
              {activeTab === "trending" && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute inset-0 bg-background rounded-full shadow-sm border border-border/50" 
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          </motion.div>
        </div>

        {/* Product Grid Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Fallback to Empty State if DB lacks flagged products */}
              {!isLoading && currentProducts.length === 0 ? (
                <div className="max-w-xl mx-auto pt-8">
                  <EmptyState 
                    title="Curating Collection" 
                    description={
                      activeTab === "new" 
                        ? "We are currently preparing our next drop of new arrivals. Check back soon." 
                        : "Trending metrics are currently calculating. Browse our full catalog in the meantime."
                    }
                    icon={PackageSearch}
                  />
                </div>
              ) : (
                <ProductGrid 
                  products={currentProducts} 
                  isLoading={isLoading} 
                  columns={4} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* View All Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 md:mt-16 flex justify-center"
        >
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="rounded-full px-8 gap-2 group hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
          >
            <Link href="/search">
              View All Styles
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

      </div>
    </section>
  );
}