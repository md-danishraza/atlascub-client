"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { closeWishlistDrawer, removeFromWishlist } from "@/lib/store/features/wishlistSlice";
import { addToCart, openCart } from "@/lib/store/features/cartSlice";
import { EmptyState } from "@/components/shared/empty-state";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function WishlistSidebar() {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.wishlist);
  const cartItems = useAppSelector((state) => state.cart.items);
  
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleMoveToCart = (item: typeof items[0]) => {
    if (!isSignedIn) {
      dispatch(closeWishlistDrawer());
      router.push("/sign-in");
      return;
    }

    // 🛡️ SMART MERGING FIX: 
    // If this product is already in the cart under a specific variant (e.g., Size S, Indigo Blue), 
    // we inherit those exact choices so Redux stacks them perfectly instead of splitting into a new "M / Default" row!
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeWishlistDrawer())}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-background shadow-xl sm:max-w-md"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Wishlist</h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => dispatch(closeWishlistDrawer())}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {items.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <EmptyState
                    title="Your wishlist is empty"
                    description="Save items you love here."
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-4 border border-border rounded-lg p-3 relative bg-card">
                      <div className="relative aspect-[3/4] w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col flex-1 justify-between">
                        <div className="pr-6">
                          <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                          <p className="text-sm font-semibold mt-1">₹{item.price.toLocaleString()}</p>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full gap-2 mt-2" 
                          onClick={() => handleMoveToCart(item)}
                        >
                          <ShoppingBag className="h-3.5 w-3.5" /> Move to Cart
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => dispatch(removeFromWishlist(item.productId))}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 🛡️ NEW FIX: Wishlist Footer with Navigation Link */}
            {items.length > 0 && (
              <div className="border-t border-border p-4 bg-card/50 backdrop-blur-sm">
                <Button 
                  asChild 
                  className="w-full" 
                  variant="outline" 
                  size="lg"
                  onClick={() => dispatch(closeWishlistDrawer())}
                >
                  <Link href="/wishlist">View Full Wishlist</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}