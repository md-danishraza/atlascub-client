import { api, API_TAGS } from "../api";
import { Product } from "./product-api";

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  type?: string;
  badge?: string;
  isActive: boolean;
  products?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionDto {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  type?: string;
  badge?: string;
  isActive?: boolean;
}

export interface UpdateCollectionDto extends Partial<CreateCollectionDto> {}

export const collectionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCollections: builder.query<Collection[], void>({
      query: () => ({
        url: "/collections",
        method: "GET",
      }),
      providesTags: [API_TAGS.COLLECTION],
    }),

    getCollectionById: builder.query<Collection, string>({
      query: (id) => ({
        url: `/collections/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: API_TAGS.COLLECTION, id }],
    }),

    createCollection: builder.mutation<Collection, CreateCollectionDto>({
      query: (data) => ({
        url: "/collections",
        method: "POST",
        data,
      }),
      invalidatesTags: [API_TAGS.COLLECTION],
    }),

    updateCollection: builder.mutation<
      Collection,
      { id: string; data: UpdateCollectionDto }
    >({
      query: ({ id, data }) => ({
        url: `/collections/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: API_TAGS.COLLECTION, id },
      ],
    }),

    deleteCollection: builder.mutation<void, string>({
      query: (id) => ({
        url: `/collections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.COLLECTION],
    }),

    addProductToCollection: builder.mutation<
      void,
      { collectionId: string; productId: string }
    >({
      query: ({ collectionId, productId }) => ({
        url: `/collections/${collectionId}/products/${productId}`,
        method: "POST",
      }),
      invalidatesTags: [API_TAGS.COLLECTION, API_TAGS.PRODUCT],
    }),

    removeProductFromCollection: builder.mutation<
      void,
      { collectionId: string; productId: string }
    >({
      query: ({ collectionId, productId }) => ({
        url: `/collections/${collectionId}/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.COLLECTION, API_TAGS.PRODUCT],
    }),

    getCollectionProducts: builder.query<
      { collection: Collection; products: Product[]; totalProducts: number },
      string
    >({
      query: (id) => ({
        url: `/collections/${id}/products`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: API_TAGS.COLLECTION, id },
        { type: API_TAGS.PRODUCTS, id: `collection-${id}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCollectionsQuery,
  useGetCollectionByIdQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useAddProductToCollectionMutation,
  useRemoveProductFromCollectionMutation,
  useGetCollectionProductsQuery,
} = collectionApi;
