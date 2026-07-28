"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { categories } from "@/lib/constants/navigation";

interface CategoryDropdownProps {
  gender: "men" | "women" | "kids" | "collections";
  label: string;
}

export function CategoryDropdown({ gender, label }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const categoryList = categories[gender];

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
       <Link
        href={`/shop/${gender}`}
        className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Link>
    
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full pt-4"
          >
            <div className="w-64 rounded-lg border bg-popover p-4 shadow-lg">
              <div className="space-y-3">
                {categoryList.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="block rounded-md p-2 transition-colors hover:bg-accent"
                  >
                    <div className="font-medium">{category.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {category.description}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
     
    </div>
  );
}