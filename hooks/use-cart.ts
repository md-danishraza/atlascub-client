"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  hydrateCart,
  setSyncing,
  setLastSynced,
  CartItem,
  openCart,
  closeCart,
  toggleCart,
  removeItemFromCart,
} from "@/lib/store/features/cartSlice";
import { useUser } from "@clerk/nextjs";
import {
  useSyncCartMutation,
  useGetCartQuery,
  useClearCartOnBackendMutation,
} from "@/lib/store/apis/cart-api";

const STORAGE_KEY = "atlascub-cart";
const SYNC_DEBOUNCE_MS = 2000;

export function useCart() {
  const dispatch = useAppDispatch();
  const { items, isOpen, isSyncing, lastSynced } = useAppSelector(
    (state) => state.cart
  );
  const { user, isSignedIn } = useUser();

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  const [syncCartToBackend] = useSyncCartMutation();
  const [clearCartOnBackend] = useClearCartOnBackendMutation();

  // Fetch cart from backend when user signs in
  const { data: backendCart, refetch: refetchBackendCart } = useGetCartQuery(
    undefined,
    {
      skip: !isSignedIn,
    }
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Load from localStorage on mount (guest) or merge with backend (logged in)
  useEffect(() => {
    if (!isInitialLoadRef.current) return;
    isInitialLoadRef.current = false;

    if (isSignedIn && backendCart) {
      // User is signed in - use backend cart
      if (backendCart.length > 0) {
        dispatch(hydrateCart(backendCart));
      } else {
        // Check localStorage for guest cart to merge
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const localCart = JSON.parse(stored);
            if (localCart.length > 0) {
              dispatch(hydrateCart(localCart));
              // Sync local cart to backend
              syncCartToBackend(localCart);
            }
          } catch (e) {
            console.error("Failed to parse local cart:", e);
          }
        }
      }
      // Clear localStorage after merge
      localStorage.removeItem(STORAGE_KEY);
    } else if (!isSignedIn) {
      // Guest user - load from localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.length > 0) {
            dispatch(hydrateCart(parsed));
          }
        } catch (e) {
          console.error("Failed to hydrate cart:", e);
        }
      }
    }
  }, [isSignedIn, backendCart, dispatch, syncCartToBackend]);

  // Save to localStorage whenever cart changes (guest only)
  useEffect(() => {
    if (!isSignedIn && !isSyncing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isSignedIn, isSyncing]);

  // Debounced sync to backend (signed-in users only)
  const debouncedSync = useCallback(() => {
    if (!isSignedIn) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      if (items.length === 0) {
        // Clear backend cart if empty
        await clearCartOnBackend();
      } else {
        dispatch(setSyncing(true));
        try {
          await syncCartToBackend(items);
          dispatch(setLastSynced(new Date().toISOString()));
        } catch (error) {
          console.error("Failed to sync cart:", error);
        } finally {
          dispatch(setSyncing(false));
        }
      }
    }, SYNC_DEBOUNCE_MS);
  }, [items, isSignedIn, syncCartToBackend, clearCartOnBackend, dispatch]);

  // Trigger debounced sync when cart changes (signed-in users only)
  useEffect(() => {
    if (isSignedIn && !isInitialLoadRef.current) {
      debouncedSync();
    }
  }, [items, isSignedIn, debouncedSync]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  const addItem = useCallback(
    (item: CartItem) => {
      dispatch(addToCart(item));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (id: string) => {
      dispatch(removeFromCart(id));
    },
    [dispatch]
  );

  const removeItemByAttributes = useCallback(
    (productId: string, size: string, color: string) => {
      dispatch(removeItemFromCart({ productId, size, color }));
    },
    [dispatch]
  );

  const updateItemQuantity = useCallback(
    (id: string, quantity: number) => {
      dispatch(updateQuantity({ id, quantity }));
    },
    [dispatch]
  );

  const clearAll = useCallback(async () => {
    dispatch(clearCart());
    if (isSignedIn) {
      await clearCartOnBackend();
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [dispatch, isSignedIn, clearCartOnBackend]);

  const openCartDrawer = useCallback(() => {
    dispatch(openCart());
  }, [dispatch]);

  const closeCartDrawer = useCallback(() => {
    dispatch(closeCart());
  }, [dispatch]);

  const toggleCartDrawer = useCallback(() => {
    dispatch(toggleCart());
  }, [dispatch]);

  const forceSync = useCallback(async () => {
    if (isSignedIn && items.length > 0) {
      dispatch(setSyncing(true));
      try {
        await syncCartToBackend(items);
        dispatch(setLastSynced(new Date().toISOString()));
      } catch (error) {
        console.error("Failed to force sync cart:", error);
      } finally {
        dispatch(setSyncing(false));
      }
    }
  }, [items, isSignedIn, syncCartToBackend, dispatch]);

  return {
    items,
    itemCount,
    subtotal,
    isOpen,
    isSyncing,
    lastSynced,
    addItem,
    removeItem,
    removeItemByAttributes,
    updateItemQuantity,
    clearAll,
    openCartDrawer,
    closeCartDrawer,
    toggleCartDrawer,
    forceSync,
  };
}
