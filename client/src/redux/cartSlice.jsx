import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cartSlice = createSlice({
    name: "mycart",
    initialState: {
        cart: [],
    },
    reducers: {
        addtoCart: (state, actions) => {
            const proData = state.cart.find(item => item.id === actions.payload.id);
            if (proData) {
                toast.error("Product is already in the cart");
            } else {
                state.cart.push(actions.payload);
                toast.success("Product added to the cart");
            }
        }
    }
});

export const { addtoCart } = cartSlice.actions;
export default cartSlice.reducer;
