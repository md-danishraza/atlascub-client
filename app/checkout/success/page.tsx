"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  Package, 
  ShoppingBag, 
  ArrowRight,
  FileText,
  Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetOrderByNumberQuery } from "@/lib/store/apis/checkout-api";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  // Fetch the order details to show a summary
  const { data: order, isLoading } = useGetOrderByNumberQuery(orderNumber || "", {
    skip: !orderNumber,
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Confirming your order details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-12 md:mt-16 flex flex-col items-center text-center">
      
      {/* Animated Success Icon */}
      <div className="relative mb-6 animate-in zoom-in duration-500 delay-100 fill-mode-both">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse opacity-75" />
        <div className="relative rounded-full bg-emerald-50 p-5 flex items-center justify-center border border-emerald-100 shadow-sm">
          <CheckCircle2 className="h-14 w-14 text-emerald-600" />
        </div>
      </div>

      <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground text-lg">
          Thank you for your purchase. Your order has been placed securely.
        </p>
      </div>

      {/* Order Details Card */}
      <Card className="w-full mt-8 border-border shadow-sm bg-card animate-in fade-in slide-in-from-bottom-6 duration-500 delay-300 fill-mode-both">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 text-left">
            
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="bg-primary/10 p-2 rounded-full">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Order Number</p>
                <p className="text-sm text-muted-foreground">{orderNumber || "Processing..."}</p>
              </div>
            </div>

            {order && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="text-base font-semibold">₹{order.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="text-base font-semibold capitalize">Razorpay</p>
                </div>
                <div className="col-span-2 mt-2 bg-muted/50 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    We've sent a confirmation email to <span className="font-medium text-foreground"></span> with your order details and tracking information.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-400 fill-mode-both">
        <Button asChild size="lg" className="w-full sm:w-auto min-w-[160px] gap-2">
          {/* Note: Update this link to your actual order details route if different */}
          <Link href={`/account/orders`}>
            <FileText className="h-4 w-4" />
            View My Orders
          </Link>
        </Button>
        <Button variant="outline" asChild size="lg" className="w-full sm:w-auto min-w-[160px] gap-2 group">
          <Link href="/shop">
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
            <ArrowRight className="h-4 w-4 ml-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

// Wrap in Suspense boundary for Next.js App Router stability
export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <Suspense 
          fallback={
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground animate-pulse">Finalizing your order...</p>
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}