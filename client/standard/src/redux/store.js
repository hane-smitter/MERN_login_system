import { configureStore } from "@reduxjs/toolkit";

import notifyReducer from "./features/notify/notifySlice";
import authReducer from "./features/auth/authSlice";
import authMiddleware from "./middlewares/authMiddleware";

const store = configureStore({
  reducer: {
    auth: authReducer,
    notice: notifyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
