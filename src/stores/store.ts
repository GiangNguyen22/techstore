import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducer/user.reducer";
import dialogReducer from "../reducer/dialog.reducer";
import cartReducer from "../reducer/cart.reducer";
import authReducer from "../reducer/auth"; // thêm dòng này

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    dialog: dialogReducer,
    auth: authReducer, // thêm dòng này
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
