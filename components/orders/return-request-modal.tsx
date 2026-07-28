"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

interface ReturnRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { returnType: string; reason: string }) => void;
  isSubmitting: boolean;
}

export function ReturnRequestModal({ open, onOpenChange, onSubmit, isSubmitting }: ReturnRequestModalProps) {
  const [returnType, setReturnType] = useState<"REFUND" | "REPLACEMENT" | null>(null);
  const [reason, setReason] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = () => {
    if (returnType && reason.trim().length >= 10 && agreed) {
      onSubmit({ returnType, reason: reason.trim() });
    }
  };

  // Reset form when modal is closed
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setReturnType(null);
      setReason("");
      setAgreed(false);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-primary">Initiate Return or Replace</DialogTitle>
          <DialogDescription>
            Select your preferred resolution and tell us what went wrong.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setReturnType("REFUND")}
              className={`p-4 border-2 rounded-xl text-left transition-all ${
                returnType === "REFUND" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Refund</span>
                {returnType === "REFUND" && <CheckCircle2 className="h-4 w-4 text-primary" />}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Return the item and get your money back to the original payment method.
              </p>
            </button>

            <button
              onClick={() => setReturnType("REPLACEMENT")}
              className={`p-4 border-2 rounded-xl text-left transition-all ${
                returnType === "REPLACEMENT" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Replacement</span>
                {returnType === "REPLACEMENT" && <CheckCircle2 className="h-4 w-4 text-primary" />}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Exchange the item for a different size or a new unit of the exact same product.
              </p>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for request</label>
            <textarea
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary min-h-[100px] resize-none"
              placeholder="Please provide details (e.g., 'Size is too small', 'Received damaged item')..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            {reason.length > 0 && reason.trim().length < 10 && (
              <p className="text-xs text-destructive">Please provide a slightly more detailed reason.</p>
            )}
          </div>

          <label className="flex items-start gap-3 cursor-pointer p-3 border rounded-lg bg-muted/30">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="text-xs text-muted-foreground leading-relaxed">
              I confirm the item is unused, unwashed, and still has all original tags attached. I agree to the <a href="/returns" target="_blank" className="text-primary hover:underline">Return Policy T&Cs</a>.
            </span>
          </label>

          <Button
            className="w-full h-12 text-base shadow-sm"
            disabled={!returnType || reason.trim().length < 10 || !agreed || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting Request...</>
            ) : (
              "Submit Request"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}