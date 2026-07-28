"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertTriangle, Plus, MapPin, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useGetSettingsQuery } from "@/lib/store/apis/store-settings-api";
import { useGetAddressesQuery } from "@/lib/store/apis/account/address-api";
import { toast } from "sonner";

interface CheckoutFormProps {
  onSubmit: (addressId: string) => void;
  isSubmitting: boolean;
  paymentMethod?: "PREPAID" | "COD"; // 🛡️ Accept active payment method parameters
}

export function CheckoutForm({ onSubmit, isSubmitting, paymentMethod = "PREPAID" }: CheckoutFormProps) {
  const router = useRouter();
  const { data: settings } = useGetSettingsQuery();
  const { data: addresses, isLoading: addressesLoading } = useGetAddressesQuery();
  
  const isAcceptingOrders = settings?.isAcceptingOrders ?? true;
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Auto-select the default address if available
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddress.id);
    }
  }, [addresses, selectedAddressId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }
    onSubmit(selectedAddressId);
  };

  return (
    <div className="bg-card p-6 md:p-8 rounded-xl border shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" /> Delivery Address
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 rounded-full h-8"
          onClick={() => router.push("/account/address?redirect=/checkout")}
        >
          <Plus className="h-3.5 w-3.5" /> Add New
        </Button>
      </div>

      {!isAcceptingOrders && (
        <div className="mb-6 bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex gap-3 text-destructive animate-in fade-in">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold">Checkout is currently locked</p>
            <p className="mt-1 opacity-90">
              The store is not accepting new orders at this moment. You can browse and save items, but payments are paused.
            </p>
          </div>
        </div>
      )}

      <form 
        onSubmit={handleSubmit} 
        className={`space-y-6 transition-opacity duration-300 ${!isAcceptingOrders ? "opacity-50 pointer-events-none" : ""}`}
      >
        {addressesLoading ? (
          <div className="py-12 flex justify-center border border-dashed rounded-lg bg-muted/20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !addresses || addresses.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-border rounded-lg bg-muted/10">
            <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-foreground font-medium mb-1">No addresses found</p>
            <p className="text-sm text-muted-foreground mb-4">Add a delivery address to proceed with your order.</p>
            <Button 
              type="button" 
              onClick={() => router.push("/account/address?redirect=/checkout")}
            >
              Create New Address
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {addresses.map((address) => (
              <div 
                key={address.id}
                onClick={() => setSelectedAddressId(address.id)}
                className={`relative p-5 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedAddressId === address.id 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-border/60 hover:border-primary/50 bg-card hover:bg-muted/20"
                }`}
              >
                {selectedAddressId === address.id && (
                  <div className="absolute top-4 right-4 text-primary">
                    <CheckCircle2 className="h-5 w-5 fill-primary text-primary-foreground" />
                  </div>
                )}
                <div className="pr-8">
                  <p className="font-semibold text-foreground mb-1">
                    {address.firstName} {address.lastName}
                    {address.isDefault && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground">Default</span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {address.addressLine1}
                    {address.addressLine2 && <>, {address.addressLine2}</>}
                    <br />
                    {address.city}, {address.state} {address.pincode}
                    <br />
                    <span className="text-foreground/80 mt-1 block">📞 +91 {address.phone}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-14 text-lg mt-8 rounded-full shadow-md"
          disabled={isSubmitting || !isAcceptingOrders || !addresses || addresses.length === 0 || !selectedAddressId}
        >
          {!isAcceptingOrders ? (
            "Ordering Paused"
          ) : isSubmitting ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
          ) : paymentMethod === "COD" ? (
            "Request Cash on Delivery"
          ) : (
            "Proceed to Secure Payment"
          )}
        </Button>
      </form>
    </div>
  );
}