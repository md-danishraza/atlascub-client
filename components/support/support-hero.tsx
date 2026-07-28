"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

export function SupportHero() {
  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24">
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
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <HelpCircle className="h-7 w-7 text-primary" />
            </div>
          </div>

          <h1 className="heading-xl md:heading-2xl font-primary text-foreground">
            How Can We Help You?
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Find answers to common questions about orders, shipping, returns, and more.
            Our support team is here to assist you.
          </p>

          {/* Quick Stats */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">Fast Response</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">Easy Returns</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}