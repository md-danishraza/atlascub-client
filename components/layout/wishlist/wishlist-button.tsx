"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { WishlistItem } from "@/lib/store/features/wishlistSlice";
import { Product } from "@/lib/store/apis/product-api";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  product: Product;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function WishlistButton({ product, size = "md", className = "" }: WishlistButtonProps) {
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  // Auth Protection
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 w-8";
      case "lg":
        return "h-10 w-10";
      default:
        return "h-9 w-9";
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // REDIRECT IF NOT SIGNED IN
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const wishlistItem: WishlistItem = {
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.images[0],
      slug: product.slug,
      gender: product.gender,
      category: product.category?.name || "Other", // Get category name from object
    };

    toggleItem(wishlistItem);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="ghost"
        size="icon"
        className={`${getSizeClasses()} rounded-full bg-grey/80 backdrop-blur-sm hover:bg-white ${className}`}
        onClick={handleClick}
        aria-label="wishlist-button"
      >
        <Heart
          className={`h-4 w-4 transition-all hover:text-accent-foreground ${
            inWishlist ? "fill-red-500 text-red-500" : "text-foreground"
          }`}
        />
      </Button>
    </motion.div>
  );
}