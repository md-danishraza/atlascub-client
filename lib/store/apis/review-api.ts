import { api, API_TAGS } from "../api";

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  isVerified: boolean;
  createdAt: string;
}

export interface CreateReviewDto {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
}

export const reviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query<Review[], string>({
      query: (productId) => ({
        url: `/reviews/product/${productId}`,
        method: "GET",
      }),
      providesTags: (result, error, productId) => [
        { type: API_TAGS.PRODUCT, id: `${productId}-reviews` },
      ],
    }),

    createReview: builder.mutation<Review, CreateReviewDto>({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: API_TAGS.PRODUCT, id: `${productId}-reviews` },
        { type: API_TAGS.PRODUCT, id: productId },
      ],
    }),

    deleteReview: builder.mutation<void, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.PRODUCT],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
