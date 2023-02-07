import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: undefined,
  user_loading: false, // `user` info is being processed [e.g Login]
  token_loading: false, // when `token` info is being processed [e.g refreshing auth]
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addAuthToken(state, action) {
      const { payload } = action;
      return {
        ...state,
        token: payload?.token,
      };
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
      return {
        ...state,
        user_loading: Boolean(payload?.loading),
      };
    },
    authUserLogout() {
      return {
        ...initialState,
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

// Export action creators as named exports
export const {
  addAuthToken,
  addAuthUser,
  authUserLoading,
  authTokenLoading,
  authUserLogout,
} = authSlice.actions;

// Export reducer as default export
export default authSlice.reducer;
