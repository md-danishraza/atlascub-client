"use client";

import { SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchHeroProps {
  localInput: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
}

export function SearchHero({ localInput, onChange, onSubmit, onClear }: SearchHeroProps) {
  return (
    <div className="bg-muted/30 border-b border-border/40 py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-primary font-bold tracking-tight mb-4 text-foreground">
            Find Your Style
          </h1>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Discover garments by keyword or describe your vibe semantically (e.g., "breathable shirts for summer").
          </p>
          
          <form 
            onSubmit={onSubmit} 
            className="relative flex items-center shadow-sm rounded-full bg-background border border-border/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all"
          >
            <SearchIcon className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Describe your styling vibe or look..."
              value={localInput}
              onChange={(e) => onChange(e.target.value)}
              className="pl-12 pr-28 h-14 rounded-full border-none shadow-none focus-visible:ring-0 text-base bg-transparent"
            />
            <div className="absolute right-2 flex items-center gap-1">
              {localInput && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClear} 
                  className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button type="submit" className="rounded-full px-6 h-10 font-medium">
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}