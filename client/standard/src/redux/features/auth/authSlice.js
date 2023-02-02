import { createSlice } from "@reduxjs/toolkit";

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

// Export actions as named exports
export const {
  addAuthToken,
  addAuthUser,
  authUserLoading,
  authTokenLoading,
  authUserLogout,
} = authSlice.actions;

// Export reducer as default export
export default authSlice.reducer;
