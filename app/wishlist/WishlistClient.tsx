"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { removeFromWishlist } from "@/lib/store/features/wishlistSlice";
import { addToCart, openCart } from "@/lib/store/features/cartSlice";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function WishlistClient() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.wishlist);
  const cartItems = useAppSelector((state) => state.cart.items);
  
  // Auth Protection
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const handleMoveToCart = (item: typeof items[0]) => {
    // 🛡️ SMART MERGING FIX: Must be INSIDE the function so it knows which 'item' we clicked!
    // If this product is already in the cart under a specific variant, inherit those exact choices.
    const existingCartItem = cartItems.find((c) => c.productId === item.productId);
    const sizeToUse = existingCartItem?.size || "M";
    const colorToUse = existingCartItem?.color || "Default";
    
    dispatch(
      addToCart({
        id: `${item.productId}-${sizeToUse}-${colorToUse}`, 
        productId: item.productId,
        name: item.name,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        quantity: 1, 
        size: sizeToUse,
        color: colorToUse,
        image: item.image,
        slug: item.slug,
        inStock: true,
      })
    );
    
    dispatch(removeFromWishlist(item.productId));
    dispatch(openCart());
  };

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-12">
        <SlugBreadcrumb />
        <EmptyState
          title="Sign in required"
          description="Please sign in to save and view your favorite items."
          icon={<Lock className="h-10 w-10 text-muted-foreground" />}
          action={{
            label: "Sign In / Register",
            onClick: () => router.push("/sign-in")
          }}
        />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <SlugBreadcrumb />
        <EmptyState
          title="Your wishlist is empty"
          description="Save your favorite items here"
          action={{
            label: "Start Shopping",
            href: "/shop",
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <SlugBreadcrumb />

      <div className="flex items-center justify-between mt-4 mb-8">
        <h1 className="heading-lg font-primary">My Wishlist ({items.length})</h1>
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item, index) => (
          <motion.div
            key={item.productId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative rounded-lg border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <Link href={`/product/${item.slug}`}>
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-foreground line-clamp-1">{item.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm font-semibold">₹{item.price.toLocaleString()}</span>
                  {item.compareAtPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{item.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>

            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch(removeFromWishlist(item.productId))}
                className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
              >
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>

            <div className="border-t border-border p-4 pt-3">
              <Button
                size="sm"
                className="w-full gap-2"
                onClick={() => handleMoveToCart(item)}
              >
                <ShoppingBag className="h-4 w-4" />
                Move to Cart
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}