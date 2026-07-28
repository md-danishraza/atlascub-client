"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Loader2, ShieldCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Razorpay options type definition
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler?: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Inlined useRazorpay hook
export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => setIsLoaded(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      toast.error("Payment gateway failed to load. Please check your connection.");
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initializePayment = useCallback(
    (options: RazorpayOptions, onPaymentFailure?: (error: string) => void) => {
      if (!isLoaded || !window.Razorpay) {
        toast.error("Payment gateway is not ready. Please try again.");
        return;
      }

      try {
        const razorpay = new window.Razorpay(options);

        razorpay.on("payment.failed", (response: any) => {
          const errorMsg =
            response.error?.description || "Payment failed. Please try again.";
          if (onPaymentFailure) {
            onPaymentFailure(errorMsg);
          } else {
            toast.error(errorMsg);
          }
        });

        razorpay.open();
        return razorpay;
      } catch (error) {
        console.error("Razorpay initialization error:", error);
        toast.error("Failed to initialize payment gateway");
      }
    },
    [isLoaded]
  );

  return {
    isLoaded,
    initializePayment,
  };
}

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderData: {
    orderId: string;
    orderNumber: string;
    razorpayOrderId: string;
    keyId: string;
    amount: number;
  } | null;
  onSuccess: (paymentId: string, orderId: string) => void;
  onFailure: (error: string) => void;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

export function PaymentModal({
  open,
  onOpenChange,
  orderData,
  onSuccess,
  onFailure,
  user,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { isLoaded, initializePayment } = useRazorpay();
  
  const hasAutoOpened = useRef(false);

  useEffect(() => {
    if (!open) {
      hasAutoOpened.current = false;
      setIsProcessing(false);
      // Failsafe: Ensure cursor lock is removed if modal force-closes
      document.body.classList.remove("razorpay-active");
    }
  }, [open]);

  const handlePayClick = useCallback(() => {
    if (!orderData || !isLoaded) return;

    setIsProcessing(true);

    // 🛡️ CRITICAL FIX: Restore the native cursor and remove Shadcn pointer locks
    document.body.classList.add("razorpay-active");
    document.body.style.cursor = "auto";

    initializePayment(
      {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: "INR",
        name: "Atlascub",
        description: `Order #${orderData.orderNumber || "N/A"}`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        notes: {
          orderId: orderData.orderId,
          orderNumber: orderData.orderNumber,
        },
        theme: {
          color: "#9b2c2c",
        },
        handler: (response: any) => {
          // 🛡️ Cleanup cursor lock on success
          document.body.classList.remove("razorpay-active");
          document.body.style.cursor = "none"; // Restore custom cursor

          const paymentId = response.razorpay_payment_id;
          const rzpOrderId = response.razorpay_order_id;

          toast.success("Payment successful!");
          onSuccess(paymentId, rzpOrderId);
          
          setIsProcessing(false);
          onOpenChange(false);
        },
        modal: {
          ondismiss: () => {
            document.body.classList.remove("razorpay-active");
            setIsProcessing(false);
            onOpenChange(false); // Simply closes the modal UI state wrapper safely
            onFailure("Payment window closed."); 
          },
        },
      },
      (errorMsg) => {
        // 🛡️ Cleanup cursor lock on failure
        document.body.classList.remove("razorpay-active");
        document.body.style.cursor = "none"; // Restore custom cursor
        setIsProcessing(false);
        onFailure(errorMsg);
        toast.error(errorMsg);
      }
    );
  }, [orderData, isLoaded, user, initializePayment, onSuccess, onFailure, onOpenChange]);

  useEffect(() => {
    if (open && isLoaded && orderData && !hasAutoOpened.current) {
      hasAutoOpened.current = true;
      
      const timer = setTimeout(() => {
        handlePayClick();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [open, isLoaded, orderData, handlePayClick]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-background rounded-2xl border border-border p-6 shadow-2xl relative"
          >
            {/* Header */}
            {!isProcessing && (
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 p-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            <div className="text-center flex flex-col items-center justify-center gap-2 mb-6 pt-4">
              {isProcessing ? (
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
              ) : (
                <ShieldCheck className="h-10 w-10 text-emerald-600 mb-2" />
              )}
              <h2 className="text-xl font-semibold text-foreground">
                {isProcessing ? "Processing Payment..." : "Secure Payment"}
              </h2>
            </div>

            {/* Body */}
            <div className="flex flex-col items-center justify-center space-y-6">
              {isProcessing ? (
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Please complete the payment in the secure window
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Do not refresh or close this page
                  </p>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center space-y-6">
                  <div className="bg-muted/50 rounded-xl p-6 w-full text-center space-y-2 border border-border/50">
                    <p className="text-sm text-muted-foreground">Amount to Pay</p>
                    <p className="text-4xl font-bold text-foreground">
                      {orderData ? `₹${orderData.amount.toLocaleString()}` : "..."}
                    </p>
                    <p className="text-xs text-muted-foreground pt-2">
                      Order #{orderData?.orderNumber}
                    </p>
                  </div>

                  <div className="w-full space-y-3">
                    <Button
                      onClick={handlePayClick}
                      disabled={!isLoaded || !orderData}
                      className="w-full text-md h-12"
                    >
                      {!isLoaded ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Loading Secure Gateway...
                        </>
                      ) : (
                        "Retry Payment"
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => onOpenChange(false)}
                      disabled={isProcessing}
                      className="w-full h-12"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}