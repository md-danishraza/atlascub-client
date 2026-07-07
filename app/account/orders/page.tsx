"use client";

import { useState } from "react";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  ShoppingBag,
  AlertCircle,
  RefreshCcw,
  Coins
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderCard } from "@/components/orders/order-card";
import { useGetUserOrdersQuery } from "@/lib/store/apis/checkout-api";

// Status tabs configuration for customers
const statusTabs: { value: string; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All Orders", icon: Package },
  { value: "COD_REQUESTED", label: "COD Pending", icon: Coins }, // 🛡️ Added: Customer tracking of COD requests
  { value: "PENDING", label: "Prepaid Pending", icon: Clock },
  { value: "PAID", label: "Paid", icon: CheckCircle },
  { value: "SHIPPED", label: "Shipped", icon: Truck },
  { value: "DELIVERED", label: "Delivered", icon: Package },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle },
];

export default function AccountOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // 1. Unfiltered query to calculate stable tab counts (cached automatically)
  const { data: statsData } = useGetUserOrdersQuery({ limit: 100 });

  // 2. Filtered query for the actual paginated table
  const { data, isLoading, isError, isFetching, refetch } = useGetUserOrdersQuery({
    status: statusFilter !== "all" ? statusFilter : undefined,
    page,
    limit,
  });

  const orders = data?.data || [];
  const filteredTotal = data?.total || 0;
  const totalPages = data?.totalPages || 0;
  const globalTotal = statsData?.total || 0;

  // Calculate persistent status counts from the UNFILTERED dataset
  const statusCounts = (statsData?.data || []).reduce((acc: any, order: any) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-1" />
        </div>
        <Skeleton className="h-10 w-full max-w-2xl rounded-full" />
        <div className="space-y-4 pt-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-md font-primary">My Orders</h1>
            <p className="text-muted-foreground">Track and manage your orders</p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="py-12">
            <EmptyState
              title="Failed to load orders"
              description="There was an error loading your orders. Please check your connection and try again."
              action={{ label: "Retry Connection", onClick: () => refetch() }}
              icon={AlertCircle}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-primary font-bold tracking-tight text-foreground">My Orders</h1>
          <p className="text-muted-foreground mt-1">Track, manage, and review your past purchases.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()} 
          disabled={isLoading || isFetching}
          className="w-fit"
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

    
      {/* ✅ FIX: Match admin orders page layout */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {statusTabs.map((tab) => {
          const count = tab.value === "all" ? globalTotal : statusCounts[tab.value] || 0;
          const isActive = statusFilter === tab.value;
          
          return (
            <button
              key={tab.value}
              onClick={() => handleStatusChange(tab.value)}
              className={`rounded-xl border p-3 text-center transition-all duration-300 ${
                isActive
                  ? "border-primary bg-primary/5 shadow-sm scale-[1.02]"
                  : "border-border/60 bg-card hover:border-primary/30 hover:bg-muted/50"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 mb-1.5 text-center">
                <tab.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {tab.label}
                </span>
              </div>
              <p className={`text-2xl font-bold font-primary ${isActive ? "text-primary" : "text-foreground"}`}>
                {count}
              </p>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="border-border/60 shadow-sm bg-muted/10">
          <CardContent className="py-16">
            <EmptyState
              title={statusFilter === "all" ? "No orders yet" : `No ${statusFilter.toLowerCase()} orders`}
              description={
                statusFilter === "all" 
                  ? "You haven't placed any orders yet. Start shopping to see your orders here."
                  : `You don't have any orders currently marked as ${statusFilter.toLowerCase()}.`
              }
              icon={ShoppingBag}
              action={statusFilter === "all" ? {
                label: "Start Shopping",
                href: "/shop"
              } : {
                label: "Clear Filters",
                onClick: () => handleStatusChange("all"),
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/60 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              {statusFilter === "all" ? "Order History" : `${statusTabs.find(t => t.value === statusFilter)?.label} Orders`}
              <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {filteredTotal} found
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="space-y-0 sm:space-y-4 divide-y divide-border sm:divide-none">
              {orders.map((order: any) => (
                <div key={order.id} className="p-4 sm:p-0">
                  <OrderCard order={order} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 border-t border-border/60 p-4 sm:p-0 sm:pt-6 sm:mt-6">
                <p className="text-sm font-medium text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-full px-6"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-full px-6"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}