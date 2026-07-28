import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isSyncing: boolean;
  lastSynced: string | null;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  isSyncing: false,
  lastSynced: null,
};

// Global max quantity limit per product
const MAX_QUANTITY = 5;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { productId, size, color, quantity } = action.payload;

      const existingItem = state.items.find(
        (item) =>
          item.productId === productId &&
          item.size === size &&
          item.color === color
      );

      if (existingItem) {
        // Safe increment, capped at MAX_QUANTITY (5)
        existingItem.quantity = Math.min(
          MAX_QUANTITY,
          existingItem.quantity + quantity
        );
      } else {
        // Enforce cap on initial add as well
        state.items.push({
          ...action.payload,
          quantity: Math.min(MAX_QUANTITY, quantity),
        });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    removeItemFromCart: (
      state,
      action: PayloadAction<{ productId: string; size: string; color: string }>
    ) => {
      const { productId, size, color } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.size === size &&
            item.color === color
          )
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      // Enforce the 5-item hard cap on updates
      if (
        item &&
        action.payload.quantity > 0 &&
        action.payload.quantity <= MAX_QUANTITY
      ) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload;
    },
    setLastSynced: (state, action: PayloadAction<string>) => {
      state.lastSynced = action.payload;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  removeItemFromCart,
  updateQuantity,
  clearCart,
  hydrateCart,
  setSyncing,
  setLastSynced,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
