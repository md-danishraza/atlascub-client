import { api, API_TAGS } from "../api";

export interface Category {
  id: string;
  name: string;
  slug: string;
  gender: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  gender: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], string | void>({
      query: (gender) => ({
        url: `/categories${gender ? `?gender=${gender}` : ""}`,
        method: "GET",
      }),
      providesTags: [API_TAGS.CATEGORY],
    }),

    getCategoryBySlug: builder.query<
      Category,
      { gender: string; slug: string }
    >({
      query: ({ gender, slug }) => ({
        url: `/categories/gender/${gender}/slug/${slug}`,
        method: "GET",
      }),
      providesTags: (result, error, { slug }) => [
        { type: API_TAGS.CATEGORY, id: slug },
      ],
    }),

    createCategory: builder.mutation<Category, CreateCategoryDto>({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        data,
      }),
      invalidatesTags: [API_TAGS.CATEGORY],
    }),
    updateCategory: builder.mutation<
      Category,
      { id: string; data: UpdateCategoryDto }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [API_TAGS.CATEGORY],
    }),

    deleteCategory: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.CATEGORY],
    }),

    seedCategories: builder.mutation<void, void>({
      query: () => ({
        url: "/categories/seed",
        method: "POST",
      }),
      invalidatesTags: [API_TAGS.CATEGORY],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useSeedCategoriesMutation,
} = categoryApi;
