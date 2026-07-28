"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { SearchSuggestions } from "@/components/search/search-suggestions";

export function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const event = new CustomEvent("searchStateChange", { detail: { isOpen: isExpanded } });
    window.dispatchEvent(event);
  }, [isExpanded]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const stored = localStorage.getItem("atlascub-recent-searches");
      let searches: string[] = stored ? JSON.parse(stored) : [];
      searches = [query, ...searches.filter(s => s !== query)].slice(0, 5);
      localStorage.setItem("atlascub-recent-searches", JSON.stringify(searches));
      
      router.push(`/search?q=${encodeURIComponent(query)}`);
      closeSearch();
    }
  };

  const closeSearch = () => {
    setIsExpanded(false);
    setQuery("");
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        if (!isExpanded) {
          setQuery("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  const handleSelectSuggestion = () => {
    closeSearch();
  };

  // 📱 MOBILE VIEW (Full-width overlay with working suggestions)
  if (isMobile && isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col"
      >
        <div className="p-4 border-b border-border/50 bg-background flex items-center gap-3 shadow-sm">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search products, categories..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              className="pl-9 pr-10 h-12 rounded-full border-primary/20 bg-muted/30 focus-visible:ring-primary/30"
              autoFocus
            />
            {query && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setQuery("")}
                className="absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full hover:bg-transparent"
              >
                <X className="h-8 w-8 text-muted-foreground" />
              </Button>
            )}
          </form>
          <Button variant="ghost" onClick={closeSearch} className="px-2">
            Cancel
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {/* 🛡️ FIX: Suggestions now render on mobile! */}
          <SearchSuggestions
            query={query}
            onSelect={handleSelectSuggestion}
            isOpen={showSuggestions} 
            onClose={() => setShowSuggestions(false)}
          />
        </div>
      </motion.div>
    );
  }

  // 💻 DESKTOP VIEW
  return (
    <div className="flex items-center" ref={containerRef}>
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative"
          >
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search everything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="pl-9 pr-10 rounded-full border-border bg-muted/20 focus-visible:ring-primary/20 transition-all shadow-inner"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={closeSearch}
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
            <SearchSuggestions
              query={query}
              onSelect={handleSelectSuggestion}
              isOpen={showSuggestions && query.length > 0}
              onClose={() => setShowSuggestions(false)}
            />
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsExpanded(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}