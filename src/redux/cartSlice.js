import { createSlice } from "@reduxjs/toolkit";

// Helper function to sync with localStorage
const syncCartToLocalStorage = (cartItems) => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

const initialState = {
    cartItems: localStorage.getItem("cartItems") 
        ? JSON.parse(localStorage.getItem("cartItems")) 
        : [],
    lastCleared: null, // Optional: track when cart was last cleared
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existingItem = state.cartItems.find((cartItem) => cartItem._id === item._id);
            
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                state.cartItems.push(item);
            }

            syncCartToLocalStorage(state.cartItems);
        },

        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((item) => item._id !== action.payload);
            syncCartToLocalStorage(state.cartItems);
        },

        updateCartQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.cartItems.find((item) => item._id === id);
            if (item && quantity > 0) {
                item.quantity = quantity;
            }
            syncCartToLocalStorage(state.cartItems);
        },

        // NEW: Clear entire cart
        clearCart: (state) => {
            state.cartItems = [];
            state.lastCleared = new Date().toISOString();
            syncCartToLocalStorage(state.cartItems);
        },

        // NEW: Reset cart (optional)
        resetCart: (state) => {
            state.cartItems = [];
            state.lastCleared = null;
            localStorage.removeItem("cartItems");
        },

        // NEW: Initialize cart from storage (optional)
        initializeCart: (state) => {
            const storedItems = localStorage.getItem("cartItems");
            if (storedItems) {
                state.cartItems = JSON.parse(storedItems);
            } else {
                state.cartItems = [];
            }
        }
    },
});

// Export the new actions
export const { 
    addToCart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    resetCart,
    initializeCart
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartTotal = (state) => 
    state.cart.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartItemCount = (state) => 
    state.cart.cartItems.reduce((count, item) => count + item.quantity, 0);
export const selectLastCleared = (state) => state.cart.lastCleared;

export default cartSlice.reducer;