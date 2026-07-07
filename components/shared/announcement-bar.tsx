"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { hideAnnouncement, setAnnouncementVisibility } from "@/lib/store/features/announcementSlice";

interface Announcement {
  id: string;
  overline?: string;
  text: string;
  ctaText?: string;
  ctaHref?: string;
}

const STATIC_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann_1",
    overline: "Complimentary",
    text: "Enjoy complimentary shipping on all orders over 1299 across India.",
    ctaText: "Details",
    ctaHref: "/support",
  },
  {
    id: "ann_2",
    overline: "Launch Offer",
    text: "Grab heavy discounts on every product.",
    ctaText: "Shop Originals",
    ctaHref: "/search",
  },
  {
    id: "ann_3",
    overline: "Limited Drop",
    text: "Our Summer Solstice French Linen collection is now live.",
    ctaText: "Explore Collection",
    ctaHref: "/collections/all",
  },
];

export function AnnouncementBar() {
  const dispatch = useAppDispatch();
  const isVisible = useAppSelector((state) => state.ui.isAnnouncementVisible);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STATIC_ANNOUNCEMENTS.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isVisible]);

  // Check dismissal preference safely on client mount
  useEffect(() => {
    const isDismissed = sessionStorage.getItem("atlascub_announcement_dismissed");
    if (isDismissed === "true") {
      dispatch(setAnnouncementVisibility(false));
    }
  }, [dispatch]);

  const handleDismiss = () => {
    dispatch(hideAnnouncement());
    sessionStorage.setItem("atlascub_announcement_dismissed", "true");
  };

  if (!isVisible) return null;

  const currentAnn = STATIC_ANNOUNCEMENTS[currentIndex];

  return (
    <div
      className="relative z-[100] w-full h-9 bg-[#fdf2d6] text-[#805500] border-b border-[#f5e8d2] dark:bg-[#92400e]/20 dark:text-[#fef3c7] dark:border-[#44403c] overflow-hidden select-none"
    >
      <div className="container mx-auto max-w-7xl h-full px-4 flex items-center justify-between gap-4">
        
        {/* Balanced spacer for structural desktop symmetry */}
        <div className="hidden md:block w-8" />

        {/* 🚀 FIXED HEIGHT CONTAINER: Prevents forced reflow calculations during slide steps */}
        <div className="flex-1 relative flex justify-center items-center h-5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAnn.id}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }} // Lightweight easing functions protect TBT scores
              className="flex flex-row items-center gap-2 sm:gap-3 text-center lookahead"
            >
              {currentAnn.overline && (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest font-bold bg-[#9b2c2c]/10 text-[#9b2c2c] dark:bg-[#fef3c7]/20 dark:text-[#fef3c7] px-2 py-0.5 rounded shrink-0">
                  <Sparkles className="h-2.5 w-2.5" />
                  {currentAnn.overline}
                </span>
              )}
              <p className="font-body text-[10px] md:text-xs tracking-wide font-medium truncate max-w-[50vw] sm:max-w-none">
                {currentAnn.text}
              </p>
              {currentAnn.ctaText && currentAnn.ctaHref && (
                <Link
                  href={currentAnn.ctaHref}
                  className="inline-flex items-center gap-0.5 text-[9px] md:text-xs font-mono font-bold uppercase tracking-wider text-[#9b2c2c] dark:text-[#fef3c7] hover:underline underline-offset-2 group shrink-0"
                >
                  <span>{currentAnn.ctaText}</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimalist Close Trigger */}
        <button
          onClick={handleDismiss}
          className="p-1 rounded-full hover:bg-[#805500]/10 dark:hover:bg-[#fef3c7]/10 transition-colors text-inherit shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>

      </div>
    </div>
  );
}