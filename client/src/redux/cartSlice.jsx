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
            const data = state.cart.filter(key => key.id == actions.payload.id)
            if (data.length >= 1) {
                toast.error("Product is already in the cart");
            }
            else {
                state.cart.push(actions.payload)
                toast.success("Product added to the cart");
            }
        },
        proDelete: (state, actions) => {
            state.cart = state.cart.filter(key => key.id != actions.payload)
        },
        qntyInc: (state, actions) => {
            for (var i = 0; i < state.cart.length; i++) {
                if (state.cart[i].id == actions.payload.id) {
                    state.cart[i].qnty++;
                }
            }
        },
        qntyDec: (state, actions) => {
            for (var i = 0; i < state.cart.length; i++) {
                if (state.cart[i].id == actions.payload.id) {
                    if (state.cart[i].qnty <= 1) {
                        toast.success("Quantity can't be less than 1");
                    }
                    else {
                        state.cart[i].qnty--;
                    }

                }
            }
        },

    }
});

export const { addtoCart, proDelete, qntyInc, qntyDec } = cartSlice.actions;
export default cartSlice.reducer;

