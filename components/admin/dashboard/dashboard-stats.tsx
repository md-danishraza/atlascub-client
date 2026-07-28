"use client";


import { DollarSign, ShoppingCart, Users, TrendingUp, Clock, Package } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "../stat-card";

interface DashboardStatsProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    conversionRate: number;
    pendingOrders: number;
    lowStockItems: number;
  };
  isLoading?: boolean;
}



export function DashboardStats({ stats, isLoading = false }: DashboardStatsProps) {
    console.log(stats)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
    //   trend: { value: 12, isPositive: true },
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
    //   trend: { value: 8, isPositive: true },
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
    //   trend: { value: 5, isPositive: true },
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
    //   trend: { value: 2, isPositive: true },
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders.toLocaleString(),
      icon: Clock,
    //   trend: { value: 3, isPositive: false },
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems.toLocaleString(),
      icon: Package,
    //   trend: { value: 0, isPositive: false },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statCards.map((stat, index) => (
        <StatCard
          key={stat.title}
          {...stat}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}