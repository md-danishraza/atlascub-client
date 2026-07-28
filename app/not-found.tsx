"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {  Home, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-secondary/10 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/3 blur-3xl" />
      </div>

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
        {/* Animated Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <span className="text-[120px] font-primary font-bold leading-none tracking-tighter text-foreground/10 md:text-[180px] lg:text-[220px]">
            404
          </span>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-6xl font-primary font-bold text-foreground md:text-7xl lg:text-8xl">
              404
            </span>
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 max-w-lg space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-xs font-mono uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
            <Compass className="h-3.5 w-3.5" />
            <span>Page Not Found</span>
          </div>

          <h1 className="heading-lg font-primary font-semibold text-foreground">
            Lost in the Collection?
          </h1>

          <p className="text-muted-foreground">
            The page you're looking for seems to have wandered off into our archive.
            Don't worry, our latest collections are just a click away.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/">
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <Link href="/collections/all">
            <Button variant="outline" className="gap-2 border-border hover:bg-muted">
              <Sparkles className="h-4 w-4" />
              Explore Collections
            </Button>
          </Link>
        </motion.div>

        {/* Quick Links Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 border-t border-border pt-8"
        >
          <p className="mb-4 text-xs uppercase tracking-wider text-muted-foreground">
            Quick Navigation
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link
              href="/shop/men"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Men
            </Link>
            <Link
              href="/shop/women"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Women
            </Link>
            <Link
              href="/shop/kids"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Kids
            </Link>
            <Link
              href="/collections/all"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Collections
            </Link>
            <Link
              href="/about"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              About Us
            </Link>
            <Link
              href="/support"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Support
            </Link>
          </div>
        </motion.div>

        {/* Scroll Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
            <span className="text-[9px] uppercase tracking-widest">Scroll</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              ↓
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}