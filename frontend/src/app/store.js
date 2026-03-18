import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Auth/authSlice";
import productreducer from "../features/Products/Productsslice";
import Cartreducer from "../features/Cart/cartSlice";
import orderReducer from "../features/Orders/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productreducer,
    cart: Cartreducer,
    orders: orderReducer,
  },
});

store.subscribe(() => {
  const { cart } = store.getState();
  localStorage.setItem("cart", JSON.stringify(cart));
});
