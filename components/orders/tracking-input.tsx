"use client";

import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TrackingInputProps {
  order: any;
  onUpdate: (data: { trackingNumber?: string; awbCode?: string; courierName?: string }) => void;
  isLoading: boolean;
}

export function TrackingInput({ order, onUpdate, isLoading }: TrackingInputProps) {
  const [awbCode, setAwbCode] = useState(order?.awbCode || "");
  const [courierName, setCourierName] = useState(order?.courierName || "");
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || "");

  // Keep local state in sync if data changes externally
  useEffect(() => {
    setAwbCode(order?.awbCode || "");
    setCourierName(order?.courierName || "");
    setTrackingNumber(order?.trackingNumber || "");
  }, [order]);

  const handleSave = () => {
    onUpdate({ awbCode, courierName, trackingNumber });
  };

  return (
    <div className="space-y-5 p-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Shiprocket AWB Code</Label>
          <Input
            placeholder="e.g. 1435267890"
            value={awbCode}
            onChange={(e) => setAwbCode(e.target.value)}
            className="font-mono bg-muted/20"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Courier Partner</Label>
          <Input
            placeholder="e.g. Delhivery, Bluedart"
            value={courierName}
            onChange={(e) => setCourierName(e.target.value)}
            className="bg-muted/20"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Fallback Tracking Link</Label>
        <Input
          placeholder="Direct tracking URL (Optional)"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="bg-muted/20"
        />
      </div>
      
      <div className="pt-2">
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="w-full gap-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Logistics Details
        </Button>
      </div>
    </div>
  );
}