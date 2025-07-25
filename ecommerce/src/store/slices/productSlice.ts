// store/productSlice.ts 

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
};

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],

  loading: false,
  error: null,
};

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk('product/fetchProducts', async () => {
  const response = await fetch('http://localhost:5001/api/product/get');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  return data;
});

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});



export default productSlice.reducer;



