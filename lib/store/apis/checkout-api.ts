import { api, API_TAGS } from "../api";
import { CartItem } from "../features/cartSlice";
import {
  InitiateCheckoutPayload,
  OrderResponse,
  RazorpayOrderResponse,
} from "@/types/checkout";

// Helper to map Redux cart items to checkout format
export function mapCartItemsToCheckout(cartItems: CartItem[]) {
  return cartItems.map((item) => ({
    productId: item.productId,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
  }));
}

// Define a proper custom error type
export interface CustomApiError {
  status: number;
  data?: {
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
  };
  message?: string;
}

// Type guard tailored for RTK Query + Axios base query format
export function isApiError(error: any): error is CustomApiError {
  return error && typeof error === "object" && "status" in error;
}

export const checkoutApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Initiate checkout - create order and get Razorpay details
    initiateCheckout: builder.mutation<
      RazorpayOrderResponse,
      InitiateCheckoutPayload
    >({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        data,
      }),
      invalidatesTags: [API_TAGS.ORDER],
    }),

    // Get order by ID
    getOrderById: builder.query<OrderResponse, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: API_TAGS.ORDER, id }],
    }),

    // Get order by order number (for success page)
    getOrderByNumber: builder.query<OrderResponse, string>({
      query: (orderNumber) => ({
        url: `/orders/number/${orderNumber}`,
        method: "GET",
      }),
      providesTags: (result, error, orderNumber) => [
        { type: API_TAGS.ORDER, id: orderNumber },
      ],
    }),

    // Get user's orders (for order history)
    getUserOrders: builder.query<
      {
        data: OrderResponse[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      },
      { status?: string; page?: number; limit?: number }
    >({
      query: ({ status, page = 1, limit = 10 }) => {
        const params: Record<string, string> = {
          page: String(page),
          limit: String(limit),
        };
        if (status) {
          params.status = status;
        }
        return {
          url: `/orders/user`,
          method: "GET",
          params,
        };
      },
      providesTags: [API_TAGS.ORDERS],
    }),

    // Get all orders (admin only)
    getAllOrders: builder.query<
      {
        data: OrderResponse[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      },
      { status?: string; page?: number; limit?: number }
    >({
      query: ({ status, page = 1, limit = 10 }) => ({
        url: `/orders`,
        method: "GET",
        params: { status, page, limit },
      }),
      providesTags: [API_TAGS.ORDERS],
    }),

    // Update order status (admin only)
    updateOrderStatus: builder.mutation<
      OrderResponse,
      { id: string; status: string; adminNote?: string } // 🛡️ Simplified, tracking moved to its own endpoint
    >({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: API_TAGS.ORDER, id },
        { type: API_TAGS.ORDERS },
      ],
    }),

    // Update order tracking number & Shiprocket Details (admin only)
    updateOrderTracking: builder.mutation<
      OrderResponse,
      {
        id: string;
        trackingNumber?: string;
        awbCode?: string;
        courierName?: string;
      }
    >({
      query: ({ id, trackingNumber, awbCode, courierName }) => ({
        url: `/orders/${id}/tracking`,
        method: "PATCH",
        data: { trackingNumber, awbCode, courierName },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: API_TAGS.ORDER, id },
        { type: API_TAGS.ORDERS },
      ],
    }),
    // 🔄 Customer initiates a return/replacement
    initiateReturn: builder.mutation<
      OrderResponse,
      { id: string; reason: string; returnType: string }
    >({
      query: ({ id, reason, returnType }) => ({
        url: `/orders/${id}/return`,
        method: "POST",
        data: { reason, returnType },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: API_TAGS.ORDER, id },
        { type: API_TAGS.ORDERS },
      ],
    }),

    // 🛡️ Admin approves or rejects a return
    adminReturnAction: builder.mutation<
      OrderResponse,
      { id: string; action: "APPROVED" | "REJECTED" }
    >({
      query: ({ id, action }) => ({
        url: `/orders/${id}/return-action`,
        method: "PATCH",
        data: { action },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: API_TAGS.ORDER, id },
        { type: API_TAGS.ORDERS },
      ],
    }),
  }),
  overrideExisting: false,
});

// Export hooks
export const {
  useInitiateCheckoutMutation,
  useGetOrderByIdQuery,
  useGetOrderByNumberQuery,
  useGetUserOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderTrackingMutation,
  useInitiateReturnMutation,
  useAdminReturnActionMutation,
} = checkoutApi;
