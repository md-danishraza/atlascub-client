import * as z from "zod";

const phoneRegex = /^[6-9]\d{9}$/;
const pincodeRegex = /^[1-9][0-9]{5}$/;

export const addressSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name is too long" }),

  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name is too long" }),

  email: z.string().email({ message: "Please enter a valid email address" }),

  phone: z
    .string()
    .regex(phoneRegex, {
      message: "Please enter a valid 10-digit Indian phone number",
    }),

  addressLine1: z
    .string()
    .min(5, { message: "Address is too short" })
    .max(255, { message: "Address is too long" }),

  addressLine2: z
    .string()
    .max(255, { message: "Address line 2 is too long" })
    .optional()
    .or(z.literal("")),

  city: z
    .string()
    .min(2, { message: "Please enter a valid city name" })
    .max(100, { message: "City name is too long" }),

  state: z
    .string()
    .min(2, { message: "Please enter a valid state" })
    .max(100, { message: "State name is too long" }),

  pincode: z
    .string()
    .regex(pincodeRegex, {
      message: "Please enter a valid 6-digit Indian PIN code",
    }),

  country: z.string().default("India"),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
