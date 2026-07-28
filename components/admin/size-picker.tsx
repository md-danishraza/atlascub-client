"use client";

import { motion } from "framer-motion";

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

interface SizePickerProps {
  selectedSizes: string[];
  onChange: (sizes: string[]) => void;
  error?: string;
}

export function SizePicker({ selectedSizes, onChange, error }: SizePickerProps) {
  const toggleSize = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    onChange(newSizes);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Sizes *</label>
      <div className="flex flex-wrap gap-2">
        {sizeOptions.map((size) => (
          <motion.button
            key={size}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleSize(size)}
            className={`h-10 w-12 rounded-md border text-sm font-medium transition-all ${
              selectedSizes.includes(size)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:border-primary"
            }`}
          >
            {size}
          </motion.button>
        ))}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}