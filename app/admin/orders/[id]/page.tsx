"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  Receipt, 
  RotateCcw, 
  ShieldCheck, 
  XCircle, 
  Banknote, 
  Loader2, 
  Printer, 
  AlertCircle, 
  RefreshCcw,
  AlertTriangle,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { StatusUpdateDropdown } from "@/components/orders/status-update-dropdown";
import { TrackingInput } from "@/components/orders/tracking-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from "@/lib/store/apis/checkout-api";
import { useOrderActions } from "@/hooks/use-order-actions";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const { data: order, isLoading, isError, isFetching, refetch } = useGetOrderByIdQuery(id);
  const [updateStatusMutation, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();

  const {
    updateOrderStatus,
    addTrackingInfo,
    handleReturnAction, 
    isUpdating,
  } = useOrderActions({
    orderId: id,
    currentStatus: order?.status as any,
    onSuccess: refetch,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.push("/admin/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <EmptyState
          title="Order not found"
          description="The order you're looking for doesn't exist."
          action={{ label: "Back to Orders", href: "/admin/orders" }}
        />
      </div>
    );
  }

  const activeReturnStatus = order.returnStatus;

  const processRazorpayRefund = () => {
    toast.info("Razorpay Refund API Trigger mechanism to be connected here.");
  };

  const executeForceCancellation = async () => {
    try {
      // 🚀 CLEAN: Redirect the execution directly through your unified hook helper
      await updateOrderStatus("CANCELLED", cancelReason.trim() || "Administrative Cancellation Override");

      setIsCancelDialogOpen(false);
      setCancelReason("");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to execute administrative cancellation.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">
      
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.push("/admin/orders")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="h-9 w-9 rounded-full"
          title="Refresh Order Data"
        >
          <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* active returns banner */}
      {activeReturnStatus && (
        <Card className={`mb-8 border-2 shadow-md text-left ${
          activeReturnStatus === 'REQUESTED' ? 'border-orange-300 bg-orange-50/50 dark:bg-orange-950/20' : 
          activeReturnStatus === 'APPROVED' ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20' : 
          activeReturnStatus === 'REFUNDED' ? 'border-blue-300 bg-blue-50/50 dark:bg-blue-950/20' : 
          'border-red-300 bg-red-50/50 dark:bg-red-950/20'
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <RotateCcw className="h-5 w-5" /> Return Action Required
              <span className="ml-auto text-xs font-mono bg-background px-3 py-1 rounded-full border shadow-sm uppercase tracking-widest text-foreground">
                STATUS: {activeReturnStatus}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-background rounded-lg border p-4 mb-4 shadow-sm">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Requested Resolution</p>
                  <p className="font-semibold text-lg">{order.returnType}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Customer Reason</p>
                  <p className="text-sm font-medium italic mt-1 leading-relaxed text-foreground/80">"{order.returnReason}"</p>
                </div>
              </div>
            </div>

            {activeReturnStatus === 'REQUESTED' && (
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => handleReturnAction('APPROVED')} 
                  disabled={isUpdating}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-6"
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  Approve Request
                </Button>
                <Button 
                  onClick={() => handleReturnAction('REJECTED')} 
                  disabled={isUpdating}
                  variant="destructive" 
                  className="gap-2 px-6"
                >
                  <XCircle className="h-4 w-4" /> Reject Request
                </Button>
              </div>
            )}

            {/* Rest of Returns */}
            {activeReturnStatus === 'APPROVED' && order.returnType === 'REFUND' && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium text-left">
                  Item approved for return. Once the package is received in the warehouse, trigger the payment reversal.
                </p>
                <Button 
                  onClick={processRazorpayRefund} 
                  disabled={isUpdating || order.status === 'REFUNDED'}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto shrink-0 shadow-md"
                >
                  <Banknote className="h-4 w-4" /> Process ₹{order.totalAmount.toLocaleString()} Refund
                </Button>
              </div>
            )}
            
            {order.status === 'REFUNDED' && (
              <p className="text-sm font-medium text-blue-700 text-left">✓ The payment has been reversed to the customer via Razorpay.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* PENDING / FAILED WARNING */}
      {order.status === "PENDING" && (
        <div className="mb-6 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-amber-700 flex items-start gap-3 text-left">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-base">Payment Abandoned / Failed</h3>
            <p className="text-sm opacity-90 mt-1">
              This transaction was not completed securely on the gateway. Do not dispatch these items. You may update the status to CANCELLED to close it, or PAID if you manually collected payment offline.
            </p>
          </div>
        </div>
      )}

      {/* Admin Overrides & Force Cancellation Notes Display */}
      {}
      {order.adminNote && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-left flex items-start gap-3">
          <FileText className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm text-red-800 uppercase tracking-wider">Administrative Log Override</h3>
            <p className="text-sm text-muted-foreground italic mt-1 leading-relaxed">
              "{order.adminNote}"
            </p>
          </div>
        </div>
      )}

      {/* Main Order Info */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="text-left">
          <h1 className="heading-lg font-primary">Order #{order.orderNumber}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <OrderStatusBadge status={order.status as any} size="lg" />
            <span className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        
        {/* Status Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => window.open(`/admin/orders/${id}/label`, '_blank')}
          >
            <Printer className="h-4 w-4" /> Print Label
          </Button>
          <StatusUpdateDropdown
              currentStatus={order.status as any}
              onStatusChange={async (status: any) => { // 🛡️ Mark as async
                if (status === "CANCELLED") {
                  setIsCancelDialogOpen(true);
                } else {
                  await updateOrderStatus(status); // 🛡️ Await the hook function
                }
              }}
              isLoading={isUpdating}
            />
        </div>
      </div>

      {/* GRID DETAILS */}
      {}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="text-left"><CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4" /> Customer</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm text-left">
            <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
            <p className="text-muted-foreground">{order.shippingAddress.email}</p>
            <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-left"><CardTitle className="flex items-center gap-2 text-base"><MapPin className="h-4 w-4" /> Shipping Address</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm text-left">
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
            <p>{order.shippingAddress.pincode}</p>
            <p className="text-muted-foreground">{order.shippingAddress.country}</p>
          </CardContent>
        </Card>
      </div>

      {/* Logistics section */}
      <Card className="mt-6 text-left">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Package className="h-4 w-4" /> Logistics & Shiprocket</CardTitle></CardHeader>
        <CardContent>
          <TrackingInput
            order={order}
            onUpdate={(data: any) => addTrackingInfo(data)}
            isLoading={isUpdating}
          />
        </CardContent>
      </Card>

      {/* Items Summary list */}
      {}
      <Card className="mt-6">
        <CardHeader className="text-left"><CardTitle className="flex items-center gap-2 text-base"><Receipt className="h-4 w-4" /> Order Items</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4 text-left">
            {order.items.map((item: any, index: number) => (
              <div key={index} className="flex items-start justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                    <span>Size: {item.size}</span>
                    <span>Color: {item.color}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{item.price.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>₹{formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>₹{formatPrice(order.tax)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-lg">₹{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Section */}
      {order.status !== "PENDING" && (
        <Card className="mt-6 text-left">
          <CardHeader><CardTitle className="text-base">Order Timeline</CardTitle></CardHeader>
          <CardContent>
            <OrderTimeline status={order.status as any} paymentMethod={order.paymentMethod} />
          </CardContent>
        </Card>
      )}

      {/* 🛡️ FORCEFUL CANCELLATION DIALOG */}
      {}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background border shadow-2xl">
          <DialogHeader className="items-center text-center">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-3">
              <AlertTriangle className="h-6 w-6 text-red-600 animate-pulse" />
            </div>
            <DialogTitle className="text-xl font-primary">Force Cancel Order Override</DialogTitle>
            <DialogDescription className="text-center text-xs">
              Warning: This is an administrative override. Standard state restrictions will be bypassed, inventory quantities will be restored atomically, and a cancellation receipt will be emailed to the customer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-left">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-bold">
                Cancellation Reason / Log Note *
              </label>
              <textarea
                className="flex w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary min-h-[100px] resize-none leading-relaxed"
                placeholder="Write the explanation for this override (e.g., RTO - Customer rejected package, damaged in transit, system exception override)..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsCancelDialogOpen(false)}
              disabled={isUpdatingStatus}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            <Button 
              onClick={executeForceCancellation}
              disabled={isUpdatingStatus || !cancelReason.trim()}
              variant="destructive"
              className="w-full sm:w-auto gap-2"
            >
              {isUpdatingStatus ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Force Cancel Order
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}