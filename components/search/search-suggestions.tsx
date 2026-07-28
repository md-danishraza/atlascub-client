"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Loader2, Clock, X, TrendingUp, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/use-debounce";

interface Suggestion {
  id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
}

interface SearchSuggestionsProps {
  query: string;
  onSelect: () => void;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const trendingSearches = ["Oversized Hoodies", "Summer Capsule", "Cargo Pants", "Streetwear"];

export function SearchSuggestions({ query, onSelect, isOpen, onClose, className = "" }: SearchSuggestionsProps) {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem("atlascub-recent-searches");
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored).slice(0, 5));
        } catch (e) {
          console.error("Failed to parse recent searches", e);
        }
      }
    }
  }, [isOpen]);

  // Fetch suggestions
  useEffect(() => {
    if (!isOpen) return;
    
    if (debouncedQuery.length >= 2) {
      setIsLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/products/suggestions?q=${encodeURIComponent(debouncedQuery)}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.suggestions || []);
        })
        .catch(err => console.error("Failed to fetch suggestions", err))
        .finally(() => setIsLoading(false));
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, isOpen]);

  const saveRecentSearch = (searchTerm: string) => {
    const stored = localStorage.getItem("atlascub-recent-searches");
    let searches: string[] = stored ? JSON.parse(stored) : [];
    searches = [searchTerm, ...searches.filter(s => s !== searchTerm)].slice(0, 5);
    localStorage.setItem("atlascub-recent-searches", JSON.stringify(searches));
    setRecentSearches(searches);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    saveRecentSearch(suggestion.name);
    onSelect();
  };

  const handleRecentSearchClick = (term: string) => {
    saveRecentSearch(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    onSelect();
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.removeItem("atlascub-recent-searches");
    setRecentSearches([]);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 0.2, staggerChildren: 0.05 } 
    },
    exit: { opacity: 0, y: -5, scale: 0.98, transition: { duration: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          // 🛡️ FIX: Made absolute on ALL screen sizes and used z-[100] bracket syntax
          className={`absolute top-full left-0 right-0 w-full mt-2 z-[100] rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden ${className}`}
        >
          <div className="max-h-[60vh] md:max-h-96 overflow-y-auto overscroll-contain">
            
            {/* SKELETON LOADER STATE */}
            {isLoading ? (
              <div className="p-2 space-y-1">
                <div className="p-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" /> Searching...
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                    <div className="h-12 w-12 rounded-lg bg-muted/60" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-muted/60 rounded-md w-2/3" />
                      <div className="h-3 bg-muted/60 rounded-md w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : debouncedQuery.length >= 2 && suggestions.length > 0 ? (
              
              /* RESULTS STATE */
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Products
                </div>
                <div className="space-y-1">
                  {suggestions.map((suggestion) => (
                    <motion.div key={suggestion.id} variants={itemVariants}>
                      <Link
                        href={`/product/${suggestion.slug}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="group flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted border border-border/50 shadow-sm">
                          <Image
                            src={suggestion.images[0] || "/images/placeholder.jpg"}
                            alt={suggestion.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {suggestion.name}
                          </p>
                          <p className="text-sm font-semibold text-muted-foreground mt-0.5">
                            ₹{suggestion.price.toLocaleString()}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 mr-2" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : debouncedQuery.length >= 2 && suggestions.length === 0 ? (
              
              /* NO RESULTS STATE */
              <div className="py-12 px-4 text-center">
                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No products found</p>
                <p className="text-xs text-muted-foreground mt-1">We couldn't find anything matching "{debouncedQuery}"</p>
              </div>
            ) : debouncedQuery.length === 0 ? (
              
              /* DEFAULT / RECENT / TRENDING STATE */
              <div className="p-2">
                {recentSearches.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Recent Searches
                      </span>
                      <button onClick={clearRecentSearches} className="text-xs font-medium text-primary hover:underline">
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {recentSearches.map((term, index) => (
                        <motion.button
                          key={`recent-${index}`}
                          variants={itemVariants}
                          onClick={() => handleRecentSearchClick(term)}
                          className="flex w-full items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                        >
                          <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-sm flex-1 font-medium">{term}</span>
                          <ArrowUpLeftIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                        </motion.button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5" /> Trending Now
                    </div>
                    <div className="flex flex-wrap gap-2 p-2">
                      {trendingSearches.map((term, index) => (
                        <motion.button
                          key={`trending-${index}`}
                          variants={itemVariants}
                          onClick={() => handleRecentSearchClick(term)}
                          className="px-3 py-1.5 rounded-full border border-border bg-muted/30 hover:bg-muted text-xs font-medium transition-colors"
                        >
                          {term}
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : null}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper icon for the recent searches arrow
function ArrowUpLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 17V7h10" />
      <path d="M17 7 3 21" />
    </svg>
  );
}