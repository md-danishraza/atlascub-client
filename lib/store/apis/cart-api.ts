import { api, API_TAGS } from "../api";
import { CartItem } from "../features/cartSlice";

export interface CartSyncResponse {
  success: boolean;
  items: CartItem[];
  message?: string;
}

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch cart from backend
    getCart: builder.query<CartItem[], void>({
      query: () => ({
        url: "/cart",
        method: "GET",
      }),
      providesTags: [API_TAGS.CART],
    }),

    // Sync cart to backend
    syncCart: builder.mutation<CartSyncResponse, CartItem[]>({
      query: (items) => ({
        url: "/cart/sync",
        method: "POST",
        data: { items },
      }),
      invalidatesTags: [API_TAGS.CART],
    }),

    // Clear cart on backend
    clearCartOnBackend: builder.mutation<void, void>({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.CART],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCartQuery,
  useSyncCartMutation,
  useClearCartOnBackendMutation,
} = cartApi;
