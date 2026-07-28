"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/components/cart/cart-item";
import { EmptyState } from "@/components/shared/empty-state";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { clearCart, removeFromCart, updateQuantity } from "@/lib/store/features/cartSlice";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CartClient() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  
  // Auth Wall
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  if (!isLoaded) return null; // Wait for clerk to init

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-12">
        <SlugBreadcrumb />
        <EmptyState
          title="Sign in required"
          description="Please sign in to view and manage your shopping cart."
          icon={<Lock className="h-10 w-10 text-muted-foreground" />}
          action={{
            label: "Sign In / Register",
            onClick: () => router.push("/sign-in")
          }}
        />
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <SlugBreadcrumb />
        <EmptyState
          title="Your cart is empty"
          description="Add items to get started"
          action={{
            label: "Continue Shopping",
            href: "/shop",
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <SlugBreadcrumb />

      <h1 className="heading-lg font-primary mt-4 mb-8">Shopping Cart ({itemCount})</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card">
            <div className="hidden border-b border-border p-4 text-sm font-medium text-muted-foreground md:grid md:grid-cols-12">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="divide-y divide-border">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={(id, quantity) =>
                    dispatch(updateQuantity({ id, quantity }))
                  }
                  onRemove={(id) => dispatch(removeFromCart(id))}
                />
              ))}
            </div>

            <div className="border-t border-border p-4">
              <div className="flex items-center justify-between">
                <Button variant="ghost" asChild className="gap-2">
                  <Link href="/shop">
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => dispatch(clearCart())}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-emerald-600 font-medium">Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
            </div>

            <Button asChild className="mt-6 w-full gap-2" size="lg">
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}