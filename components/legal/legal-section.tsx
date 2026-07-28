"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface LegalSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  delay?: number;
}

export function LegalSection({ id, title, children, delay = 0 }: LegalSectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      className="scroll-mt-24"
    >
      <h2 className="heading-sm font-primary text-foreground mb-4">{title}</h2>
      <div className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-primary prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
        {children}
      </div>
    </motion.section>
  );
}