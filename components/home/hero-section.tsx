"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { heroSlides } from "@/lib/constants/homepage";
import { TextReveal } from "../shadcn-space/animated-text/animated-text-06";

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax effects tied to the inner card
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0px", "-50px"]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    resetTimer();
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    resetTimer();
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    resetTimer();
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(handleNext, 6500);
  };

  useEffect(() => {
    timerRef.current = setInterval(handleNext, 6500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const activeSlide = heroSlides[currentIndex];

  return (
    <section 
      aria-roledescription="carousel"
      className="relative h-screen min-h-[700px] w-full bg-background/30 px-4 pb-4 md:px-6 md:pb-6 pt-8 md:pt-4 flex flex-col"
    >
      
      {/* 🚀 SEO SHADOW DOM: Instantly readable by Googlebot before JS executes */}
      <div className="sr-only">
        <h1>{heroSlides[0].title}</h1>
        <h2>{heroSlides[0].overline}</h2>
        <p>{heroSlides[0].subtitle}</p>
      </div>

      {/* Inner Rounded Card containing the actual carousel */}
      <div 
        ref={containerRef}
        className="relative flex-1 w-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl bg-black"
        aria-live="polite"
      >
        {/* Parallax Background Wrapper */}
        <motion.div
          style={{ y: yBg, scale: scaleBg }}
          className="absolute inset-0 z-0 origin-top"
        >
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0"
            >
              <motion.div
                initial={{ scale: 1.02 }}
                animate={{ scale: 1.1 }}
                transition={{ duration: 8, ease: "linear" }}
                className="relative h-full w-full"
              >
                <Image
                  src={activeSlide.image}
                  alt={`Atlascub - ${activeSlide.title}`}
                  fill
                  priority={currentIndex === 0} // Only prioritize LCP for the first image
                  fetchPriority={currentIndex === 0 ? "high" : "auto"} // Speeds up First Contentful Paint
                  className="object-cover object-center"
                  sizes="100vw"
                />
              </motion.div>

              {/* Elegant Gradient Overlay to ensure text legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Text Content Overlay */}
        <motion.div
          style={{ y: yText }}
          className="absolute inset-0 z-10 flex flex-col items-start justify-center p-8 md:p-16 lg:p-24"
          aria-hidden="true" /* 🚀 Hides animated fragmented text from confusing Screen Readers/Bots */
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="max-w-2xl space-y-4 md:space-y-6"
            >
              {/* Overline */}
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="block text-xs md:text-sm tracking-[0.25em] uppercase font-secondary text-white/80"
              >
                {activeSlide.overline}
              </motion.span>

              {/* Title */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] } },
                }}
              >
                <TextReveal
                  text={activeSlide.title}
                  as="div" /* 🚀 Changed from 'h1' to 'div' since the real H1 is in the sr-only block */
                  className="text-5xl sm:text-6xl md:text-7xl font-primary font-bold tracking-tight text-white leading-[1.05]"
                />
              </motion.div>

              {/* Subtitle */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] } },
                }}
              >
                <TextReveal
                  text={activeSlide.subtitle}
                  as="div" /* 🚀 Changed from 'p' to 'div' */
                  className="text-base sm:text-lg md:text-xl font-body text-white/80 max-w-md leading-relaxed"
                />
              </motion.div>

              {/* Fintech-Style Pill Buttons */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="flex flex-wrap items-center gap-4 pt-6"
              >
                {/* Primary Pill Button with Icon Circle */}
                <Link
                  href={activeSlide.ctaPrimary.href}
                  className="group flex items-center bg-white text-black hover:bg-white/90 transition-all duration-300 rounded-full pl-6 pr-2 py-2 font-medium shadow-xl text-sm md:text-base"
                >
                  <span className="mr-4">{activeSlide.ctaPrimary.text}</span>
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-black text-white group-hover:bg-primary transition-colors duration-300">
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </Link>

                {/* Secondary Ghost Pill */}
                <Link
                  href={activeSlide.ctaSecondary.href}
                  className="group inline-flex items-center justify-center bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all duration-300 px-6 py-3 font-medium rounded-full text-sm md:text-base"
                >
                  {activeSlide.ctaSecondary.text}
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation Arrows */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-4">
          <button
            onClick={handlePrev}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="absolute bottom-8 left-8 md:left-16 z-20 flex gap-4">
          {heroSlides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => handleDotClick(index)}
                className="group flex flex-col items-start focus:outline-none"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div className="flex items-center gap-2 mb-2 text-[10px] font-mono uppercase tracking-wider text-white/50 group-hover:text-white transition-colors">
                  <span>0{index + 1}</span>
                </div>
                <div className="h-[2px] w-12 md:w-16 bg-white/20 relative rounded-full overflow-hidden">
                  {isActive && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 6.5, ease: "linear" }}
                      className="absolute inset-y-0 left-0 bg-white"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
