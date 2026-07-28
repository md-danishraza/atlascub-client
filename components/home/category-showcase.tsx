"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, Eye } from "lucide-react";
import { silhouetteHighlights } from "@/lib/constants/homepage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CategoryShowcase() {
  const [activeTab, setActiveTab] = useState("men");

  return (
    <section className="py-20 md:py-32 bg-background/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 md:mb-16 text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full  text-primary text-[10px] font-mono uppercase tracking-widest font-medium mb-4 border border-border shadow-sm">
            <Grid className="h-3.5 w-3.5" />
            <span>Functional Taxonomy</span>
          </div>
          <h2 className="heading-lg md:heading-xl font-primary font-bold text-foreground tracking-tight">
            Browse by Silhouette
          </h2>
          <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed font-body">
            Explore our architectural clothing lines. From handwoven ethnic drapes to structured everyday outerwear, tailored specifically for every frame.
          </p>
        </motion.div>

        {/* Shadcn Tabs Integration */}
        <Tabs defaultValue="men" className="w-full" onValueChange={setActiveTab}>
          
          <div className="flex justify-center mb-10">
            <TabsList className=" border border-border h-14 px-2 rounded-full shadow-sm">
              <TabsTrigger 
                value="men" 
                className="rounded-full px-8 py-2.5 font-secondary text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                Men
              </TabsTrigger>
              <TabsTrigger 
                value="women" 
                className="rounded-full px-8 py-2.5 font-secondary text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                Women
              </TabsTrigger>
              <TabsTrigger 
                value="kids" 
                className="rounded-full px-8 py-2.5 font-secondary text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                Kids
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dynamic Content Mapping */}
          {Object.entries(silhouetteHighlights).map(([genderKey, categories]) => (
            <TabsContent key={genderKey} value={genderKey} className="mt-0 outline-none">
              <AnimatePresence mode="wait">
                {activeTab === genderKey && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
                  >
                    {categories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="group relative overflow-hidden rounded-xl bg-card border border-border aspect-[4/5] shadow-sm hover:shadow-xl transition-all duration-500"
                      >
                        <Link href={category.href} className="absolute inset-0">
                          {/* Image Container */}
                          <div className="absolute inset-0 z-0">
                            <Image
                              src={category.image}
                              alt={category.title}
                              fill
                              className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-110"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                            {/* Rich Dark Gradient Overlay for text contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                          </div>

                          {/* Text Overlay */}
                          <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end text-white">
                            <h3 className="heading-sm md:text-2xl font-primary font-bold text-white mb-2 group-hover:text-[#fdf2d6] transition-colors duration-300">
                              {category.title}
                            </h3>
                            <p className="text-xs md:text-sm text-white/80 leading-relaxed font-body font-light">
                              {category.description}
                            </p>
                            
                            {/* Hover Reveal Button */}
                            <div className="overflow-hidden mt-4">
                              <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#fdf2d6] font-bold transform translate-y-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                                <Eye className="h-4 w-4" />
                                <span>Explore Range</span>
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>

      </div>
    </section>
  );
}