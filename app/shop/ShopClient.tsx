"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Sparkles, Tag, Sun, Flame, ArrowUpRight } from "lucide-react";
import { genderMetadata } from "@/lib/constants/categories";

// import { categories } from "@/lib/constants/navigation"; 
import { useGetCollectionsQuery } from "@/lib/store/apis/collection-api";

const typeIcons: Record<string, React.ReactNode> = {
  festival: <Sparkles className="h-5 w-5" />,
  campaign: <Sun className="h-5 w-5" />,
  season: <Flame className="h-5 w-5" />,
  sale: <Tag className="h-5 w-5" />,
};

export default function ShopClient() {
  const genders = ["men", "women", "kids"];

  // 🛡️ API INTEGRATION: Fetch live collections from NestJS backend
  const { data: dbCollections, isLoading: isLoadingCollections } = useGetCollectionsQuery();
  
  // Filter to only show active collections
  const activeCollections = dbCollections?.filter(c => c.isActive) || [];

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-muted">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        </div>
        <div className="relative h-full container mx-auto flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-mono uppercase tracking-wider text-primary mb-3 block font-medium">
              Welcome to Atlascub
            </span>
            <h1 className="heading-xl md:heading-2xl font-primary text-foreground tracking-tight">
              Shop by Category
            </h1>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto text-sm md:text-base leading-relaxed">
              Discover thoughtfully curated collections for every style and occasion.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-20">
        
        {/* Gender Grid Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-24"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="heading-lg font-primary">Shop by Gender</h2>
            <p className="mt-2 text-muted-foreground">
              Explore collections tailored for everyone
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {genders.map((gender, index) => {
              const metadata = genderMetadata[gender as keyof typeof genderMetadata];
              const heroImagePath = `/images/gender/${gender}-hero.jpg`;

              return (
                <motion.div
                  key={gender}
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ y: -6 }}
                  className="group"
                >
                  <Link href={`/shop/${gender}`} className="block">
                    <div className="relative overflow-hidden rounded-2xl aspect-[4/5] shadow-sm transition-shadow duration-500 group-hover:shadow-lg">
                      {/* Background Image */}
                      <Image
                        src={heroImagePath}
                        alt={metadata?.title || gender}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      
                      {/* Refined Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-2xl md:text-3xl font-primary font-medium tracking-wide">{metadata?.title}</h3>
                        <p className="text-sm text-white/80 mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {metadata?.description}
                        </p>
                        <span className="inline-flex items-center gap-2 mt-4 text-xs font-mono uppercase tracking-widest font-medium text-white group-hover:text-primary transition-colors">
                          Shop Now
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Dynamic Collections Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-24"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary mb-3">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                Curated for You
              </span>
            </div>
            <h2 className="heading-lg font-primary">Featured Collections</h2>
            <p className="mt-2 text-muted-foreground">
              Discover our latest editorial drops and seasonal edits
            </p>
          </motion.div>

          {isLoadingCollections ? (
            /* SKELETON LOADER STATE */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="aspect-[3/4] w-full rounded-xl bg-muted/50 animate-pulse border border-border" />
                  <div className="space-y-2">
                    <div className="h-5 w-2/3 bg-muted/50 animate-pulse rounded-md" />
                    <div className="h-4 w-full bg-muted/50 animate-pulse rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : activeCollections.length > 0 ? (
            /* ACTIVE COLLECTIONS STATE */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {activeCollections.map((collection) => (
                  <motion.div
                    key={collection.slug}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    className="group"
                  >
                    <Link href={`/collections/${collection.slug}`} className="block h-full flex flex-col">
                      <div className="relative overflow-hidden rounded-xl aspect-[3/4] bg-muted border border-border shadow-sm transition-all duration-500 group-hover:shadow-md mb-4">
                        
                        {/* Dynamic Image or Fallback */}
                        {collection.image ? (
                          <Image
                            src={collection.image}
                            alt={collection.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                            {typeIcons[collection.type as keyof typeof typeIcons] || (
                              <Sparkles className="h-10 w-10 text-primary/30" />
                            )}
                          </div>
                        )}
                        
                        {/* Interactive Dark Gradient Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex flex-col justify-end p-5">
                           <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <span className="text-white/90 text-[10px] font-mono uppercase tracking-widest font-semibold flex items-center gap-1.5 backdrop-blur-sm bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/20">
                              Explore <ArrowUpRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>

                        {/* Badge */}
                        {collection.badge && (
                          <div className="absolute top-3 right-3 z-20">
                            <span className="rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase shadow-sm">
                              {collection.badge}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Typography */}
                      <div className="flex-1 flex flex-col">
                        <h3 className="font-primary text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                          {collection.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                          {collection.description || "Discover our carefully curated selection of premium pieces."}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={itemVariants} className="text-center mt-12">
                <Link
                  href="/collections/all"
                  className="inline-flex items-center gap-2 text-sm font-medium border-b border-primary/30 pb-1 text-foreground hover:text-primary hover:border-primary transition-all duration-300 group"
                >
                  View All Collections
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </>
          ) : (
             /* EMPTY STATE */
             <div className="text-center py-12 border border-dashed rounded-xl border-border bg-muted/10">
                <p className="text-muted-foreground">New collections are currently being curated. Check back soon!</p>
             </div>
          )}
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-primary/5 p-8 md:p-14 text-center border border-primary/10 shadow-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 opacity-50" />
          <div className="relative z-10">
            <h3 className="heading-md md:heading-lg font-primary text-foreground">Need Styling Advice?</h3>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Let our expert styling team help you find the perfect look for your next event or daily rotation.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 mt-8 text-sm font-medium bg-foreground text-background hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-md transition-all shadow-sm"
            >
              Contact Stylist
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}