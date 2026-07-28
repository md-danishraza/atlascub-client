"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { genderGrid } from "@/lib/constants/homepage";

export function GenderGrid() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24 text-center max-w-xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 text-secondary-foreground text-[10px] font-secondary uppercase tracking-[0.25em] font-bold mb-4 border border-border">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span>Curated Departments</span>
          </div>
          <h2 className="heading-lg md:text-5xl font-primary font-bold text-foreground tracking-tight">
            Shop by Department
          </h2>
          <p className="mt-4 text-sm md:text-base text-muted-foreground font-body leading-relaxed">
            Thoughtfully engineered silhouettes structured specifically for individual frames, exceptional fabric drapes, and ease of movement.
          </p>
        </motion.div>

        {/* Triple Pane Split Screen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {genderGrid.map((gender, index) => (
            <motion.div
              key={gender.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl hover:border-border/80 transition-all duration-500 aspect-[4/5]"
            >
              <Link href={gender.href} className="absolute inset-0 block h-full w-full">
                
                {/* Image Container with Custom Cinematic Bezier scale */}
                <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
                  <Image
                    src={gender.image}
                    alt={gender.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center scale-100 group-hover:scale-[1.04] group-hover:filter group-hover:brightness-95 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform transform-gpu"
                  />
                  
                  {/* Premium Vignette Overlay (Grows darker on hover for luxury drama) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10 opacity-80 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-95" />
                  
                  {/* Cinematic Glossy Shine Sweep on Hover */}
                  <div className="absolute inset-0 z-5 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" />
                </div>

                {/* Overlapping Content Panel */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-10 text-white">
                  
                  {/* Dynamic Department Code */}
                  <span className="text-[10px] font-secondary uppercase tracking-[0.25em] text-[#fdf2d6]/70 block mb-2 opacity-0 -translate-y-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-y-0">
                    DEPT. 0{index + 1}
                  </span>
                  
                  {/* Serif Category Title */}
                  <h3 className="text-2xl md:text-3xl font-primary font-bold text-white mb-2 transform translate-y-2 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    {gender.title}
                  </h3>
                  
                  {/* Descriptive Copy */}
                  <p className="text-xs md:text-sm text-white/80 max-w-xs leading-relaxed font-body font-light mb-6 line-clamp-2 transform translate-y-2 opacity-80 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                    {gender.description}
                  </p>
                  
                  {/* Sleek Underlining Link CTA */}
                  <div className="flex items-center gap-2 text-xs font-secondary uppercase tracking-widest text-white font-bold transform translate-y-2 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    <span className="relative overflow-hidden pb-1">
                      Shop Collection
                      {/* Interactive slide-in border */}
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transform origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                    </span>
                    <ArrowRight className="h-4 w-4 transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
