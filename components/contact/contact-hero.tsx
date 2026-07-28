"use client";

import { motion } from "framer-motion";

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24">
      {/* Subtle Background Pattern */}
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

          {/* Title */}
          <h1 className="heading-xl md:heading-2xl font-primary text-foreground">
            Client Services
          </h1>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Whether you have a question about sizing, need assistance with an order,
            or simply want to learn more about our craft — we&apos;re here to help.
          </p>

          {/* Stats Line */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">Response within 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">Free support on all orders</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">Dedicated styling assistance</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}