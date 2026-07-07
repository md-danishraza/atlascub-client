"use client";

import { motion } from "framer-motion";
import { 
  Check, 
  XCircle, 
 
} from "lucide-react";

import { getOrderStatus, OrderStatusType } from "@/lib/constants/order-status";

interface OrderTimelineProps {
  status: OrderStatusType;
  paymentMethod?: string; // 🛡️ Dynamically passed down from order query to map timelines exactly
  createdAt?: string;
  updatedAt?: string;
  className?: string;
}

interface TimelineStep {
  status: OrderStatusType;
  label: string;
  completed: boolean;
  active: boolean;
}

export function OrderTimeline({ status, paymentMethod, createdAt, updatedAt, className = "" }: OrderTimelineProps) {
  
  const isCod = paymentMethod === 'COD' || status === 'COD_REQUESTED' || status === 'CONFIRMED';

  const getTimelineSteps = (): TimelineStep[] => {
    let flowSteps = isCod 
      ? [
          { status: "COD_REQUESTED", label: "COD Requested" },
          { status: "CONFIRMED", label: "Order Confirmed" },
          { status: "SHIPPED", label: "Order Shipped" },
          { status: "DELIVERED", label: "Order Delivered" },
        ]
      : [
          { status: "PENDING", label: "Order Placed" },
          { status: "PAID", label: "Payment Confirmed" },
          { status: "SHIPPED", label: "Order Shipped" },
          { status: "DELIVERED", label: "Order Delivered" },
        ];

    const refundFlow = ["RETURN_REQUESTED", "REFUND_PROCESSING", "REFUNDED"];
    const replacementFlow = ["REPLACEMENT_REQUESTED", "REPLACEMENT_PROCESSING", "REPLACED"];

    if (refundFlow.includes(status)) {
      flowSteps = [
        ...flowSteps,
        { status: "RETURN_REQUESTED", label: "Return Requested" },
        { status: "REFUND_PROCESSING", label: "Processing Refund" },
        { status: "REFUNDED", label: "Refund Complete" }
      ];
    } else if (replacementFlow.includes(status)) {
      flowSteps = [
        ...flowSteps,
        { status: "REPLACEMENT_REQUESTED", label: "Replacement Requested" },
        { status: "REPLACEMENT_PROCESSING", label: "Dispatching Replacement" },
        { status: "REPLACED", label: "Replacement Delivered" }
      ];
    } else if (status === "CANCELLED") {
      flowSteps = [
        isCod ? { status: "COD_REQUESTED", label: "COD Requested" } : { status: "PENDING", label: "Order Placed" },
        { status: "CANCELLED", label: "Order Cancelled" }
      ];
    }

    const currentIndex = flowSteps.findIndex(s => s.status === status);

    return flowSteps.map((step, index) => {
      const completed = currentIndex !== -1 && index <= currentIndex;
      const active = currentIndex !== -1 && index === currentIndex;

      return {
        status: step.status as OrderStatusType,
        label: step.label,
        completed,
        active,
      };
    });
  };

  const steps = getTimelineSteps();
  const isCancelled = status === "CANCELLED";
  
  const noticeStatuses = [
    "CANCELLED", "RETURN_REQUESTED", "REFUND_PROCESSING", "REFUNDED", 
    "REPLACEMENT_REQUESTED", "REPLACEMENT_PROCESSING", "REPLACED"
  ];
  
  const showNotice = noticeStatuses.includes(status);

  let noticeText = "";
  if (status === "CANCELLED") noticeText = "This order has been cancelled.";
  if (status === "RETURN_REQUESTED") noticeText = "A return has been requested for this order.";
  if (status === "REFUND_PROCESSING") noticeText = "Your refund is currently being processed.";
  if (status === "REFUNDED") noticeText = "This order has been returned and refunded successfully.";
  if (status === "REPLACEMENT_REQUESTED") noticeText = "A replacement has been requested for this order.";
  if (status === "REPLACEMENT_PROCESSING") noticeText = "Your replacement order is currently being processed.";
  if (status === "REPLACED") noticeText = "Your replacement has been successfully delivered.";

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="relative">
        <div className="absolute left-4 top-0 h-full w-0.5 bg-border" />
        
        {steps.map((step, index) => {
          const stepConfig = getOrderStatus(step.status);
          const Icon = stepConfig.icon;
          
          return (
            <motion.div
              key={step.status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-4 pb-6 last:pb-0"
            >
              <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center bg-card">
                {step.completed ? (
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isCancelled 
                      ? "bg-destructive text-destructive-foreground"
                      : step.active ? "bg-primary text-primary-foreground shadow-sm" : "bg-primary/20 text-primary"
                  }`}>
                    {isCancelled && step.status === "CANCELLED" ? <XCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full border-2 border-border bg-background flex items-center justify-center">
                    <Icon className="h-4 w-4 text-muted-foreground opacity-50" />
                  </div>
                )}
              </div>

              <div className="flex-1 pt-1.5 text-left">
                <div className="flex items-center gap-3">
                  <span className={`font-medium ${
                    step.completed 
                      ? isCancelled ? "text-destructive" : "text-foreground" 
                      : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </span>
                  
                  {step.active && !isCancelled && !["REFUNDED", "REPLACED", "DELIVERED"].includes(status) && (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary animate-pulse bg-primary/10 px-2 py-0.5 rounded-sm">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {showNotice && (
        <div className={`rounded-lg border p-3 text-sm text-left animate-in fade-in duration-500 ${
          status === "CANCELLED" 
            ? "border-destructive/20 bg-destructive/5 text-destructive"
            : "border-primary/20 bg-primary/5 text-primary"
        }`}>
          <p className="font-medium">{noticeText}</p>
        </div>
      )}
    </div>
  );
}