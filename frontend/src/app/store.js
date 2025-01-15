import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Auth/authSlice";
import productreducer from "../features/Products/Productsslice";
import Cartreducer from "../features/Cart/Cartslice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productreducer,
    cart: Cartreducer,
  },
});
