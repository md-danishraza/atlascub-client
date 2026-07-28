"use client";

import { useParams } from "next/navigation";
import { useGetProductByIdQuery } from "@/lib/store/apis/product-api";

export function useProduct() {
  const params = useParams();
  const slug = params.slug as string;

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useGetProductByIdQuery(slug, {
    skip: !slug,
  });

  return {
    product,
    isLoading,
    isError,
    refetch,
    slug,
  };
}
