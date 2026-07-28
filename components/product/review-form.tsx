"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  onSubmit: (data: { rating: number; title: string; comment: string }) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function ReviewForm({ productId, onSubmit, onCancel, isSubmitting = false }: ReviewFormProps) {
  const { isSignedIn } = useUser();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    await onSubmit({ rating, title: title.trim(), comment: comment.trim() });
    
    // Reset form on success
    setRating(0);
    setTitle("");
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border p-5">
      <h3 className="font-semibold text-foreground">Write a Review</h3>
      
      {/* Rating Stars */}
      <div className="space-y-2">
        <Label>Rating *</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
              disabled={isSubmitting}
            >
              <Star
                className={`h-6 w-6 transition-all ${
                  (hoverRating || rating) >= star
                    ? "fill-yellow-500 text-yellow-500"
                    : "fill-muted text-muted-foreground"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-muted-foreground">
              {rating === 5 && "Excellent!"}
              {rating === 4 && "Very Good"}
              {rating === 3 && "Good"}
              {rating === 2 && "Fair"}
              {rating === 1 && "Poor"}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <Label htmlFor="review-title">Title (Optional)</Label>
        <Input
          id="review-title"
          placeholder="Summarize your experience"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {/* Comment */}
      <div>
        <Label htmlFor="review-comment">Review *</Label>
        <Textarea
          id="review-comment"
          placeholder="Share your thoughts about this product..."
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}