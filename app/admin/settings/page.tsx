"use client";

import { useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Save,
  AlertCircle,
  Store,
  CreditCard,
  Truck,
  Loader2,
  Landmark,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "@/lib/store/apis/store-settings-api";

const numberString = (label: string, max?: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .refine((val) => !Number.isNaN(Number(val)), `${label} must be a valid number`)
    .refine((val) => Number(val) >= 0, `${label} cannot be negative`)
    .refine((val) => (max !== undefined ? Number(val) <= max : true), {
      message: `${label} must be at most ${max}`,
    });

const settingsSchema = z.object({
  isAcceptingOrders: z.boolean(),
  freeShippingThreshold: numberString("Free shipping threshold"),
  shippingCost: numberString("Shipping cost"),
  taxRate: numberString("Tax rate", 100),
  isTaxInclusive: z.boolean(),
  isCodEnabled: z.boolean(),
  codFee: numberString("COD fee"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

type NumericFieldProps = {
  name: keyof Pick<
    SettingsFormValues,
    "freeShippingThreshold" | "shippingCost" | "taxRate" | "codFee"
  >;
  label: string;
  placeholder: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
  control: any;
};

function NumericField({
  name,
  label,
  placeholder,
  hint,
  prefix,
  suffix,
  error,
  control,
}: NumericFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">{label}</label>

      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}

        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder={placeholder}
              value={field.value ?? ""}
              onChange={(e) => {
                const raw = e.target.value;
                if (/^\d*\.?\d*$/.test(raw)) {
                  field.onChange(raw);
                }
              }}
              className={[
                prefix ? "pl-8" : "",
                suffix ? "pr-8" : "",
                error ? "border-red-500 focus-visible:ring-red-500" : "",
              ].join(" ")}
            />
          )}
        />

        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>

      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && <p className="text-[0.8rem] font-medium text-destructive">{error}</p>}
    </div>
  );
}

export default function StoreSettingsPage() {
  const { data: settings, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      isAcceptingOrders: true,
      freeShippingThreshold: "5000",
      shippingCost: "200",
      taxRate: "18",
      isTaxInclusive: true,
      isCodEnabled: false,
      codFee: "100",
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        isAcceptingOrders: settings.isAcceptingOrders,
        freeShippingThreshold: String(settings.freeShippingThreshold ?? ""),
        shippingCost: String(settings.shippingCost ?? ""),
        taxRate: String((settings.taxRate ?? 0) * 100),
        isTaxInclusive: settings.isTaxInclusive,
        isCodEnabled: settings.isCodEnabled ?? false,
        codFee: String(settings.codFee ?? ""),
      });
    }
  }, [settings, reset]);

  const onSubmit: SubmitHandler<SettingsFormValues> = async (data) => {
    try {
      const formattedData = {
        isAcceptingOrders: data.isAcceptingOrders,
        freeShippingThreshold: Number(data.freeShippingThreshold),
        shippingCost: Number(data.shippingCost),
        taxRate: Number(data.taxRate) / 100,
        isTaxInclusive: data.isTaxInclusive,
        isCodEnabled: data.isCodEnabled,
        codFee: Number(data.codFee),
      };

      await updateSettings(formattedData).unwrap();
      toast.success("Store configuration updated successfully.");
    } catch {
      toast.error("Failed to save store configurations.");
    }
  };

  const isAcceptingOrders = watch("isAcceptingOrders");
  const isCodEnabled = watch("isCodEnabled");

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-primary font-bold tracking-tight">
          Store Configuration
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage checkout rules, shipping, taxes, and payment methods.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
            <Store className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Store Status</h2>
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border border-border/50 p-4 shadow-sm">
            <div className="space-y-0.5 pr-4">
              <label className="text-base font-semibold">Accept Checkout Orders</label>
              <p className="text-sm text-muted-foreground">
                Turn this off to pause all customer checkout activity temporarily.
              </p>
            </div>

            <Controller
              name="isAcceptingOrders"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>

          {!isAcceptingOrders && (
            <div className="mt-4 flex gap-2 items-center text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
              <AlertCircle className="h-4 w-4" />
              <span>Checkout will be blocked for customers until re-enabled.</span>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
            <Landmark className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Cash on Delivery</h2>
          </div>

          <div className="space-y-6">
            <div className="flex flex-row items-center justify-between rounded-lg border border-border/50 p-4 shadow-sm">
              <div className="space-y-0.5 pr-4">
                <label className="text-base font-semibold">Enable Cash on Delivery</label>
                <p className="text-sm text-muted-foreground">
                  Allow customers to place orders with COD at checkout.
                </p>
              </div>

              <Controller
                name="isCodEnabled"
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>

            <div
              className={`grid grid-cols-1 gap-6 transition-all ${
                isCodEnabled ? "opacity-100" : "opacity-60 pointer-events-none"
              }`}
            >
              <div className="max-w-md">
                <NumericField
                  name="codFee"
                  label="COD Fee"
                  placeholder="100"
                  prefix="₹"
                  hint="Extra charge applied only to COD orders."
                  error={errors.codFee?.message}
                  control={control}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Taxes & Pricing</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <NumericField
              name="taxRate"
              label="Default GST Rate"
              placeholder="18"
              suffix="%"
              hint="Standard GST percentage applied to products."
              error={errors.taxRate?.message}
              control={control}
            />

            <div className="flex flex-col justify-center pt-2">
              <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                <div className="space-y-0.5 pr-4">
                  <label className="text-sm font-medium leading-none">
                    Prices Include GST
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Turn off to add GST separately during checkout.
                  </p>
                </div>

                <Controller
                  name="isTaxInclusive"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
            <Truck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Shipping</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <NumericField
              name="shippingCost"
              label="Standard Delivery Fee"
              placeholder="200"
              prefix="₹"
              hint="Applied to orders below the free shipping threshold."
              error={errors.shippingCost?.message}
              control={control}
            />

            <NumericField
              name="freeShippingThreshold"
              label="Free Shipping Threshold"
              placeholder="5000"
              prefix="₹"
              hint="Orders at or above this amount ship free."
              error={errors.freeShippingThreshold?.message}
              control={control}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={isUpdating || !isDirty}
            className="gap-2 px-8"
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}