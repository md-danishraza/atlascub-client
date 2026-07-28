import { api, API_TAGS } from "../../api";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  conversionRate: number;
  pendingOrders: number;
  lowStockItems: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  inventory: number;
  images: string[];
  price: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
  statusCounts: Record<string, number>;
}

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => ({
        url: "/dashboard/stats",
        method: "GET",
      }),
      providesTags: [API_TAGS.USER],
    }),

    getRecentOrders: builder.query<RecentOrder[], { limit?: number }>({
      query: ({ limit = 5 }) => ({
        url: `/dashboard/recent-orders?limit=${limit}`,
        method: "GET",
      }),
      providesTags: [API_TAGS.ORDERS],
    }),

    getLowStockProducts: builder.query<LowStockProduct[], { limit?: number }>({
      query: ({ limit = 5 }) => ({
        url: `/dashboard/low-stock?limit=${limit}`,
        method: "GET",
      }),
      providesTags: [API_TAGS.PRODUCTS],
    }),

    getOrderStatusCounts: builder.query<Record<string, number>, void>({
      query: () => ({
        url: "/dashboard/status-counts",
        method: "GET",
      }),
      providesTags: [API_TAGS.ORDERS],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDashboardStatsQuery,
  useGetRecentOrdersQuery,
  useGetLowStockProductsQuery,
  useGetOrderStatusCountsQuery,
} = dashboardApi;
