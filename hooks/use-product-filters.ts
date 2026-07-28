"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface ProductFiltersState {
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: "newest" | "price_asc" | "price_desc" | "popularity";
}

const DEFAULT_FILTERS: ProductFiltersState = {
  sizes: [],
  colors: [],
  priceRange: [0, 50000],
  inStockOnly: false,
  sortBy: "newest",
};

export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  const [filters, setFilters] = useState<ProductFiltersState>(DEFAULT_FILTERS);

  // Initialize from URL params
  useEffect(() => {
    if (!isInitialized) {
      const sizes = searchParams.get("sizes")?.split(",").filter(Boolean) || [];
      const colors =
        searchParams.get("colors")?.split(",").filter(Boolean) || [];
      const minPrice = parseInt(searchParams.get("minPrice") || "0");
      const maxPrice = parseInt(searchParams.get("maxPrice") || "50000");
      const inStockOnly = searchParams.get("inStock") === "true";
      const sortBy =
        (searchParams.get("sortBy") as ProductFiltersState["sortBy"]) ||
        "newest";

      setFilters({
        sizes,
        colors,
        priceRange: [minPrice, maxPrice],
        inStockOnly,
        sortBy,
      });
      setIsInitialized(true);
    }
  }, [searchParams, isInitialized]);

  const updateFilters = useCallback(
    (newFilters: Partial<ProductFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (filters.sizes.length > 0) {
      params.set("sizes", filters.sizes.join(","));
    }
    if (filters.colors.length > 0) {
      params.set("colors", filters.colors.join(","));
    }
    if (filters.priceRange[0] > 0) {
      params.set("minPrice", filters.priceRange[0].toString());
    }
    if (filters.priceRange[1] < 50000) {
      params.set("maxPrice", filters.priceRange[1].toString());
    }
    if (filters.inStockOnly) {
      params.set("inStock", "true");
    }
    if (filters.sortBy !== "newest") {
      params.set("sortBy", filters.sortBy);
    }

    const queryString = params.toString();
    const newUrl = `${pathname}${queryString ? `?${queryString}` : ""}`;
    router.push(newUrl);
  }, [filters, pathname, router]);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    router.push(pathname);
  }, [pathname, router]);

  const hasActiveFilters =
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 50000 ||
    filters.inStockOnly ||
    filters.sortBy !== "newest";

  return {
    filters,
    updateFilters,
    applyFilters,
    clearFilters,
    hasActiveFilters,
  };
}
