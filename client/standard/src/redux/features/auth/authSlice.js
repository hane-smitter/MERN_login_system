import { createSlice } from "@reduxjs/toolkit";

import { authStorage } from "../../../utils/browserStorage";

// We shall create TWO loading indicators:
//  - One when `user` info is being processed [e.g Login, Sign up]
//  - Two when `token` info is being processed [e.g refreshing auth]
const initialState = {
  user: null,
  token: undefined,
  user_loading: false,
  token_loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addAuthToken(state, action) {
      // ✅ This "mutating" code is okay inside of createSlice!
      const { payload } = action;
      state.token = payload?.token;
    },
    addAuthUser(state, action) {
      const { payload } = action;
      return {
        ...state,
        user: { ...state.user, ...payload.user },
      };
    },
    authUserLoading(state, action) {
      const { payload } = action;
      // Object.assign(state.loading, payload?.loading);
      // state.loading = Boolean(payload?.loading);
      return {
        ...state,
        user_loading: Boolean(payload?.loading),
      };
    },
    authUserLogout() {
      authStorage.logout(); // Clearing info stored in browser storage API
      return {
        user: null,
        token: undefined,
        user_loading: false,
        token_loading: false,
      };
    },
    authTokenLoading(state, action) {
      const { payload } = action;
      return {
        ...state,
        token_loading: Boolean(payload?.loading),
      };
    },
  },
});

export const {
  addAuthToken,
  addAuthUser,
  authUserLoading,
  authTokenLoading,
  authUserLogout,
} = authSlice.actions;

export default authSlice.reducer;
