import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: {}, token: "", loading: false };

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
        ...payload,
      };
    },
    authLoading(state, action) {
      const { payload } = action;
      // Object.assign(state.loading, payload?.loading);
      // state.loading = Boolean(payload?.loading);
      return {
        ...state,
        loading: Boolean(payload?.loading),
      };
    },
  },
});

export const { addAuthToken, addAuthUser, authLoading } = authSlice.actions;

export default authSlice.reducer;
