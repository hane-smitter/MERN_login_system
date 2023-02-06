import { configureStore } from "@reduxjs/toolkit";

import notifyReducer from "./features/notify/notifySlice";
import authReducer from "./features/auth/authSlice";
import { authStorage } from "../utils/browserStorage";
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

function statePersistor() {
  const state = store.getState();
  // Custom property on window when axios encounters network error
  // when making http request
  if (window.NetworkError) return delete window.NetworkError;

  const userAuthToken = state?.auth?.token;
  // Persist auth token in browser storage API
  authStorage.authTkn = userAuthToken;
}

window.addEventListener("beforeunload", statePersistor);

export default store;
