import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Auth/authSlice";
import productreducer from "../features/Products/Productsslice";
import Cartreducer from "../features/Cart/cartSlice";
import orderReducer from "../features/Orders/orderSlice";
import wishlistReducer from "../features/Wishlist/wishlistSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productreducer,
    cart: Cartreducer,
    orders: orderReducer,
    wishlist: wishlistReducer,
  },
});

store.subscribe(() => {
  const { cart, wishlist } = store.getState();
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("wishlist", JSON.stringify(wishlist.items));
});
