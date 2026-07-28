"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { aboutData } from "@/lib/constants/about";

export function CTASection() {
  const { cta } = aboutData;

  return (
    <section className="py-20 md:py-28 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="heading-lg font-primary text-primary-foreground">
            {cta.title}
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            {cta.description}
          </p>
          <Link href={cta.buttonLink}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-md font-medium hover:bg-white/90 transition-all"
            >
              {cta.buttonText}
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}