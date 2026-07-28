"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ImageCarousel({ images, alt, className = "" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedIndex, setZoomedIndex] = useState(0);

  if (!images.length) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const openZoom = (index: number) => {
    setZoomedIndex(index);
    setIsZoomed(true);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full cursor-zoom-in"
            onClick={() => openZoom(currentIndex)}
          >
            <Image
              src={images[currentIndex]}
              alt={`${alt} - ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-all hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-all hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Zoom Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openZoom(currentIndex);
          }}
          className="absolute bottom-3 right-3 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-all hover:bg-white"
          aria-label="Zoom image"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md transition-all ${
                idx === currentIndex
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* ✅ FIX: Zoom Dialog - Full Screen & Large */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full sm:max-w-[90vw] sm:max-h-[90vh] border-border bg-background p-0 sm:rounded-xl overflow-hidden">
          {/* ✅ Hidden title for accessibility */}
          <VisuallyHidden>
            <DialogTitle>Image Viewer - {alt}</DialogTitle>
          </VisuallyHidden>

          <div className="relative flex h-full w-full items-center justify-center bg-black/95 p-4">
            {/* Close Button */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white transition-all hover:bg-black/80"
              aria-label="Close zoom"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Main Zoomed Image */}
            <div className="relative h-full w-full max-w-5xl max-h-[85vh]">
              <Image
                src={images[zoomedIndex]}
                alt={`${alt} zoomed`}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>

            {/* Navigation Arrows in Zoom Mode */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomedIndex((prev) => (prev - 1 + images.length) % images.length);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/70 hover:scale-105"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-7 w-7" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomedIndex((prev) => (prev + 1) % images.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/70 hover:scale-105"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-7 w-7" />
                </button>
              </>
            )}

            {/* Zoom Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-sm text-white">
              {zoomedIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}