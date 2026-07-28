"use client";

import { motion } from "framer-motion";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelect: (size: string) => void;
}

export function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Select Size</h3>
        {selectedSize && (
          <span className="text-xs text-primary">Selected: {selectedSize}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <motion.button
            key={size}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(size)}
            className={`flex h-10 w-12 items-center justify-center rounded-md border text-sm font-medium transition-all ${
              selectedSize === size
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:border-primary"
            }`}
          >
            {size}
          </motion.button>
        ))}
      </div>
    </div>
  );
}