"use client";

import { motion } from "framer-motion";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchEmptyStateProps {
  query: string;
  onClear: () => void;
}

export function SearchEmptyState({ query, onClear }: SearchEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border"
    >
      <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <SearchIcon className="h-8 w-8 text-muted-foreground opacity-50" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No matching styles found</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        We couldn't find any garments matching "{query}" with your active filters.
      </p>
      <Button onClick={onClear} className="rounded-full px-8">
        Clear All Filters & Search
      </Button>
    </motion.div>
  );
}