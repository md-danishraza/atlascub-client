"use client";

import { Star } from "lucide-react";

interface ReviewStarProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

export function ReviewStar({ rating, size = "md" }: ReviewStarProps) {
  const sizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };
  const iconSize = sizes[size];

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${iconSize} ${
            star <= rating
              ? "fill-yellow-500 text-yellow-500"
              : "fill-muted text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}