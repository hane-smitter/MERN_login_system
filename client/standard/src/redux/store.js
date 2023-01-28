import { configureStore } from "@reduxjs/toolkit";

import notifyReducer from "./features/notify/notifySlice";
import authReducer from "./features/auth/authSlice";
import { authStorage } from "../utils/browserStorage";

const store = configureStore({
  reducer: {
    auth: authReducer,
    notice: notifyReducer,
  },
});

function persistState(state) {
  // Custom property on window when network error occurs
  // when making http request
  if (window.NetworkError) return delete window.NetworkError;

  const userAuthToken = state?.auth?.token;
  // Persist auth token in browser storage API
  authStorage.authTkn = userAuthToken;
}

window.addEventListener("beforeunload", () => persistState(store.getState()));

export default store;
