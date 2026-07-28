"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  max?: number;
}

export function QuantitySelector({ quantity, onIncrease, onDecrease, max = 10 }: QuantitySelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Quantity</h3>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onDecrease}
          disabled={quantity <= 1}
          className="h-10 w-10"
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="w-12 text-center text-lg font-medium">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={onIncrease}
          disabled={quantity >= max}
          className="h-10 w-10"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}