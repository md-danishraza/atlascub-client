// lib/validations/checkout-schema.ts
import * as z from "zod";

// Phone Regex: Matches standard 10-digit Indian mobile numbers starting with 6-9
const phoneRegex = /^[6-9]\d{9}$/;

// Pincode Regex: Matches standard 6-digit Indian postal codes
const pincodeRegex = /^[1-9][0-9]{5}$/;

export const checkoutSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long." })
    .max(50, { message: "First name is too long." }),

  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long." })
    .max(50, { message: "Last name is too long." }),

  email: z.string().email({ message: "Please enter a valid email address." }),

  phone: z
    .string()
    .regex(phoneRegex, {
      message: "Please enter a valid 10-digit Indian phone number.",
    }),

  addressLine1: z
    .string()
    .min(5, {
      message: "Address is too short. Please provide a detailed address.",
    })
    .max(255, { message: "Address is too long." }),

  addressLine2: z
    .string()
    .max(255, { message: "Address line 2 is too long." })
    .optional()
    .or(z.literal("")), // Allows empty string if the user skips it

  city: z
    .string()
    .min(2, { message: "Please enter a valid city name." })
    .max(100),

  state: z.string().min(2, { message: "Please select a valid state." }),

  pincode: z
    .string()
    .regex(pincodeRegex, {
      message: "Please enter a valid 6-digit Indian PIN code.",
    }),

  country: z.string().default("India"),
});

// Infer the TypeScript type directly from the Zod schema
// This guarantees our form types stay perfectly synced with our validation rules
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
