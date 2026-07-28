"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useDeleteAddressMutation,
} from "@/lib/store/apis/account/address-api";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/lib/validations/checkout-schema";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Lakshadweep",
  "Puducherry",
];

type CheckoutInput = z.input<typeof checkoutSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="text-sm text-destructive">{message}</p>;
}

export default function AccountAddressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const { data: addresses, isLoading } = useGetAddressesQuery();
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const [isAdding, setIsAdding] = useState(false);

  const form = useForm<CheckoutInput, any, CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
  });

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    try {
      await createAddress(data).unwrap();
      toast.success("Address added successfully");

      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        setIsAdding(false);
        form.reset();
      }
    } catch {
      toast.error("Failed to add address. Please try again.");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-6">
        <SlugBreadcrumb />
      </div>

      <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-primary font-bold tracking-tight text-foreground">
            Address Book
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your delivery locations
          </p>
        </div>

        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="gap-2 rounded-full">
            <Plus className="h-4 w-4" />
            Add Address
          </Button>
        )}
      </div>

      {isAdding ? (
        <div className="animate-in fade-in rounded-xl border border-border bg-card p-6 shadow-sm">
          <button
            type="button"
            className="mb-6 flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => {
              setIsAdding(false);
              form.reset();
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Cancel & Return</span>
          </button>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Controller
                name="firstName"
                control={form.control}
                render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      ref={ref}
                      value={value as string}
                      onBlur={onBlur}
                      onChange={(e) => onChange(e.target.value)}
                      aria-invalid={!!error}
                    />
                    <FieldError message={error?.message} />
                  </div>
                )}
              />

              <Controller
                name="lastName"
                control={form.control}
                render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      ref={ref}
                      value={value as string}
                      onBlur={onBlur}
                      onChange={(e) => onChange(e.target.value)}
                      aria-invalid={!!error}
                    />
                    <FieldError message={error?.message} />
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Controller
                name="email"
                control={form.control}
                render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      ref={ref}
                      value={value as string}
                      onBlur={onBlur}
                      onChange={(e) => onChange(e.target.value)}
                      aria-invalid={!!error}
                    />
                    <FieldError message={error?.message} />
                  </div>
                )}
              />

              <Controller
                name="phone"
                control={form.control}
                render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone (10 digits)
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      ref={ref}
                      value={value as string}
                      onBlur={onBlur}
                      onChange={(e) => onChange(e.target.value)}
                      aria-invalid={!!error}
                    />
                    <FieldError message={error?.message} />
                  </div>
                )}
              />
            </div>

            <Controller
              name="addressLine1"
              control={form.control}
              render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
                <div className="space-y-2">
                  <label htmlFor="addressLine1" className="text-sm font-medium">
                    Address Line 1
                  </label>
                  <Input
                    id="addressLine1"
                    placeholder="House/Flat No., Building Name, Street"
                    ref={ref}
                    value={value as string}
                    onBlur={onBlur}
                    onChange={(e) => onChange(e.target.value)}
                    aria-invalid={!!error}
                  />
                  <FieldError message={error?.message} />
                </div>
              )}
            />

            <Controller
              name="addressLine2"
              control={form.control}
              render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
                <div className="space-y-2">
                  <label htmlFor="addressLine2" className="text-sm font-medium">
                    Address Line 2 (Optional)
                  </label>
                  <Input
                    id="addressLine2"
                    placeholder="Landmark, Locality"
                    ref={ref}
                    value={(value as string) ?? ""}
                    onBlur={onBlur}
                    onChange={(e) => onChange(e.target.value)}
                    aria-invalid={!!error}
                  />
                  <FieldError message={error?.message} />
                </div>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Controller
                name="city"
                control={form.control}
                render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium">
                      City
                    </label>
                    <Input
                      id="city"
                      placeholder="Mumbai"
                      ref={ref}
                      value={value as string}
                      onBlur={onBlur}
                      onChange={(e) => onChange(e.target.value)}
                      aria-invalid={!!error}
                    />
                    <FieldError message={error?.message} />
                  </div>
                )}
              />

              <Controller
                name="state"
                control={form.control}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <div className="space-y-2">
                    <label htmlFor="state" className="text-sm font-medium">
                      State
                    </label>
                    <Select value={(value as string) ?? ""} onValueChange={onChange}>
                      <SelectTrigger id="state" aria-invalid={!!error}>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError message={error?.message} />
                  </div>
                )}
              />

              <Controller
                name="pincode"
                control={form.control}
                render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
                  <div className="space-y-2">
                    <label htmlFor="pincode" className="text-sm font-medium">
                      PIN Code
                    </label>
                    <Input
                      id="pincode"
                      maxLength={6}
                      placeholder="400001"
                      ref={ref}
                      value={value as string}
                      onBlur={onBlur}
                      onChange={(e) => onChange(e.target.value)}
                      aria-invalid={!!error}
                    />
                    <FieldError message={error?.message} />
                  </div>
                )}
              />
            </div>

            <Button type="submit" disabled={isCreating} className="mt-8 h-12 w-full text-base">
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Address...
                </>
              ) : (
                "Save Address"
              )}
            </Button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {isLoading ? (
            <div className="col-span-2 flex justify-center rounded-xl border border-border border-dashed bg-muted/10 py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : addresses?.length === 0 ? (
            <div className="animate-in fade-in col-span-2 rounded-xl border border-border border-dashed bg-muted/10 py-16 text-center">
              <MapPin className="mx-auto mb-4 h-10 w-10 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium text-foreground">
                Your address book is empty
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add an address to breeze through checkout.
              </p>
            </div>
          ) : (
            addresses?.map((address, index) => (
              <div
                key={address.id}
                className="animate-in fade-in slide-in-from-bottom-4 relative rounded-xl border bg-card p-6 shadow-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {address.isDefault && (
                  <span className="absolute top-4 right-4 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase text-primary">
                    Default
                  </span>
                )}

                <p className="text-lg font-semibold text-foreground">
                  {address.firstName} {address.lastName}
                </p>

                <div className="mt-3 space-y-1 text-sm leading-relaxed text-muted-foreground">
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.state} {address.pincode}
                  </p>
                  <p className="pt-2 font-medium text-foreground/80">
                    📞 +91 {address.phone}
                  </p>
                  <p className="text-foreground/80">✉️ {address.email}</p>
                </div>

                <div className="mt-6 flex gap-3 border-t pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
                    onClick={async () => {
                      try {
                        await deleteAddress(address.id).unwrap();
                        toast.success("Address removed successfully");
                      } catch {
                        toast.error("Failed to remove address");
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}