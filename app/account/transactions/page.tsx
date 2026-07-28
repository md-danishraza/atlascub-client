"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Receipt, 
  Lock,
  Download,
  AlertCircle,
  RefreshCcw,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";
import { useGetUserOrdersQuery } from "@/lib/store/apis/checkout-api";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

export default function AccountTransactionsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Auth Protection
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const { data, isLoading, isError, isFetching, refetch } = useGetUserOrdersQuery({
    page,
    limit,
  });

  const orders = data?.data || [];
  const totalPages = data?.totalPages || 0;

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <SlugBreadcrumb />
        <EmptyState
          title="Sign in required"
          description="Please sign in to view your payment history and invoices."
          icon={Lock}
          action={{
            label: "Sign In / Register",
            onClick: () => router.push("/sign-in")
          }}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <h1 className="heading-md font-primary">Payment History</h1>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="py-12">
            <EmptyState
              title="Failed to load transactions"
              description="There was an error loading your payment history. Please try again."
              action={{ label: "Retry", onClick: () => refetch() }}
              icon={AlertCircle}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper to determine transaction nature
  const getTransactionDetails = (status: string) => {
    switch (status) {
      case "REFUNDED":
      case "REFUND_PROCESSING":
        return {
          type: "Refund",
          icon: <ArrowDownLeft className="h-4 w-4 text-emerald-600" />,
          color: "text-emerald-600 bg-emerald-50 border-emerald-200",
          sign: "+",
        };
      case "PENDING":
      case "CANCELLED":
        return {
          type: "Failed / Cancelled",
          icon: <AlertCircle className="h-4 w-4 text-destructive" />,
          color: "text-destructive bg-destructive/10 border-destructive/20",
          sign: "",
        };
      default:
        // PAID, SHIPPED, DELIVERED, REPLACED etc.
        return {
          type: "Payment",
          icon: <ArrowUpRight className="h-4 w-4 text-foreground/70" />,
          color: "text-foreground bg-muted border-border",
          sign: "-",
        };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl animate-in fade-in duration-500">
      <div className="mb-6"><SlugBreadcrumb /></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-primary font-bold tracking-tight text-foreground">Payment History</h1>
          <p className="text-muted-foreground mt-1">Review your payments, refunds, and download tax invoices.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()} 
          disabled={isFetching}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Syncing..." : "Sync Ledger"}
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="border-border/60 bg-muted/10">
          <CardContent className="py-16">
            <EmptyState
              title="No transactions found"
              description="You have not made any payments or received any refunds yet."
              icon={CreditCard}
              action={{
                label: "Go to Shop",
                href: "/shop"
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any, index: number) => {
            const tx = getTransactionDetails(order.status);
            const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric"
            });
            const time = new Date(order.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit", minute: "2-digit"
            });

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-all">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 gap-4">
                      
                      {/* Left: Icon & Core Details */}
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 shrink-0 rounded-full border flex items-center justify-center ${tx.color}`}>
                          {tx.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">Order #{order.orderNumber}</h3>
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${tx.color}`}>
                              {tx.type}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {date} • {time}
                          </p>
                          {order.paymentId && (
                            <p className="text-xs font-mono text-muted-foreground mt-1">
                              Txn ID: {order.paymentId}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Amount & Actions */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-4 sm:pt-0">
                        <div className={`text-lg font-bold tracking-tight ${
                          tx.type === "Refund" ? "text-emerald-600" : 
                          tx.type === "Failed / Cancelled" ? "text-muted-foreground line-through opacity-70" : 
                          "text-foreground"
                        }`}>
                          {tx.sign}{formatPrice(order.totalAmount)}
                        </div>
                        
                        {/* Only show invoice download if order was actually paid successfully */}
                        {order.status !== "PENDING" && order.status !== "CANCELLED" ? (
                          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-primary hover:bg-primary/10">
                            <Download className="h-3.5 w-3.5" />
                            <span className="text-xs">Invoice</span>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground font-medium px-2">No Invoice</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-6 mt-6">
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
        </div>
      )}
    </div>
  );
}