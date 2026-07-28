"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useGetProductsQuery } from "@/lib/store/apis/product-api";
import { useSemanticSearchQuery } from "@/lib/store/apis/rag-api";

export function useSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") || "";

  // State
  const [localSearchInput, setLocalSearchInput] = useState(urlQuery);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "newest" | "price_asc" | "price_desc" | "popularity"
  >("newest");
  const [page, setPage] = useState(1);
  const limit = 12;

  // Sync input with URL
  useEffect(() => {
    setLocalSearchInput(urlQuery);
  }, [urlQuery]);

  // Keyword Search Query
  const keywordQueryParams = {
    search: urlQuery || undefined,
    gender: selectedGender !== "all" ? selectedGender : undefined,
    sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
    sortBy: sortBy !== "newest" ? sortBy : undefined,
    page,
    limit,
  };

  const {
    data: keywordData,
    isLoading: isKeywordLoading,
    isFetching: isKeywordFetching,
  } = useGetProductsQuery(keywordQueryParams);

  // Semantic Search Query
  const {
    data: semanticData,
    isLoading: isSemanticLoading,
    isFetching: isSemanticFetching,
  } = useSemanticSearchQuery(
    { q: urlQuery, limit, threshold: 0.35 },
    { skip: !urlQuery }
  );

  const isGlobalLoading = isKeywordLoading || isSemanticLoading;
  const isGlobalFetching = isKeywordFetching || isSemanticFetching;

  // Hybrid Merge
  const hybridProducts = useMemo(() => {
    const keywordProducts = keywordData?.data || [];
    const semanticProducts = semanticData || [];

    if (!urlQuery) {
      return keywordProducts;
    }

    const deduplicationMap = new Map<string, any>();

    semanticProducts.forEach((prod) => {
      deduplicationMap.set(prod.id, {
        ...prod,
        isSemanticMatch: true,
        matchScore: prod.similarityScore || 0.8,
      });
    });

    keywordProducts.forEach((prod) => {
      if (deduplicationMap.has(prod.id)) {
        const existing = deduplicationMap.get(prod.id);
        deduplicationMap.set(prod.id, {
          ...existing,
          isKeywordMatch: true,
          matchScore: Math.min(1.0, existing.matchScore + 0.15),
        });
      } else {
        deduplicationMap.set(prod.id, {
          ...prod,
          isKeywordMatch: true,
          matchScore: 0.5,
        });
      }
    });

    const processedList = Array.from(deduplicationMap.values());

    if (sortBy === "price_asc") {
      return processedList.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price_desc") {
      return processedList.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "popularity") {
      return processedList.sort(
        (a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)
      );
    }

    return processedList.sort((a, b) => b.matchScore - a.matchScore);
  }, [keywordData, semanticData, urlQuery, sortBy]);

  // ✅ Fix: totalPages from keywordData
  const totalPages = keywordData?.totalPages || 1;

  // Actions
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (localSearchInput.trim()) {
      params.set("q", localSearchInput.trim());
    } else {
      params.delete("q");
    }
    setPage(1);
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setPage(1);
  };

  const toggleGender = (gender: string) => {
    setSelectedGender((prev) => (prev === gender ? "all" : gender));
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedGender("all");
    setPage(1);
  };

  const clearEverything = () => {
    clearFilters();
    setLocalSearchInput("");
    router.push(pathname);
  };

  const hasActiveFilters = selectedSizes.length > 0 || selectedGender !== "all";
  const activeFiltersCount =
    selectedSizes.length + (selectedGender !== "all" ? 1 : 0);

  return {
    // State
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
    // Actions
    handleSearchSubmit,
    toggleSize,
    toggleGender,
    clearFilters,
    clearEverything,
  };
}
