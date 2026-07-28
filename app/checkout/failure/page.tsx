"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  XCircle, 
  AlertCircle, 
  ArrowLeft, 
  ShoppingBag, 
  LifeBuoy,
  RefreshCcw
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";

// 1. We extract the content that uses searchParams into its own component
function FailureContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Payment was unsuccessful or cancelled. No charges were made.";

  useEffect(() => {
    // Cleanup: remove any stale payment session data
    sessionStorage.removeItem("checkout_session");
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-12 md:mt-20 flex flex-col items-center text-center">
      
      {/* Animated Icon */}
      <div className="relative mb-6 animate-in zoom-in duration-500 delay-100 fill-mode-both">
        <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping opacity-75" />
        <div className="relative rounded-full bg-destructive/10 p-5 flex items-center justify-center border border-destructive/20 shadow-sm">
          <XCircle className="h-12 w-12 text-destructive" />
        </div>
      </div>

      <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Payment Failed
        </h1>
        <p className="text-muted-foreground text-lg">
          Don't worry, your cart is perfectly safe. Let's try that again.
        </p>
      </div>

      {/* Error Card */}
      <Card className="w-full mt-8 border-destructive/20 shadow-sm bg-destructive/5 animate-in fade-in slide-in-from-bottom-6 duration-500 delay-300 fill-mode-both">
        <CardContent className="p-5">
          <div className="flex items-start gap-4 text-left">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-destructive">What went wrong?</p>
              <p className="text-sm text-destructive/90">{error}</p>
              
              <ul className="text-xs text-destructive/80 list-disc list-inside mt-3 space-y-1">
                <li>Double-check your internet connection</li>
                <li>Ensure your UPI app was not closed prematurely</li>
                <li>Verify your card details and available balance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-400 fill-mode-both">
        <Button asChild size="lg" className="w-full sm:w-auto min-w-[160px] gap-2">
          <Link href="/checkout">
            <RefreshCcw className="h-4 w-4" />
            Try Payment Again
          </Link>
        </Button>
        <Button variant="outline" asChild size="lg" className="w-full sm:w-auto min-w-[160px] gap-2">
          <Link href="/cart">
            <ShoppingBag className="h-4 w-4" />
            Review Cart
          </Link>
        </Button>
      </div>

      {/* Help Section */}
      <div className="mt-12 text-sm text-muted-foreground flex items-center gap-2 animate-in fade-in duration-500 delay-500 fill-mode-both">
        <LifeBuoy className="h-4 w-4" />
        <p>
          Need help?{" "}
          <Link href="/support" className="text-primary font-medium hover:underline underline-offset-4">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}

// 2. We wrap the page in a Suspense boundary to prevent Next.js build de-optimizations
export default function CheckoutFailurePage() {
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <div className="animate-in fade-in duration-500">
          <SlugBreadcrumb />
        </div>
        
        <Suspense 
          fallback={
            <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-destructive border-t-transparent" />
              <p className="text-muted-foreground animate-pulse">Loading error details...</p>
            </div>
          }
        >
          <FailureContent />
        </Suspense>
      </div>
    </div>
  );
}