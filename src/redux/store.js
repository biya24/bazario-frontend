import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice"; // ✅ Import cart reducer
import wishlistReducer from "./wishlistSlice";

const store = configureStore({
    reducer: {
        cart: cartReducer, 
        wishlist: wishlistReducer,
    },
});

export default store;
