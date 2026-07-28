"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  RotateCcw,
  Search,
  AlertCircle,
  RefreshCcw,
  Coins,
  ThumbsUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderCard } from "@/components/orders/order-card";
import { useGetAllOrdersQuery } from "@/lib/store/apis/checkout-api";

const statusTabs: { value: string; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All", icon: Package },
  { value: "COD_REQUESTED", label: "COD Requests", icon: Coins }, 
  { value: "CONFIRMED", label: "Confirmed (COD)", icon: ThumbsUp }, 
  { value: "PENDING", label: "Prepaid Pending", icon: Clock }, 
  { value: "PAID", label: "Paid", icon: CheckCircle },
  { value: "SHIPPED", label: "Shipped", icon: Truck },
  { value: "DELIVERED", label: "Delivered", icon: Package },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle },
  { value: "RETURN_REQUESTED", label: "Return Req", icon: RotateCcw },
];

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: statsData } = useGetAllOrdersQuery({ limit: 500 });

  const { data, isLoading, isFetching, isError, refetch } = useGetAllOrdersQuery({
    status: statusFilter !== "all" ? statusFilter : undefined,
    page,
    limit,
  });

  const orders = data?.data || [];
  const filteredTotal = data?.total || 0;
  const totalPages = data?.totalPages || 0;
  const globalTotal = statsData?.total || 0;

  const statusCounts = (statsData?.data || []).reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const filteredOrders = searchQuery
    ? orders.filter(order => 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : orders;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full animate-pulse" />
          ))}
        </div>
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-md font-primary">Orders Pipeline</h1>
            <p className="text-muted-foreground">Manage and track customer orders</p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="py-12">
            <EmptyState
              title="Failed to load orders"
              description="There was an error loading orders. Please try again."
              action={{ label: "Retry", onClick: () => refetch() }}
              icon={AlertCircle}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="heading-md font-primary text-foreground flex items-center gap-3">
            Orders Pipeline
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => refetch()} 
              disabled={isLoading || isFetching}
              className="h-8 w-8 rounded-full"
              title="Refresh Data"
            >
              <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage and track customer orders</p>
        </div>
        <div className="text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg border border-border">
          Total System Orders: <span className="font-bold text-foreground">{globalTotal}</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8"
      >
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
      </motion.div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by order number..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-9 h-11 bg-card border-border/60"
        />
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            {statusFilter === "all" ? "All Orders" : `${statusTabs.find(t => t.value === statusFilter)?.label} Orders`}
            <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {filteredTotal} found
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {filteredOrders.length === 0 ? (
            <EmptyState
              title="No orders found"
              description={
                statusFilter !== "all" 
                  ? `There are currently no orders in the ${statusFilter.toLowerCase()} state.`
                  : "No orders have been placed yet."
              }
              action={{
                label: "Clear Search",
                onClick: () => setSearchQuery(""),
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  variant="admin"
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-border/60 pt-6">
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
    </div>
  );
}