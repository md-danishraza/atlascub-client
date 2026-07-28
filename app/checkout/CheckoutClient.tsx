"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";

import { OrderSummary } from "@/components/checkout/order-summary";
import { PaymentModal } from "@/components/checkout/payment-modal";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { useCheckout } from "@/hooks/use-checkout";
import { useAppSelector } from "@/lib/store/store";
import { useGetSettingsQuery } from "@/lib/store/apis/store-settings-api";

export default function CheckoutClient() {
  const router = useRouter();
  const { isSignedIn, isLoaded: authLoaded, user } = useUser();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [showPayment, setShowPayment] = useState(false);

  // 🛡️ Live configurations: check if COD is enabled and get COD surcharge fee
  const { data: settings } = useGetSettingsQuery();

  // Payment method selection state ('PREPAID' | 'COD')
  const [paymentMethod, setPaymentMethod] = useState<"PREPAID" | "COD">("PREPAID");
  const [showCodConfirm, setShowCodConfirm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const {
    orderData,
    isSubmitting,
    isProcessing,
    error,
    handlePlaceOrder,
    handlePaymentSuccess,
    handlePaymentFailure,
    resetCheckout,
  } = useCheckout();

  // Redirect on empty cart
  useEffect(() => {
    if (cartItems.length === 0 && !isProcessing && !showPayment) {
      router.push("/cart");
    }
  }, [cartItems, router, isProcessing, showPayment]);

  // Auth Protection redirect
  useEffect(() => {
    if (authLoaded && !isSignedIn) {
      router.push("/sign-in?redirect=/checkout");
    }
  }, [authLoaded, isSignedIn, router]);

  // Handle successful order creation (trigger Razorpay dialog for prepaid)
  useEffect(() => {
    if (orderData) {
      if (paymentMethod === "PREPAID") {
        setShowPayment(true);
      } else {
        // 🛡️ COD Orders do not need payment gateway prompts. 
        // Redirect directly to success landing route!
        router.push(`/checkout/success?orderNumber=${orderData.orderNumber}`);
      }
    }
  }, [orderData, paymentMethod, router]);

  const handleCheckoutSubmit = (addressId: string) => {
    setSelectedAddressId(addressId);
    
    if (paymentMethod === "COD") {
      // 🛡️ Show handling confirmation pop-up first before executing transactions
      setShowCodConfirm(true);
    } else {
      handlePlaceOrder(addressId, "PREPAID");
    }
  };

  const executeCodOrder = () => {
    if (!selectedAddressId) return;
    setShowCodConfirm(false);
    handlePlaceOrder(selectedAddressId, "COD");
  };

  if (!authLoaded || (cartItems.length === 0 && !isProcessing)) {
    return (
      <div className="min-h-[70vh] w-full flex flex-col items-center justify-center space-y-4 bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Preparing secure checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20 select-none">
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
        
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          <SlugBreadcrumb />
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mt-6 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Secure Checkout
          </h1>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">{error}</p>
              <Button
                variant="link"
                className="h-auto p-0 text-destructive underline mt-1"
                onClick={resetCheckout}
              >
                Clear error and try again
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
          
          <div className="lg:col-span-7 xl:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
            
            {/* 🛡️ PAYMENT METHOD SELECTION CARD (Prepaid vs COD) */}
            <div className="bg-card p-6 md:p-8 rounded-xl border shadow-sm">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-primary" /> Payment Selection
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Prepaid Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("PREPAID")}
                  className={`p-5 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                    paymentMethod === "PREPAID"
                      ? "border-primary bg-primary/5 font-semibold"
                      : "border-border/60 hover:border-primary/40 bg-muted/10"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="text-base text-foreground">Prepaid (Card / UPI / NetBanking)</span>
                    {paymentMethod === "PREPAID" && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Enjoy faster courier processing and complete protection through Razorpay's secure transaction layers.
                  </p>
                </button>

                {/* Cash on Delivery (COD) Option */}
                <button
                  type="button"
                  disabled={!settings?.isCodEnabled}
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-5 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                    !settings?.isCodEnabled
                      ? "opacity-50 cursor-not-allowed border-dashed border-border"
                      : paymentMethod === "COD"
                      ? "border-primary bg-primary/5 font-semibold"
                      : "border-border/60 hover:border-primary/40 bg-muted/10"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="text-base text-foreground">
                      Cash on Delivery (COD)
                      {settings?.isCodEnabled && settings.codFee > 0 && (
                        <span className="ml-2 text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 font-bold px-2 py-0.5 rounded">
                          + ₹{settings.codFee}
                        </span>
                      )}
                    </span>
                    {paymentMethod === "COD" && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {!settings?.isCodEnabled 
                      ? "Currently unavailable in your region." 
                      : "Pay securely in cash or via digital scanner when your package arrives at your doorstep."}
                  </p>
                </button>
              </div>
            </div>

            {/* Address Form Selection */}
            <CheckoutForm
              onSubmit={handleCheckoutSubmit}
              isSubmitting={isSubmitting}
              paymentMethod={paymentMethod}
            />
          </div>

          <div className="lg:col-span-5 xl:col-span-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            <div className="sticky top-24"> 
              <OrderSummary isCod={paymentMethod === "COD"} />
            </div>
          </div>

        </div>
      </div>

      {/* Razorpay Prepaid Execution Modal */}
      <PaymentModal
        open={showPayment}
        onOpenChange={setShowPayment}
        orderData={orderData}
        onSuccess={(paymentId, rzpOrderId) => {
          handlePaymentSuccess({ razorpay_payment_id: paymentId, razorpay_order_id: rzpOrderId });
        }}
        onFailure={(errorMsg) => {
          handlePaymentFailure(new Error(errorMsg));
        }}
        user={{
          name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Customer",
          email: user?.primaryEmailAddress?.emailAddress || "",
          phone: "", 
        }}
      />

      {/* 🛡️ CASH ON DELIVERY AGREEMENT CONFIRMATION DIALOG (NEWLY ADDED) */}
      <Dialog open={showCodConfirm} onOpenChange={setShowCodConfirm}>
        <DialogContent className="sm:max-w-md bg-background">
          <DialogHeader className="items-center text-center">
            <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-3">
              <ShieldAlert className="h-6 w-6 text-amber-600" />
            </div>
            <DialogTitle className="text-xl font-primary">Cash on Delivery Confirmation</DialogTitle>
            <DialogDescription className="text-center">
              Please review the Cash on Delivery processing guidelines before confirming.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="bg-muted/50 rounded-xl p-4 border text-sm leading-relaxed text-stone-700 dark:text-stone-300">
              <p className="font-semibold text-foreground mb-2">COD Surcharge Terms:</p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-muted-foreground">
                <li>An additional handling fee of <strong className="text-foreground">₹{settings?.codFee || 0}</strong> has been added.</li>
                <li>Your COD request will be sent to the administrator for verification.</li>
                <li>A confirmation email will be dispatched once our dispatch studio accepts and prepares the package.</li>
                <li>Ensure the exact monetary value is ready during dispatch to avoid parcel delivery delays.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={executeCodOrder} className="h-12 text-sm uppercase tracking-wider font-bold w-full">
                Confirm & Place COD Order
              </Button>
              <Button variant="ghost" onClick={() => setShowCodConfirm(false)} className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}