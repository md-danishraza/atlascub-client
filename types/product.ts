export interface Category {
  id: string;
  name: string;
  slug: string;
  gender: string;
  description?: string;
}

export interface ColorOption {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  sizes: string[];
  colors: ColorOption[];
  category: Category; // This is an object, not string
  gender: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  inStock: boolean;
  inventory: number;
  details?: string;
  sizing?: string;
  shipping?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  slug: string;
  inStock: boolean;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  slug: string;
  gender: string;
  category: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  paymentMethod: string;
  paymentId?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface FilterState {
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: "newest" | "price_asc" | "price_desc" | "popularity";
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "customer" | "admin";
  avatar?: string;
  createdAt: string;
}
