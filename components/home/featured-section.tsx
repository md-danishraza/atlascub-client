"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Flame } from "lucide-react";
import { curatedCampaigns } from "@/lib/constants/homepage";
import { useGetCollectionsQuery } from "@/lib/store/apis/collection-api";

export function FeaturedCollection() {
  // 1. Fetch live data from API
  const { data: dbCollections, isLoading, isError } = useGetCollectionsQuery();

  // 2. Intelligent Data Mapping (DB vs Fallback)
  const collectionsToDisplay = useMemo(() => {
    if (isLoading) return [];

    // Fallback to mock data if API fails or returns empty
    if (isError || !dbCollections || dbCollections.length === 0) {
      return curatedCampaigns.map((c) => ({
        id: c.id.toString(),
        name: c.title,
        slug: c.href.replace("/collections/", ""),
        description: c.description,
        image: c.image,
        accentOverlay: c.accentOverlay,
      })).slice(0, 4);
    }

    // Map live DB collections and assign rotating aesthetic overlays
    const overlays = [
      "bg-[#fdf2d6]/15",
      "bg-stone-500/15",
      "bg-neutral-900/15",
      "bg-[#9b2c2c]/15",
    ];

    return dbCollections
      .filter((c) => c.isActive)
      .slice(0, 4)
      .map((c, index) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || "Discover our latest curated seasonal drops.",
        image: c.image || "/images/placeholder.jpg",
        accentOverlay: overlays[index % overlays.length],
      }));
  }, [dbCollections, isLoading, isError]);

  return (
    <section className="py-20 md:py-28 bg-background/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-[10px] md:text-[11px] font-mono uppercase tracking-widest text-primary mb-3 font-medium">
              <Flame className="h-3.5 w-3.5 animate-pulse text-orange-500" />
              <span>Current Campaigns</span>
            </div>
            <h2 className="heading-lg md:heading-xl font-primary font-semibold text-foreground tracking-tight">
              Curated Stories
            </h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
              Explore dynamic capsule collection drop schedules tailored strictly to seasonal palettes and festive narratives.
            </p>
          </div>

          <Link
            href="/collections/all"
            className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest font-medium text-primary border-b border-primary pb-1 hover:text-foreground hover:border-foreground transition-all duration-300 shrink-0"
          >
            <span>View All Stories</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        {/* Grid Layout State Management */}
        {isLoading ? (
          /* SKELETON LOADER STATE */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="aspect-[3/4] w-full rounded-xl bg-muted/50 animate-pulse border border-border" />
                <div className="space-y-2.5">
                  <div className="h-6 w-3/4 bg-muted/50 animate-pulse rounded-md" />
                  <div className="h-4 w-full bg-muted/50 animate-pulse rounded-md" />
                  <div className="h-4 w-5/6 bg-muted/50 animate-pulse rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LOADED DATA STATE */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {collectionsToDisplay.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="group flex flex-col h-full"
              >
                <Link href={`/collections/${campaign.slug}`} className="flex flex-col flex-1">
                  
                  {/* Image Container with Advanced Animations */}
                  <div className="relative mb-5 overflow-hidden rounded-xl aspect-[3/4] bg-muted border border-border shadow-sm transition-all duration-500 group-hover:shadow-md">
                    <Image
                      src={campaign.image}
                      alt={campaign.name}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    
                    {/* Base Brand Accent Overlay */}
                    {campaign.accentOverlay && (
                      <div className={`absolute inset-0 ${campaign.accentOverlay} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10`} />
                    )}

                    {/* NEW: Sweeping Dark Gradient Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 flex flex-col justify-end p-5">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <span className="text-white/90 text-[11px] font-mono uppercase tracking-widest font-semibold flex items-center gap-1.5 backdrop-blur-sm bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/20">
                          Explore Capsule <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Typography Details */}
                  <div className="space-y-2 flex-1 flex flex-col">
                    <div>
                      <h3 className="font-primary text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug line-clamp-1">
                        {campaign.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                        {campaign.description}
                      </p>
                    </div>

                    {/* Desktop Hover CTA Indicator */}
                    <span className="mt-auto pt-3 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-primary font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <span>View Collection</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>

                </Link>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}