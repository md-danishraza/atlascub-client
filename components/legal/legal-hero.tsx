"use client";

import { motion } from "framer-motion";
import { Shield, FileText } from "lucide-react";

interface LegalHeroProps {
  title: string;
  description: string;
  icon?: "shield" | "file";
}

export function LegalHero({ title, description, icon = "shield" }: LegalHeroProps) {
  const IconComponent = icon === "shield" ? Shield : FileText;

  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative Line */}
          <div className="mb-6 flex justify-center">
            <div className="h-px w-12 bg-primary/40" />
          </div>

          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <IconComponent className="h-7 w-7 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h1 className="heading-xl md:heading-2xl font-primary text-foreground">
            {title}
          </h1>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {description}
          </p>

          {/* Last Updated Badge */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Last updated: 15 March 2026
          </div>
        </motion.div>
      </div>
    </section>
  );
}