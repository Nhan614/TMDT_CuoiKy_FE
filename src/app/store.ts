import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
import cartReducer from "../features/cart/cartSlice";
import artisansReducer from "../features/artisans/artisansSlice";
import orderReducer from "../features/orders/orderSlice";
import commentReducer from "../features/comment/commentSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    artisans: artisansReducer,
    orders: orderReducer,
    comments: commentReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;