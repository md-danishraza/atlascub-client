"use client";

import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";


import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats";
import { RecentOrders } from "@/components/admin/dashboard/dashboard-recent-orders";
import { LowStockAlert } from "@/components/admin/dashboard/dashboard-low-stocks";
import {
  useGetDashboardStatsQuery,
  useGetRecentOrdersQuery,
  useGetLowStockProductsQuery,
} from "@/lib/store/apis/admin/dashboard-api";

export default function AdminDashboard() {
  const { user } = useUser();

  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: recentOrders, isLoading: ordersLoading } = useGetRecentOrdersQuery({ limit: 5 });
  const { data: lowStock, isLoading: stockLoading } = useGetLowStockProductsQuery({ limit: 5 });

  const isLoading = statsLoading || ordersLoading || stockLoading;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 p-6"
      >
        <h1 className="heading-md font-primary">
          Welcome back, {user?.firstName || "Admin"}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here's what's happening with your store today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <DashboardStats stats={stats!} isLoading={isLoading} />

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentOrders orders={recentOrders || []} isLoading={ordersLoading} />
        <LowStockAlert products={lowStock || []} isLoading={stockLoading} />
      </div>
    </div>
  );
}