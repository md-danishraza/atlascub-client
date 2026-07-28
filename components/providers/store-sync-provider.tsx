"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { hydrateCart } from "@/lib/store/features/cartSlice";
import { hydrateWishlist } from "@/lib/store/features/wishlistSlice";
import { useAuth } from "@clerk/nextjs";
import { cartApi, useSyncCartMutation } from "@/lib/store/apis/cart-api";
import { wishlistApi, useSyncWishlistMutation } from "@/lib/store/apis/wishlist-api";

/**
 * 🛡️ STATE PERSISTENCE ENGINE (OPTIMIZED)
 * Prevents Main Thread blocking and stops redundant "Echo Sync" feedback loops.
 */
export function StoreSyncProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  
  const isInitialized = useRef(false);
  const isDbHydrating = useRef(false); // 🛡️ Hydration Lock: Prevents DB pulls from triggering DB pushes
  
  const { isSignedIn, isLoaded } = useAuth();
  
  const [syncCart] = useSyncCartMutation();
  const [syncWishlist] = useSyncWishlistMutation();

  // 1. FAST LOCAL LOAD: Deferred to prevent blocking the initial UI paint
  useEffect(() => {
    // We wrap this in a setTimeout so the browser renders your heavy Hero animations FIRST
    const timer = setTimeout(() => {
      try {
        const savedCart = localStorage.getItem("atlascub_cart");
        const savedWishlist = localStorage.getItem("atlascub_wishlist");
        
        if (savedCart) dispatch(hydrateCart(JSON.parse(savedCart)));
        if (savedWishlist) dispatch(hydrateWishlist(JSON.parse(savedWishlist)));
        
        // Unlock pushing 50ms later to guarantee the hydration dispatch doesn't trigger the save effects
        setTimeout(() => { isInitialized.current = true; }, 50);
      } catch (e) {
        console.error("Failed to hydrate state from local storage", e);
        isInitialized.current = true;
      }
    }, 150); // 150ms delay removes all landing stutter

    return () => clearTimeout(timer);
  }, [dispatch]);

  // 2. CROSS-DEVICE PULL: Fetch from Backend Database when user signs in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      isDbHydrating.current = true; // Lock pushing back to DB while we download

      Promise.all([
        dispatch(cartApi.endpoints.getCart.initiate()).unwrap().catch(() => null),
        dispatch(wishlistApi.endpoints.getWishlist.initiate()).unwrap().catch(() => null)
      ]).then(([serverCart, serverWishlist]) => {
        if (serverCart && serverCart.length > 0) dispatch(hydrateCart(serverCart));
        if (serverWishlist && serverWishlist.length > 0) dispatch(hydrateWishlist(serverWishlist));
        
        // Unlock pushing after React has enough time to commit the new state
        setTimeout(() => { isDbHydrating.current = false; }, 500);
      });
    }
  }, [isLoaded, isSignedIn, dispatch]);

  // 3A. SECURE PUSH: Mirror Cart changes to LocalStorage and Backend
  useEffect(() => {
    // 🛡️ GUARD: Only save if the user explicitly added/removed an item, NOT during initial load
    if (!isInitialized.current || isDbHydrating.current) return;
    
    localStorage.setItem("atlascub_cart", JSON.stringify(cartItems));

    if (isLoaded && isSignedIn) {
      const debounceTimer = setTimeout(() => {
        syncCart(cartItems).catch((err) => console.error("Cloud cart sync failed:", err));
      }, 1500); // Batched to 1.5 seconds to handle rapid quantity clicks efficiently
      return () => clearTimeout(debounceTimer);
    }
  }, [cartItems, isSignedIn, isLoaded, syncCart]);

  // 3B. SECURE PUSH: Mirror Wishlist changes to LocalStorage and Backend
  useEffect(() => {
    // 🛡️ GUARD: Only save if the user explicitly added/removed an item
    if (!isInitialized.current || isDbHydrating.current) return;
    
    localStorage.setItem("atlascub_wishlist", JSON.stringify(wishlistItems));

    if (isLoaded && isSignedIn) {
      const debounceTimer = setTimeout(() => {
        syncWishlist(wishlistItems).catch((err) => console.error("Cloud wishlist sync failed:", err));
      }, 1500);
      return () => clearTimeout(debounceTimer);
    }
  }, [wishlistItems, isSignedIn, isLoaded, syncWishlist]);

  return <>{children}</>;
}