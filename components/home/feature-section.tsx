"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/ui/grid-pattern"; // Installed via the efferd CLI
import { motion } from "framer-motion";
import { 
  Scissors, 
  Feather, 
  Globe, 
  Hourglass, 
  Leaf, 
  PackageCheck 
} from "lucide-react";

type FeatureType = {
  title: string;
  icon: React.ReactNode;
  description: string;
};

const features: FeatureType[] = [
  {
    title: "In-House Tailoring",
    icon: <Scissors />,
    description: "Every bespoke garment is drafted, cut, and sewn in our own studios to guarantee structural perfection.",
  },
  {
    title: "Premium Textiles",
    icon: <Feather />,
    description: "We source heavy combed cottons, raw silks, and breathable French linens that feel luxurious against the skin.",
  },
  {
    title: "Timeless Silhouettes",
    icon: <Hourglass />,
    description: "Designed to transcend micro-trends. Our pieces are engineered to remain essential staples in your wardrobe for years.",
  },
  {
    title: "Ethical Sourcing",
    icon: <Globe />,
    description: "We mandate safe working conditions, fair wages, and strict quality vetting across our entire supply chain.",
  },
  {
    title: "Plastic-Free Packaging",
    icon: <Leaf />,
    description: "Your garments arrive in fully recyclable, zero-waste packaging, reflecting our commitment to slower fashion.",
  },
  {
    title: "Seamless Delivery",
    icon: <PackageCheck />,
    description: "Complimentary domestic shipping with end-to-end tracking on all premium orders, delivered straight to your door.",
  },
];

export function FeatureSection() {
  return (
    <section className="relative w-full py-20 md:py-32 bg-background/30">
      <div className="mx-auto w-full max-w-6xl space-y-12 px-4 md:px-6">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 block text-xs md:text-sm tracking-[0.2em] uppercase font-secondary text-primary/80"
          >
            The Atlascub Standard
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance font-primary font-bold text-3xl md:text-5xl lg:text-6xl text-foreground"
          >
            Craftsmanship. Quality. Intention.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-balance font-body text-muted-foreground text-sm md:text-base leading-relaxed"
          >
            From the initial pattern draft to the final stitch, we operate with a strict set of principles to ensure every garment meets our luxury standards.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="overflow-hidden rounded-2xl border border-border shadow-sm"
        >
          {/* bg-border creates the 1px gap effect between cards */}
          <div className="grid grid-cols-1 gap-px bg-border/60 sm:grid-cols-2 md:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard feature={feature} key={feature.title} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  feature: FeatureType;
}) {
  return (
    <div
      className={cn("group relative overflow-hidden bg-card p-8 md:p-10 transition-colors hover:bg-card/60", className)}
      {...props}
    >
      {/* Subtle Grid Pattern Overlay */}
      <div className="mask-[radial-gradient(farthest-side_at_top,white,transparent)] pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 size-full opacity-40 transition-opacity group-hover:opacity-70">
        <GridPattern
          className="absolute inset-0 size-full stroke-primary/10"
          height={40}
          width={40}
          x={20}
        />
      </div>

      <div className="relative z-20 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/50 text-primary mb-6 transition-transform group-hover:scale-110 duration-300">
        <div className="[&_svg]:size-5">
          {feature.icon}
        </div>
      </div>
      
      <h3 className="relative z-20 font-serif text-lg font-bold text-foreground">
        {feature.title}
      </h3>
      
      <p className="relative z-20 mt-3 font-body text-sm leading-relaxed text-muted-foreground">
        {feature.description}
      </p>
    </div>
  );
}


