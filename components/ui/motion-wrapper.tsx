"use client";

import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { ReactNode } from "react";

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  animation?: keyof typeof import("@/lib/animations").animations;
  delay?: number;
  className?: string;
}

export function MotionWrapper({
  children,
  animation = "fadeInUp",
  delay = 0,
  className = "",
  ...props
}: MotionWrapperProps) {
  const { animations } = require("@/lib/animations");
  const variant = animations[animation] as Variants;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variant}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}