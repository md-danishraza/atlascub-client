"use client";

import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { SortDropdown } from "@/components/products/sort-dropdown";
import { ProductGrid } from "@/components/products/product-grid";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";
import { Button } from "@/components/ui/button";

import { SearchFilters } from "@/components/search/search-filters";
import { SearchResultsHeader } from "@/components/search/search-results-header";
import { SearchEmptyState } from "@/components/search/search-empty-state";
import { useSearch } from "@/hooks/use-search";
import { SearchHero } from "@/components/search/section-hero";

function SearchPageContent() {
  const {
    urlQuery,
    localSearchInput,
    setLocalSearchInput,
    selectedSizes,
    setSelectedSizes,
    selectedGender,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalPages,
    hybridProducts,
    isGlobalLoading,
    isGlobalFetching,
    hasActiveFilters,
    activeFiltersCount,
    handleSearchSubmit,
    toggleSize,
    toggleGender,
   
    clearEverything,
  } = useSearch();

  return (
    <div className="min-h-screen bg-background pb-20 select-none">
      {/* Search Hero */}
      <SearchHero
        localInput={localSearchInput}
        onChange={setLocalSearchInput}
        onSubmit={handleSearchSubmit}
        onClear={() => setLocalSearchInput("")}
      />

      <SlugBreadcrumb/>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Results Header */}
        <SearchResultsHeader
          isLoading={isGlobalFetching}
          resultCount={hybridProducts.length}
          urlQuery={urlQuery}
        />

        {/* Filters Panel */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-card border border-border/40 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <SearchFilters
              gender={selectedGender}
              onGenderToggle={toggleGender}
              sizes={selectedSizes}
              onSizeToggle={toggleSize}
              onClearSizes={() => setSelectedSizes([])}
              hasActiveFilters={hasActiveFilters}
              activeCount={activeFiltersCount}
            />

            {(hasActiveFilters || urlQuery) && (
              <button
                onClick={clearEverything}
                className="flex items-center gap-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-full transition-colors ml-2"
              >
                <X className="h-3 w-3" />
                Clear All
              </button>
            )}
          </div>

          <SortDropdown value={sortBy} onChange={(value) => { setSortBy(value as any); setPage(1); }} />
        </div>

        {/* Results Grid */}
        <AnimatePresence mode="wait">
          {!isGlobalLoading && !isGlobalFetching && hybridProducts.length === 0 ? (
            <SearchEmptyState query={urlQuery} onClear={clearEverything} />
          ) : (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
              <ProductGrid 
                products={hybridProducts as any} 
                isLoading={isGlobalLoading || isGlobalFetching} 
                columns={4} 
              />

              {/* Pagination */}
              {totalPages > 1 && !urlQuery && (
                <div className="mt-12 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-full"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${
                          page === i + 1
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-full"
                  >
                    Next
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}