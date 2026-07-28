import { z } from "zod";

export const colorSchema = z.object({
  name: z.string().min(1, "Color name is required"),
  value: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
});

export const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.number().positive("Price must be greater than 0"),
  compareAtPrice: z.number().optional(),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  sizes: z.array(z.string()).min(1, "Select at least one size"),
  colors: z.array(colorSchema).min(1, "Select at least one color"),
  category: z.string().min(1, "Select a category"),
  gender: z.string().min(1, "Select a gender"),
  inventory: z.number().int().min(0, "Inventory must be 0 or more"),
  inStock: z.boolean(),
  isNew: z.boolean(),
  isBestSeller: z.boolean(),
  details: z.string().optional(),
  sizing: z.string().optional(),
  shipping: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
