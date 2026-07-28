import { api, API_TAGS } from "../api";
import { WishlistItem } from "../features/wishlistSlice";

export interface WishlistSyncResponse {
  success: boolean;
  items: WishlistItem[];
}

export const wishlistApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistItem[], void>({
      query: () => ({
        url: "/wishlist",
        method: "GET",
      }),

      providesTags: [API_TAGS.WISHLIST],
    }),

    syncWishlist: builder.mutation<WishlistSyncResponse, WishlistItem[]>({
      query: (items) => ({
        url: "/wishlist/sync",
        method: "POST",
        data: { items },
      }),
      invalidatesTags: [API_TAGS.WISHLIST],
    }),
  }),
  overrideExisting: false,
});

export const { useGetWishlistQuery, useSyncWishlistMutation } = wishlistApi;
