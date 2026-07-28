import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

import type { AxiosRequestConfig, AxiosError } from "axios";
import apiClient from "./apis/axios-client";

interface ApiError {
  status?: number;
  data?: unknown;
  message?: string;
}

// Custom base query using our token-aware axios client
export const axiosBaseQuery = (): BaseQueryFn<
  {
    url: string;
    method?: AxiosRequestConfig["method"];
    data?: AxiosRequestConfig["data"];
    params?: AxiosRequestConfig["params"];
    headers?: AxiosRequestConfig["headers"];
  },
  unknown,
  ApiError
> => {
  return async ({ url, method = "GET", data, params, headers }) => {
    try {
      const result = await apiClient({
        url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<{ message?: string }>;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        },
      };
    }
  };
};

// API Tags for cache invalidation
export const API_TAGS = {
  PRODUCT: "Product",
  PRODUCTS: "Products",
  CATEGORY: "Category",
  ORDER: "Order",
  ORDERS: "Orders",
  USER: "User",
  WISHLIST: "Wishlist",
  CART: "Cart",
  COLLECTION: "Collection",
  SETTINGS: "Settings",
  ADDRESSES: "Addresses",
  CHATHISTORY: "ChatHistory",
} as const;

export type APITagType = (typeof API_TAGS)[keyof typeof API_TAGS];

// Initialize API service with base configuration
export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: Object.values(API_TAGS) as APITagType[],
  endpoints: () => ({}),
  keepUnusedDataFor: 60,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: false,
});

// Export hooks
export const { usePrefetch } = api;
