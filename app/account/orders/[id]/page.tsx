"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, MapPin, Receipt, Truck, Calendar, RotateCcw, AlertCircle, ArrowUpRight, CheckCircle2, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { ReturnRequestModal } from "@/components/orders/return-request-modal";
import { useGetOrderByIdQuery, useInitiateReturnMutation } from "@/lib/store/apis/checkout-api";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function AccountOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: order, isLoading, isError, isFetching, refetch } = useGetOrderByIdQuery(id);
  const [initiateReturn, { isLoading: isSubmittingReturn }] = useInitiateReturnMutation();
  
  const [showReturnModal, setShowReturnModal] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
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
          <Button variant="ghost" onClick={() => router.push("/account/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
          </Button>
          <Button variant="outline" size="icon" onClick={refetch} disabled={isFetching}>
            <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <EmptyState
          title="Order not found"
          description="The order you're looking for doesn't exist."
          action={{ label: "Back to Orders", href: "/account/orders" }}
        />
      </div>
    );
  }

  const deliveredDate = new Date(order.updatedAt);
  const daysSinceDelivery = (Date.now() - deliveredDate.getTime()) / (1000 * 3600 * 24);
  const isReturnEligible = order.status === "DELIVERED" && daysSinceDelivery <= 7 && !order.returnStatus;
  
  const handleReturnSubmit = async (data: { returnType: string; reason: string }) => {
    try {
      await initiateReturn({
        id: order.id,
        returnType: data.returnType,
        reason: data.reason
      }).unwrap();
      
      toast.success("Return request submitted successfully");
      setShowReturnModal(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit return request");
    }
  };

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
  const orderTime = new Date(order.createdAt).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.push("/account/orders")}>
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

      {order.returnStatus && (
        <div className={`mb-6 rounded-lg border p-4 sm:p-5 flex items-start gap-3 shadow-sm ${
          order.status === 'REFUNDED' || order.status === 'REPLACED' 
            ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400' :
          order.returnStatus === 'REQUESTED' 
            ? 'border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400' :
          order.returnStatus === 'APPROVED' 
            ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400' :
          'border-red-200 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400'
        }`}>
          {order.status === 'REFUNDED' || order.status === 'REPLACED' ? (
            <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
          ) : (
            <RotateCcw className="h-5 w-5 mt-0.5 shrink-0" />
          )}
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-base">
              {order.status === 'REFUNDED' && "Refund Successfully Processed"}
              {order.status === 'REPLACED' && "Replacement Completed"}
              {order.status !== 'REFUNDED' && order.status !== 'REPLACED' && order.returnStatus === 'REQUESTED' && "Return Request Processing"}
              {order.status !== 'REFUNDED' && order.status !== 'REPLACED' && order.returnStatus === 'APPROVED' && "Return Request Approved"}
              {order.returnStatus === 'REJECTED' && "Return Request Declined"}
            </h3>
            <p className="text-sm opacity-90 mt-1 leading-relaxed">
              {order.status === 'REFUNDED' && "Your refund has been dispatched to your original payment method. Please allow 3-5 business days for it to reflect in your account."}
              {order.status === 'REPLACED' && "Your replacement item has been successfully delivered. Thank you for shopping with us!"}
              {order.status !== 'REFUNDED' && order.status !== 'REPLACED' && order.returnStatus === 'REQUESTED' && "Your request has been sent to our team. We will review it and update you within 24-48 hours. Please keep the item packed with original tags."}
              {order.status !== 'REFUNDED' && order.status !== 'REPLACED' && order.returnStatus === 'APPROVED' && "Your request was approved. Our courier partner will contact you shortly to pick up the package."}
              {order.returnStatus === 'REJECTED' && "Unfortunately, your return request did not meet our policy criteria. Check your email for detailed context."}
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="text-left">
          <h1 className="heading-lg font-primary">Order #{order.orderNumber}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <OrderStatusBadge status={order.status} size="lg" />
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {orderDate} at {orderTime}
            </span>
          </div>
        </div>
        
        {isReturnEligible && (
          <Button 
            variant="outline" 
            className="gap-2 border-primary/20 hover:bg-primary/5 text-primary"
            onClick={() => setShowReturnModal(true)}
          >
            <RotateCcw className="h-4 w-4" /> Return / Exchange
          </Button>
        )}
      </div>

      {order.status === "PENDING" ? (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 p-5 text-destructive flex items-start gap-3 shadow-sm">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <div className="text-left">
            <h3 className="font-semibold text-base">Payment Incomplete</h3>
            <p className="text-sm opacity-90 mt-1 leading-relaxed">
              The payment for this order was not completed or failed. For security reasons, a new transaction session cannot be restarted for this specific reference. 
              <br/><br/>
              <strong>Action required:</strong> Please place a new order if you still wish to purchase these items.
            </p>
          </div>
        </div>
      ) : (
        <Card className="mb-6">
          <CardHeader className="text-left"><CardTitle className="text-base">Order Timeline</CardTitle></CardHeader>
          <CardContent>
            {/* 🛡️ DECOUPLED TIMELINE INTEGRATION (Uses both status and paymentMethod props) */}
            <OrderTimeline status={order.status as any} paymentMethod={order.paymentMethod} />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="text-left"><CardTitle className="flex items-center gap-2 text-base"><MapPin className="h-4 w-4" /> Shipping Address</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm text-left">
            <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
            <p className="text-muted-foreground">{order.shippingAddress.email}</p>
            <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
            <Separator className="my-2" />
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
            <p className="text-muted-foreground">{order.shippingAddress.country}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-left"><CardTitle className="flex items-center gap-2 text-base"><Receipt className="h-4 w-4" /> Order Summary</CardTitle></CardHeader>
          <CardContent>
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
                <span className="text-lg text-primary">₹{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
              {order.paymentId && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-xs">{order.paymentId}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {(order.awbCode || order.trackingNumber) && (
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardHeader className="text-left">
            <CardTitle className="flex items-center gap-2 text-base">
              <Truck className="h-4 w-4 text-primary" /> Shipment Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-left">
              <div className="flex-1 space-y-3">
                {order.awbCode && (
                  <div>
                    <p className="text-sm font-medium">Shiprocket AWB</p>
                    <p className="text-sm text-muted-foreground font-mono mt-0.5">{order.awbCode}</p>
                  </div>
                )}
                {order.courierName && (
                  <div>
                    <p className="text-sm font-medium">Courier Partner</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{order.courierName}</p>
                  </div>
                )}
                {order.trackingNumber && (
                  <div>
                    <p className="text-sm font-medium">Additional Reference</p>
                    <p className="text-sm text-muted-foreground font-mono mt-0.5">{order.trackingNumber}</p>
                  </div>
                )}
              </div>
              
              <div className="shrink-0 mt-4 sm:mt-0">
                {order.awbCode ? (
                  <Button asChild variant="default" size="sm" className="w-full sm:w-auto gap-2">
                    <a href={`https://shiprocket.co/tracking/${order.awbCode}`} target="_blank" rel="noopener noreferrer">
                      Track via Shiprocket <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>Status: En Route</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader className="text-left">
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-4 w-4" /> Order Items ({order.items.length})
          </CardTitle>
        </CardHeader>
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
        </CardContent>
      </Card>

      <ReturnRequestModal 
        open={showReturnModal} 
        onOpenChange={setShowReturnModal} 
        onSubmit={handleReturnSubmit}
        isSubmitting={isSubmittingReturn}
      />
    </div>
  );
}