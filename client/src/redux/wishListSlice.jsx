import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WishListSlice = createSlice({
    name: "mywishlist",
    initialState: {
        items: [],
    },
    reducers: {
        addToWishlist: (state, action) => {
            const exists = state.items.find((item) => item.id === action.payload.id);
            if (exists) {
                toast.info("Product is already in the Wishlist");
            } else {
                state.items.push(action.payload);
                toast.success("Product added to the Wishlist");
            }
        },

        removeFromWishlist: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            toast.warn("Product removed from Wishlist"); // ✅ Added toast on remove
        },
        
        clearWishlist: (state) => {
            state.items = [];
        },
    },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = WishListSlice.actions;
export default WishListSlice.reducer;
