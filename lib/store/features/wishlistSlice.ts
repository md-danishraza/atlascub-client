import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;
}

const initialState: WishlistState = {
  items: [],
  isOpen: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleItem: (state, action: PayloadAction<WishlistItem>) => {
      const existingIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId
      );

      if (existingIndex >= 0) {
        // Remove if it exists
        state.items.splice(existingIndex, 1);
      } else {
        // Add if it doesn't
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },
    clearWishlist: (state) => {
      state.items = [];
    },
    // Hydration endpoint to inject LocalStorage data back into Redux on refresh
    hydrateWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
    },
    openWishlistDrawer: (state) => {
      state.isOpen = true;
    },
    closeWishlistDrawer: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  toggleItem,
  removeFromWishlist,
  clearWishlist,
  hydrateWishlist,
  openWishlistDrawer,
  closeWishlistDrawer,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
