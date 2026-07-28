"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { openWishlistDrawer } from "@/lib/store/features/wishlistSlice";

export function WishlistIcon() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.wishlist);
  const itemCount = items.length;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative hover:bg-muted/50 transition-colors"
      onClick={() => dispatch(openWishlistDrawer())}
    >
      <Heart 
        // 🛡️ FIX: Makes the icon fill red when active, completely ignoring theme inversions
        className={`h-5 w-5 transition-all duration-300 ${
          itemCount > 0 ? "fill-red-500 text-red-500" : "text-foreground"
        }`} 
      />
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            key="wishlist-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            // 🛡️ FIX: Enforced bg-red-500 and text-white so the badge never turns white/invisible in dark mode
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-sm ring-2 ring-background"
          >
            {itemCount > 9 ? "9+" : itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}