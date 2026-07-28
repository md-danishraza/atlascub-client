"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingBlobs() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch on initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Primary Color Blob */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -70, 50, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[20%] left-[15%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-primary/5 blur-[120px]"
      />

      {/* Secondary Color Blob */}
      <motion.div
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 100, -80, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-secondary/20 blur-[100px]"
      />

      {/* Accent Color Blob (Center) */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 50, -50, 0],
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-accent/20 blur-[100px]"
      />
    </div>
  );
}
