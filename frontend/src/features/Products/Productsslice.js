import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import productsservice from "./Productsservice";

const initialState = {
  products: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const productslist = createAsyncThunk(
  "products/list",
  async (thunkAPI) => {
    try {
      return await productsservice.productsfunct();
    } catch (error) {
      const message =
        (error.response && error.respone.data && error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.rejectWithValue(message);
    }
  }
);

export const productsslice = createSlice({
  name: "products",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(productslist.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(productslist.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.products = action.payload;
    });
    builder.addCase(productslist.rejected, (state, action) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.products = null;
      state.message = action.payload;
    });
  },
});

export const { reset } = productsslice.actions;
export default productsslice.reducer;
