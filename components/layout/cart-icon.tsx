"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

export function CartIcon() {
  const { itemCount, isSyncing, openCartDrawer } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={openCartDrawer}
    >
      {isSyncing ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <ShoppingBag className="h-5 w-5" />
      )}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            key="cart-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
          >
            {itemCount > 9 ? "9+" : itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}