import { configureStore } from "@reduxjs/toolkit";
import myReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // ✅ Local Storage

// 🔹 Wishlist Persist Config
const wishlistPersistConfig = {
    key: "mywishlist",
    storage,
};

// 🔹 Cart Persist Config
const cartPersistConfig = {
    key: "cart",
    storage,
};


const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, myReducer);

// 🔹 Configure Store
const store = configureStore({
    reducer: {
        mycart: persistedCartReducer, // ✅ Persisted cart
        mywishlist: persistedWishlistReducer, // ✅ Persisted wishlist
    },
});

// 🔹 Persistor for Store
export const persistor = persistStore(store);

export default store;
