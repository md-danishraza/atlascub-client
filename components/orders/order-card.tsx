"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Package } from "lucide-react";
import { OrderResponse } from "@/types/checkout";
import { OrderStatusBadge } from "./order-status-badge";
import { formatPrice } from "@/lib/utils";

interface OrderCardProps {
  order: OrderResponse;
  variant?: "admin" | "user";
  onClick?: () => void;
}

export function OrderCard({ order, variant = "user", onClick }: OrderCardProps) {
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Get first 2 items for summary
  const displayItems = order.items?.slice(0, 2) || [];
  const remainingCount = (order.items?.length || 0) - 2;

  const href = variant === "admin" 
    ? `/admin/orders/${order.id}` 
    : `/account/orders/${order.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link 
        href={href}
        onClick={onClick}
        className="block group"
      >
        <div className="rounded-xl border border-border bg-card p-4 md:p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5">
          <div className="flex flex-col gap-4">
            {/* Header: Order Number + Status */}
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Order #{order.orderNumber}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {orderDate}
                </p>
              </div>
              <OrderStatusBadge 
                status={order.status as any} 
                size="sm"
                pulse={order.status === "PENDING" || order.status === "SHIPPED"}
              />
            </div>

            {/* Items Summary */}
            <div className="flex items-center gap-3">
              {displayItems.length > 0 ? (
                <div className="flex -space-x-2">
                  {displayItems.map((item, index) => (
                    <div 
                      key={item.productId}
                      className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border-2 border-background bg-muted"
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  {remainingCount > 0 && (
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border-2 border-background bg-muted text-xs font-medium text-muted-foreground">
                      +{remainingCount}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-10 w-10 flex-shrink-0 rounded-md bg-muted flex items-center justify-center">
                  <Package className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">
                  {displayItems.map(item => item.name).join(", ")}
                  {remainingCount > 0 && ` + ${remainingCount} more`}
                </p>
              </div>
            </div>

            {/* Footer: Total + View */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-semibold text-foreground">
                  {formatPrice(order.totalAmount)}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                <span>View Details</span>
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}