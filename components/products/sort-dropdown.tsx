"use client";

import { useState } from "react";
import { ArrowUpDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SortOption {
  label: string;
  value: "newest" | "price_asc" | "price_desc" | "popularity";
}

const sortOptions: SortOption[] = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Popular", value: "popularity" },
];

interface SortDropdownProps {
  value: string;
  onChange: (value: SortOption["value"]) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const selectedOption = sortOptions.find((opt) => opt.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 border-border">
          <ArrowUpDown className="h-4 w-4" />
          <span className="hidden sm:inline">Sort by:</span>
          <span className="font-medium">{selectedOption?.label || "Featured"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            {option.label}
            {value === option.value && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}