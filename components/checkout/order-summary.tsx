"use client";

import { useAppSelector } from "@/lib/store/store";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Truck, CheckCircle2, AlertTriangle, Loader2, Coins } from "lucide-react";
import { useGetSettingsQuery } from "@/lib/store/apis/store-settings-api";

interface OrderSummaryProps {
  isCod?: boolean;
}

export function OrderSummary({ isCod = false }: OrderSummaryProps) {
  const { items } = useAppSelector((state) => state.cart);
  
  // 🛡️ Fetch live store settings from NestJS API
  const { data: settings, isLoading } = useGetSettingsQuery();

  // Fallbacks while loading to prevent UI flashes
  const FREE_SHIPPING_THRESHOLD = settings?.freeShippingThreshold ?? 5000;
  const SHIPPING_COST = settings?.shippingCost ?? 200;
  const TAX_RATE = settings?.taxRate ?? 0.18;
  const IS_TAX_INCLUSIVE = settings?.isTaxInclusive ?? true;
  const IS_ACCEPTING_ORDERS = settings?.isAcceptingOrders ?? true;
  const COD_FEE = settings?.codFee ?? 0;

  // Dynamic Calculations
  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isFreeShipping = rawSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : SHIPPING_COST;
  const appliedCodFee = isCod ? COD_FEE : 0;
  
  // Inclusive vs Exclusive Tax Logic
  const baseAmount = rawSubtotal / (1 + TAX_RATE);
  const tax = IS_TAX_INCLUSIVE 
    ? rawSubtotal - baseAmount 
    : rawSubtotal * TAX_RATE;
    
  const total = IS_TAX_INCLUSIVE 
    ? rawSubtotal + shipping + appliedCodFee 
    : rawSubtotal + shipping + tax + appliedCodFee;
  
  const shippingProgress = Math.min((rawSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 md:p-8 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-primary/5 blur-3xl transition-transform group-hover:scale-150 duration-700 pointer-events-none" />

      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="h-5 w-5 text-primary" />
        <h2 className="heading-sm font-primary m-0">Order Summary</h2>
      </div>

      {/* 🛑 STORE INACTIVE BANNER */}
      {!IS_ACCEPTING_ORDERS && (
        <div className="mb-6 bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex gap-3 text-destructive animate-in fade-in">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold">Ordering Currently Paused</p>
            <p className="mt-1 opacity-90">We are currently not accepting new orders as we update our inventory. Please check back later.</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12 text-muted-foreground animate-in fade-in duration-500">
          <p>Your cart is feeling a bit light.</p>
        </div>
      )}

      {/* Cart Items */}
      <div className="space-y-5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="flex gap-4 pb-4 border-b border-border/40 last:border-0 last:pb-0 animate-in fade-in slide-in-from-right-4 fill-mode-both"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted border border-border/50 transition-colors">
              <Image
                src={item.image || "/images/placeholder.jpg"}
                alt={item.name}
                fill
                className="object-cover"
              />
              <div className="absolute -top-1 -right-1 bg-foreground text-background text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-card z-10">
                {item.quantity}
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-sm font-medium line-clamp-1 text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground mt-1 tracking-wide">
                {item.size} <span className="mx-1">•</span> <span className="capitalize">{item.color}</span>
              </p>
              <div className="mt-2 text-sm font-semibold text-foreground">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      {items.length > 0 && (
        <div className="mt-8 space-y-4 pt-6 border-t border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
          
          {/* Free Shipping Tracker */}
          <div className="bg-muted/40 rounded-lg p-3 space-y-2 border border-border/30">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Truck className="h-3.5 w-3.5" /> Shipping
              </span>
              {isFreeShipping ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Free
                </span>
              ) : (
                <span className="text-muted-foreground">
                  ₹{formatPrice(FREE_SHIPPING_THRESHOLD - rawSubtotal)} away from Free
                </span>
              )}
            </div>
            <div className="h-1.5 w-full bg-secondary overflow-hidden rounded-full">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${isFreeShipping ? 'bg-emerald-500' : 'bg-primary'}`}
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          <div className="space-y-3 px-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-foreground">{formatPrice(rawSubtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span className={shipping === 0 ? "text-emerald-600 font-medium" : "text-foreground"}>
                {shipping === 0 ? "FREE" : formatPrice(shipping)}
              </span>
            </div>

            {/* 🛡️ Dynamic Cash on Delivery handling fee element */}
            {isCod && COD_FEE > 0 && (
              <div className="flex justify-between text-amber-700 dark:text-amber-400 font-medium animate-in fade-in duration-300">
                <span className="flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5 animate-pulse" /> COD Surcharge
                </span>
                <span>{formatPrice(COD_FEE)}</span>
              </div>
            )}

            {/* Exclusive Tax Display (Added on top) */}
            {!IS_TAX_INCLUSIVE && (
              <div className="flex justify-between">
                <span>Estimated GST ({(TAX_RATE * 100).toFixed(0)}%)</span>
                <span className="text-foreground">{formatPrice(tax)}</span>
              </div>
            )}
          </div>

          <Separator className="bg-border/60" />

          {/* Grand Total */}
          <div className="flex justify-between items-end px-1 pt-2">
            <div className="space-y-1">
              <span className="text-base font-bold text-foreground">Total</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {IS_TAX_INCLUSIVE 
                  ? `Includes ₹${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in GST.` 
                  : "GST Applied"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-primary tracking-tight">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}