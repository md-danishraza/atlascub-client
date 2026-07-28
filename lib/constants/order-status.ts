import {
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  RotateCcw,
  AlertCircle,
  RefreshCw,
  Banknote,
  ThumbsUp,
} from "lucide-react";

export type OrderStatusType =
  | "PENDING"
  | "COD_REQUESTED"
  | "CONFIRMED"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "REFUND_PROCESSING"
  | "REFUNDED"
  | "REPLACEMENT_REQUESTED"
  | "REPLACEMENT_PROCESSING"
  | "REPLACED";

export interface OrderStatusConfig {
  label: string;
  color: {
    badge: string;
    text: string;
    border: string;
    light: string;
    dark: string;
  };
  icon: React.ElementType;
  timeline: {
    step: number;
    label: string;
  };
  nextStatuses?: OrderStatusType[];
}

export const ORDER_STATUS_CONFIG: Record<OrderStatusType, OrderStatusConfig> = {
  PENDING: {
    label: "Pending / Failed",
    color: {
      badge:
        "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
      light: "bg-amber-50 dark:bg-amber-950/20",
      dark: "bg-amber-900/30",
    },
    icon: Clock,
    timeline: { step: 1, label: "Order Placed" },
    nextStatuses: ["PAID", "CANCELLED"],
  },

  COD_REQUESTED: {
    label: "COD Pending Verification",
    color: {
      badge:
        "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
      light: "bg-amber-50 dark:bg-amber-950/20",
      dark: "bg-amber-900/30",
    },
    icon: Clock,
    timeline: { step: 1, label: "COD Requested" },
    nextStatuses: ["CONFIRMED", "CANCELLED"],
  },

  CONFIRMED: {
    label: "Confirmed (COD)",
    color: {
      badge:
        "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
      light: "bg-emerald-50 dark:bg-emerald-950/20",
      dark: "bg-emerald-900/30",
    },
    icon: ThumbsUp,
    timeline: { step: 2, label: "Order Confirmed" },
    nextStatuses: ["SHIPPED", "CANCELLED"],
  },

  PAID: {
    label: "Paid",
    color: {
      badge:
        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
      light: "bg-blue-50 dark:bg-blue-950/20",
      dark: "bg-blue-900/30",
    },
    icon: CheckCircle,
    timeline: { step: 2, label: "Payment Confirmed" },
    nextStatuses: ["SHIPPED", "CANCELLED"],
  },

  SHIPPED: {
    label: "Shipped",
    color: {
      badge:
        "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
      light: "bg-purple-50 dark:bg-purple-950/20",
      dark: "bg-purple-900/30",
    },
    icon: Truck,
    timeline: { step: 3, label: "Order Shipped" },
    nextStatuses: ["DELIVERED"],
  },

  DELIVERED: {
    label: "Delivered",
    color: {
      badge:
        "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
      light: "bg-green-50 dark:bg-green-950/20",
      dark: "bg-green-900/30",
    },
    icon: Package,
    timeline: { step: 4, label: "Order Delivered" },
    nextStatuses: ["RETURN_REQUESTED", "REPLACEMENT_REQUESTED"],
  },

  CANCELLED: {
    label: "Cancelled",
    color: {
      badge:
        "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
      light: "bg-red-50 dark:bg-red-950/20",
      dark: "bg-red-900/30",
    },
    icon: XCircle,
    timeline: { step: 0, label: "Order Cancelled" },
  },

  RETURN_REQUESTED: {
    label: "Return Requested",
    color: {
      badge:
        "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
      text: "text-orange-600 dark:text-orange-400",
      border: "border-orange-200 dark:border-orange-800",
      light: "bg-orange-50 dark:bg-orange-950/20",
      dark: "bg-orange-900/30",
    },
    icon: AlertCircle,
    timeline: { step: 5, label: "Return Requested" },
    nextStatuses: ["REFUND_PROCESSING"],
  },

  REFUND_PROCESSING: {
    label: "Processing Refund",
    color: {
      badge:
        "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-200 dark:border-indigo-800",
      light: "bg-indigo-50 dark:bg-indigo-950/20",
      dark: "bg-indigo-900/30",
    },
    icon: RotateCcw,
    timeline: { step: 6, label: "Processing Refund" },
    nextStatuses: ["REFUNDED"],
  },

  REFUNDED: {
    label: "Refunded",
    color: {
      badge:
        "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
      text: "text-gray-600 dark:text-gray-400",
      border: "border-gray-300 dark:border-gray-700",
      light: "bg-gray-50 dark:bg-gray-900/20",
      dark: "bg-gray-800/30",
    },
    icon: Banknote,
    timeline: { step: 7, label: "Refund Complete" },
  },

  REPLACEMENT_REQUESTED: {
    label: "Replacement Requested",
    color: {
      badge:
        "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
      text: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-yellow-800",
      light: "bg-yellow-50 dark:bg-yellow-950/20",
      dark: "bg-yellow-900/30",
    },
    icon: RefreshCw,
    timeline: { step: 5, label: "Replacement Requested" },
    nextStatuses: ["REPLACEMENT_PROCESSING"],
  },

  REPLACEMENT_PROCESSING: {
    label: "Processing Replacement",
    color: {
      badge:
        "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-200 dark:border-cyan-800",
      light: "bg-cyan-50 dark:bg-cyan-950/20",
      dark: "bg-cyan-900/30",
    },
    icon: Package,
    timeline: { step: 6, label: "Dispatching Replacement" },
    nextStatuses: ["REPLACED"],
  },

  REPLACED: {
    label: "Replaced",
    color: {
      badge:
        "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
      light: "bg-emerald-50 dark:bg-emerald-950/20",
      dark: "bg-emerald-900/30",
    },
    icon: CheckCircle,
    timeline: { step: 7, label: "Replacement Delivered" },
  },
};

export function getOrderStatus(status: OrderStatusType): OrderStatusConfig {
  return ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.PENDING;
}

export function getNextStatuses(
  currentStatus: OrderStatusType
): OrderStatusType[] {
  const config = getOrderStatus(currentStatus);
  return config.nextStatuses || [];
}

export function getStatusOptionsForAdmin(): Array<{
  value: OrderStatusType;
  label: string;
}> {
  const terminalStatuses: OrderStatusType[] = [
    "CANCELLED",
    "REFUNDED",
    "REPLACED",
  ];
  return (Object.keys(ORDER_STATUS_CONFIG) as OrderStatusType[])
    .filter((key) => !terminalStatuses.includes(key))
    .map((key) => ({
      value: key,
      label: ORDER_STATUS_CONFIG[key].label,
    }));
}
