"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./order-status-badge";
import { ORDER_STATUS_CONFIG, OrderStatusType, getNextStatuses } from "@/lib/constants/order-status";
import { toast } from "sonner";

interface StatusUpdateDropdownProps {
  currentStatus: OrderStatusType;
  onStatusChange: (newStatus: OrderStatusType) => Promise<void>;
  isLoading?: boolean;
}

export function StatusUpdateDropdown({
  currentStatus,
  onStatusChange,
  isLoading = false,
}: StatusUpdateDropdownProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const nextStatuses = getNextStatuses(currentStatus);

  const handleStatusChange = async (newStatus: OrderStatusType) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await onStatusChange(newStatus);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  // If no next statuses, show read-only
  if (nextStatuses.length === 0) {
    return <OrderStatusBadge status={currentStatus} size="lg" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={isLoading || isUpdating}>
          {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>Update Status</span>
          <OrderStatusBadge status={currentStatus} size="sm" showLabel={false} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {nextStatuses.map((status) => {
          const config = ORDER_STATUS_CONFIG[status];
          const Icon = config.icon;
          
          return (
            <DropdownMenuItem
              key={status}
              onClick={() => handleStatusChange(status)}
              className="gap-2 cursor-pointer"
              disabled={isUpdating}
            >
              <Icon className="h-4 w-4" />
              <span>Move to {config.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}