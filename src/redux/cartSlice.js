import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: localStorage.getItem("cartItems") 
        ? JSON.parse(localStorage.getItem("cartItems")) 
        : [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existingItem = state.cartItems.find((cartItem) => cartItem._id === item._id);
            

            if (existingItem) {
                existingItem.quantity += item.quantity; // ✅ Add selected quantity
            } else {
                state.cartItems.push(item);
            }

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((item) => item._id !== action.payload);
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        updateCartQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.cartItems.find((item) => item._id === id);
            if (item && quantity > 0) {
                item.quantity = quantity;
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
    },
});

export const { addToCart, removeFromCart, updateCartQuantity } = cartSlice.actions;
export default cartSlice.reducer;
