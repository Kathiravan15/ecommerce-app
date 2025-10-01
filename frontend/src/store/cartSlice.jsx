// src/store/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Async thunk: place order by calling backend API
 * payload = { firstName, lastName, address, items }
 */
export const placeOrder = createAsyncThunk(
  'cart/placeOrder',
  async ({ firstName, lastName, address, items }, thunkAPI) => {
    try {
      const res = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, address, items })
      });
      const data = await res.json();
      if (!res.ok) {
        // return custom error
        return thunkAPI.rejectWithValue(data.error || 'Order failed');
      }
      return data; // expected { message, orderId }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || 'Network error');
    }
  }
);

const initialState = {
  items: [],            // cart items: { id, title, price, thumbnail, quantity, ... }
  placingOrder: false,
  orderResult: null,    // { message, orderId } on success
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const payload = action.payload;
      const existing = state.items.find(i => i.id === payload.id);
      if (existing) {
        existing.quantity = (existing.quantity || 0) + 1;
      } else {
        state.items.push({ ...payload, quantity: 1 });
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQty(state, action) {
      const { id, quantity } = action.payload;
      state.items = state.items.map(i => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i));
    },
    clearCart(state) {
      state.items = [];
    },
    clearOrderResult(state) {
      state.orderResult = null;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(placeOrder.pending, state => {
        state.placingOrder = true;
        state.error = null;
        state.orderResult = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingOrder = false;
        state.orderResult = action.payload; // { message, orderId }
        state.items = []; // clear cart on success
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placingOrder = false;
        state.error = action.payload || action.error.message || 'Order failed';
      });
  }
});

export const { addItem, removeItem, updateQty, clearCart, clearOrderResult } = cartSlice.actions;
export default cartSlice.reducer;
