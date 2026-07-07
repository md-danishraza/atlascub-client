"use client";

import { motion } from "framer-motion";
import { getOrderStatus, OrderStatusType, ORDER_STATUS_CONFIG } from "@/lib/constants/order-status";

interface OrderStatusBadgeProps {
  status: OrderStatusType | string; // 🛡️ Safely accepts raw API strings to prevent typecast errors
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
  pulse?: boolean;
}

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px] gap-1",
  md: "px-3 py-1 text-xs gap-1.5",
  lg: "px-4 py-1.5 text-sm gap-2",
};

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
};

const pulseStatuses: OrderStatusType[] = ["PENDING", "COD_REQUESTED", "SHIPPED", "RETURN_REQUESTED"];

export function OrderStatusBadge({
  status,
  size = "md",
  showIcon = true,
  showLabel = true,
  className = "",
  pulse,
}: OrderStatusBadgeProps) {
  // 🛡️ Guard: Safeguards against unknown or malformed status strings with a fallback
  const isKnownStatus = status in ORDER_STATUS_CONFIG;
  const normalizedStatus = (isKnownStatus ? status : "PENDING") as OrderStatusType;

  const config = getOrderStatus(normalizedStatus);
  const Icon = config.icon; // Resolved directly from your central mapping configuration

  // Auto-pulse for processing states unless explicitly overridden by prop
  const shouldPulse = pulse !== undefined ? pulse : pulseStatuses.includes(normalizedStatus);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        ...(shouldPulse && {
          boxShadow: [
            "0 0 0 0 rgba(155, 44, 44, 0.2)",
            "0 0 0 6px rgba(155, 44, 44, 0)",
          ],
        }),
      }}
      transition={{
        duration: 0.2,
        ...(shouldPulse && {
          boxShadow: {
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }),
      }}
      className={`
        inline-flex items-center rounded-full border font-medium transition-colors
        ${config.color.badge}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {showIcon && Icon && (
        <Icon className={`${iconSizes[size]} flex-shrink-0`} />
      )}
      {showLabel && config.label}
    </motion.span>
  );
}