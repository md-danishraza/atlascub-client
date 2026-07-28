"use client";

import { Loader2 } from "lucide-react";
import { Review } from "@/lib/store/apis/review-api";
import { ReviewStar } from "./review-star";
import { formatDistanceToNow } from "date-fns";

interface ReviewItemProps {
  review: Review;
  canDelete?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export function ReviewItem({ review, canDelete, onDelete, isDeleting }: ReviewItemProps) {
  // 🛡️ FIX: Removed the "hasReviewed" early return from here!
  // This component should ONLY be responsible for rendering the review itself.

  return (
    <div className="border-b border-border pb-4 last:border-0">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{review.userName}</span>
            {review.isVerified && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 uppercase tracking-wider">
                Verified
              </span>
            )}
          </div>
          <ReviewStar rating={review.rating} size="sm" />
        </div>
        
        {/* 🛡️ Delete button will now correctly show if canDelete is true */}
        {canDelete && (
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="text-xs font-medium text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> Deleting...
              </>
            ) : (
              "Delete Review"
            )}
          </button>
        )}
      </div>
      
      {review.title && (
        <h4 className="mt-3 font-medium text-foreground">{review.title}</h4>
      )}
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
      <p className="mt-3 text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
      </p>
    </div>
  );
}