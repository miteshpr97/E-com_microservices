

import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface Product {
  _id: string; // Assuming `_id` is always a string
  id?: string; // Optional as it's added dynamically
  name: string;
  price: number;
  description: string;
  image: string;
  qnty: number; // Optional as it's added dynamically
  stock: number;
}

interface CartState {
  carts: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  carts: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add to cart
    addToCart: (state: CartState, action: PayloadAction<Product>) => {
      const itemIndex = state.carts.findIndex((item) => item._id === action.payload._id);
      if (itemIndex >= 0) {
        state.carts[itemIndex].qnty! += 1; // Update quantity if item exists
      } else {
        state.carts.push({ ...action.payload, qnty: 1 }); // Add new item with qnty
      }
    },

    // Remove specific item
    removeFromCart: (state: CartState, action: PayloadAction<string>) => {
      state.carts = state.carts.filter((item) => item._id !== action.payload);
    },

    // Decrement item quantity
    decrementQuantity: (state: CartState, action: PayloadAction<string>) => {
      const itemIndex = state.carts.findIndex((item) => item._id === action.payload);

      if (itemIndex >= 0 && state.carts[itemIndex].qnty! > 1) {
        state.carts[itemIndex].qnty! -= 1;
      } else {
        state.carts = state.carts.filter((item) => item._id !== action.payload);
      }
    },

    // Update item quantity directly
    incrementQuantity: (state: CartState, action: PayloadAction<{ _id: string; qnty: number }>) => {
      const itemIndex = state.carts.findIndex((item) => item._id === action.payload._id);
      if (itemIndex >= 0) {
        state.carts[itemIndex].qnty = action.payload.qnty;
      }
    },

    // Clear cart
    clearCart: (state: CartState) => {
      state.carts = [];
    },
  },
});



export const { addToCart, removeFromCart, decrementQuantity, incrementQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
