"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Compass, PenTool, Sparkles, Heart, Leaf } from "lucide-react";
import { brandValues } from "@/lib/constants/homepage";

// Expanded icon map with more variety
const iconMap: Record<string, React.ElementType> = {
  compass: Compass,
  pentool: PenTool,
  shield: ShieldAlert,
  sparkles: Sparkles,
  heart: Heart,
  leaf: Leaf,
};

// Fallback icon array for index-based mapping
const fallbackIcons = [Compass, PenTool, ShieldAlert];

export function BrandValues() {
  return (
    <section className="py-20 md:py-28 bg-background/30 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16 text-center"
        >
          <span className="text-sm md:text-base tracking-[0.2em] uppercase font-secondary text-primary/70 block mb-3">
            Why Choose Us
          </span>
          <h2 className="heading-lg md:heading-xl font-primary text-foreground">
            Crafted with Purpose
          </h2>
          <div className="h-[2px] w-12 bg-primary/40 mx-auto mt-4" />
        </motion.div>

        {/* Triple Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {brandValues.map((val, index) => {
            // Try to get icon by string key, fallback to array index
            const IconComponent = 
              (val.icon && iconMap[val.icon.toLowerCase()]) || 
              fallbackIcons[index % fallbackIcons.length];
            
            return (
              <motion.div
                key={val.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                whileHover={{ y: -4 }}
                className="group space-y-4 text-left p-6 md:p-8 rounded-2xl bg-card/30 hover:bg-card/50 transition-all duration-300 border border-border/50 hover:border-primary/20"
              >
                {/* Icon Container */}
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                  <IconComponent className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </div>

                {/* Monospace Label */}
                <span className="text-[11px] font-mono uppercase tracking-widest text-primary/80 block font-medium">
                  {val.label}
                </span>

                {/* Title */}
                <h3 className="font-primary text-xl md:text-2xl font-semibold text-foreground tracking-tight">
                  {val.title}
                </h3>

                {/* Decorative Line */}
                <div className="h-px w-12 bg-primary/40 transition-all duration-300 group-hover:w-16" />

                {/* Description */}
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}