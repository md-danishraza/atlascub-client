"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  animated?: boolean;
  withGlow?: boolean;
  variant?: "default" | "compact" | "full";
}

export function Logo({ 
  className = "", 
  width = 120, 
  height = 40,
  animated = true,
  withGlow = true,
  variant = "default"
}: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = !mounted 
    ? "/logo/logoblack.png" 
    : resolvedTheme === "dark" 
      ? "/logo/logoLight.png" 
      : "/logo/logoblack.png";

  const logoVariants: Variants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    hover: animated ? {
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeOut" }
    } : {},
    tap: animated ? {
      scale: 0.98,
      transition: { duration: 0.1 }
    } : {}
  };

  const glowVariants: Variants = withGlow ? {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: [0, 0.5, 0],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "easeInOut"
      }
    }
  } : {};

  const compactWidth = variant === "compact" ? 80 : variant === "full" ? 160 : width;
  const compactHeight = variant === "compact" ? 28 : variant === "full" ? 50 : height;

  return (
    <Link href="/" className={`relative block ${className}`}>
      {/* Glow effect behind logo */}
      {withGlow && (
        <motion.div
          variants={glowVariants}
          initial="initial"
          animate="animate"
          className="absolute inset-0 rounded-full blur-xl"
          style={{
            background: `radial-gradient(circle, ${!mounted ? 'rgba(155,44,44,0.3)' : resolvedTheme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(155,44,44,0.3)'} 0%, transparent 70%)`,
            opacity: 0,
          }}
        />
      )}
      
      {/* Main logo with animations */}
      <motion.div
        variants={logoVariants}
        initial="initial"
        animate="animate"
        whileHover={animated ? "hover" : undefined}
        whileTap={animated ? "tap" : undefined}
        className="relative"
      >
        <Image
          src={logoSrc}
          alt="Atlascub — Premium Clothing"
          width={compactWidth}
          height={compactHeight}
          className="object-contain min-w-[50px] transition-all duration-300"
          priority
        />
      </motion.div>
    </Link>
  );
}