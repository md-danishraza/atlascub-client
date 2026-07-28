"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  inStock?: boolean;
}

export function AddToCartButton({ onClick, disabled, inStock = true }: AddToCartButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleClick = async () => {
    if (status === "loading") return;
    
    setStatus("loading");
    try {
      await onClick();
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      setStatus("idle");
    }
  };

  if (!inStock) {
    return (
      <Button disabled className="w-full bg-muted text-muted-foreground">
        Out of Stock
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || status === "loading"}
      className="relative w-full overflow-hidden"
      size="lg"
    >
      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Loader2 className="h-5 w-5 animate-spin" />
          </motion.div>
        )}
        
        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Check className="h-5 w-5" />
          </motion.div>
        )}
        
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Add to Cart</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}