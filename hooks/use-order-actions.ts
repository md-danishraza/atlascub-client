"use client";

import { toast } from "sonner";
import {
  useUpdateOrderStatusMutation,
  useUpdateOrderTrackingMutation,
  useAdminReturnActionMutation, // 🛡️ Added
} from "@/lib/store/apis/checkout-api";

interface UseOrderActionsProps {
  orderId: string;
  currentStatus?: string;
  onSuccess?: () => void;
}

export function useOrderActions({ orderId, onSuccess }: UseOrderActionsProps) {
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation();
  const [updateTracking, { isLoading: isUpdatingTracking }] =
    useUpdateOrderTrackingMutation();
  const [adminReturnAction, { isLoading: isUpdatingReturn }] =
    useAdminReturnActionMutation(); // 🛡️ Added

  const isUpdating = isUpdatingStatus || isUpdatingTracking || isUpdatingReturn;

  const updateOrderStatus = async (newStatus: string, adminNote?: string) => {
    try {
      await updateStatus({
        id: orderId,
        status: newStatus,
        adminNote,
      }).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };
  const addTrackingInfo = async (data: {
    trackingNumber?: string;
    awbCode?: string;
    courierName?: string;
  }) => {
    try {
      await updateTracking({ id: orderId, ...data }).unwrap();
      toast.success("Logistics tracking updated successfully");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to update tracking info");
    }
  };

  // 🛡️ Added Admin Return Handler
  const handleReturnAction = async (action: "APPROVED" | "REJECTED") => {
    try {
      await adminReturnAction({ id: orderId, action }).unwrap();
      toast.success(`Return request ${action.toLowerCase()} successfully`);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to process return action");
    }
  };

  return {
    updateOrderStatus,
    addTrackingInfo,
    handleReturnAction,
    isUpdating,
  };
}
