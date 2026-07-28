import { api, API_TAGS } from "../api";

// Types
export interface ColorOption {
  name: string;
  value: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  gender: string;
  description?: string;
}
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  sizes: string[];
  colors: ColorOption[];
  category: Category; // Now it's an object, not string
  gender: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  inStock: boolean;
  inventory: number;
  details?: string;
  sizing?: string;
  shipping?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  sizes: string[];
  colors: ColorOption[];
  category: string; // This is the category slug
  gender: string;
  tags?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock?: boolean;
  inventory?: number;
  details?: string;
  sizing?: string;
  shipping?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface ProductFilters {
  search?: string;
  gender?: string;
  category?: string; // This is category slug
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "newest" | "price_asc" | "price_desc" | "popularity";
  page?: number;
  limit?: number;
  inStock?: boolean | string;
  includeDeleted?: boolean;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Inject product endpoints
export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products with filters
    getProducts: builder.query<ProductsResponse, ProductFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              if (Array.isArray(value)) {
                // For array values, append each item separately
                value.forEach((v) => params.append(key, v));
              } else {
                params.append(key, String(value));
              }
            }
          });
        }
        const queryString = params.toString();
        return {
          url: `/products${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(
                ({ id }) => ({ type: API_TAGS.PRODUCT, id } as const)
              ),
              { type: API_TAGS.PRODUCTS, id: "LIST" },
            ]
          : [{ type: API_TAGS.PRODUCTS, id: "LIST" }],
    }),

    // Get single product by ID or slug
    getProductById: builder.query<Product, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: API_TAGS.PRODUCT, id }],
    }),

    // Get new arrivals
    getNewArrivals: builder.query<Product[], { limit?: number } | void>({
      query: (params) => {
        const limit = params?.limit ? `?limit=${params.limit}` : "";
        return {
          url: `/products/new-arrivals${limit}`,
          method: "GET",
        };
      },
      providesTags: [{ type: API_TAGS.PRODUCTS, id: "NEW_ARRIVALS" }],
    }),

    // Get best sellers
    getBestSellers: builder.query<Product[], { limit?: number } | void>({
      query: (params) => {
        const limit = params?.limit ? `?limit=${params.limit}` : "";
        return {
          url: `/products/best-sellers${limit}`,
          method: "GET",
        };
      },
      providesTags: [{ type: API_TAGS.PRODUCTS, id: "BEST_SELLERS" }],
    }),

    // Get products by gender
    getProductsByGender: builder.query<
      Product[],
      { gender: string; limit?: number }
    >({
      query: ({ gender, limit }) => ({
        url: `/products/gender/${gender}${limit ? `?limit=${limit}` : ""}`,
        method: "GET",
      }),
      providesTags: (result, error, { gender }) => [
        { type: API_TAGS.CATEGORY, id: `gender-${gender}` },
      ],
    }),

    // Get products by category
    getProductsByCategory: builder.query<
      Product[],
      { gender: string; category: string; limit?: number }
    >({
      query: ({ gender, category, limit }) => ({
        url: `/products/category/${gender}/${category}${
          limit ? `?limit=${limit}` : ""
        }`,
        method: "GET",
      }),
      providesTags: (result, error, { gender, category }) => [
        { type: API_TAGS.CATEGORY, id: `${gender}-${category}` },
      ],
    }),

    // Create product (Admin only)
    createProduct: builder.mutation<Product, CreateProductDto>({
      query: (data) => ({
        url: "/products",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: API_TAGS.PRODUCTS, id: "LIST" }],
    }),

    // Update product (Admin only)
    updateProduct: builder.mutation<
      Product,
      { id: string; data: UpdateProductDto }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: API_TAGS.PRODUCT, id },
        { type: API_TAGS.PRODUCTS, id: "LIST" },
      ],
    }),

    // Delete product (soft delete, Admin only)
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: API_TAGS.PRODUCT, id },
        { type: API_TAGS.PRODUCTS, id: "LIST" },
      ],
    }),

    // Restore product (Admin only)
    restoreProduct: builder.mutation<Product, string>({
      query: (id) => ({
        url: `/products/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: API_TAGS.PRODUCT, id },
        { type: API_TAGS.PRODUCTS, id: "LIST" },
      ],
    }),
    // hard delete
    hardDeleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}/permanent`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: API_TAGS.PRODUCT, id },
        { type: API_TAGS.PRODUCTS, id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

// Export hooks
export const {
  // Queries
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetNewArrivalsQuery,
  useGetBestSellersQuery,
  useGetProductsByGenderQuery,
  useGetProductsByCategoryQuery,
  // Mutations
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRestoreProductMutation,
  useHardDeleteProductMutation,
  // Prefetch
  usePrefetch: usePrefetchProducts,
} = productApi;
