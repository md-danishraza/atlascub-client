"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const genders = ["men", "women", "kids"];

interface SearchFiltersProps {
  gender: string;
  onGenderToggle: (g: string) => void;
  sizes: string[];
  onSizeToggle: (s: string) => void;
  onClearSizes: () => void;
  hasActiveFilters: boolean;
  activeCount: number;
}

export function SearchFilters({
  gender,
  onGenderToggle,
  sizes,
  onSizeToggle,
  onClearSizes,
  hasActiveFilters,
  activeCount,
}: SearchFiltersProps) {
  // Mobile Filter Content
  const MobileFilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-3">
          Department
        </h3>
        <div className="flex flex-wrap gap-2">
          {genders.map((g) => (
            <button
              key={g}
              onClick={() => onGenderToggle(g)}
              className={`h-9 px-4 rounded-full border text-sm font-medium transition-all duration-300 ${
                gender === g
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border/60 bg-muted/20 hover:border-primary/50 hover:bg-muted/50 text-foreground"
              }`}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border/40">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            Sizes
          </h3>
          {sizes.length > 0 && (
            <button onClick={onClearSizes} className="text-xs text-primary hover:underline font-medium">
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeToggle(size)}
              className={`h-10 w-12 rounded-lg border text-sm font-medium transition-all duration-300 ${
                sizes.includes(size)
                  ? "border-primary bg-primary text-primary-foreground shadow-sm scale-105"
                  : "border-border/60 bg-muted/20 hover:border-primary/50 hover:bg-muted/50 text-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary" className="gap-2 lg:hidden rounded-full">
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full max-w-sm p-6 bg-background">
          <SheetHeader className="mb-6">
            <SheetTitle className="font-primary text-2xl">Refine Selection</SheetTitle>
          </SheetHeader>
          <MobileFilterContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Filters */}
      <div className="hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground mr-2">Gender:</span>
          {genders.map((g) => (
            <button
              key={g}
              onClick={() => onGenderToggle(g)}
              className={`text-sm px-3.5 py-1.5 rounded-full transition-colors ${
                gender === g 
                  ? "bg-primary text-primary-foreground font-semibold" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="w-px h-6 bg-border/60" />
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground mr-2">Sizes:</span>
          {availableSizes.map((s) => (
            <button
              key={s}
              onClick={() => onSizeToggle(s)}
              className={`text-sm px-3.5 py-1.5 rounded-full transition-colors ${
                sizes.includes(s) 
                  ? "bg-primary text-primary-foreground font-semibold" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}