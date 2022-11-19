import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
import { browserStorage } from "../../utils/browserStorage";

const savedToken = browserStorage.authTkn;
let savedUser = {};
if (savedToken) {
  const { _id, fullName, email } = jwt_decode(savedToken);
  savedUser = { _id, fullName, email };
}

// We shall create TWO loading indicators:
//  - One when `user` info is being processed [e.g Login, Sign up]
//  - Two when `token` info is being processed [e.g refreshing auth]
const initialState = {
  user: savedUser,
  token: savedToken,
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
        user: { ...state.user, ...payload },
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
    authTokenLoading(state, action) {
      const { payload } = action;
      return {
        ...state,
        token_loading: Boolean(payload?.loading),
      };
    },
  },
});

export const { addAuthToken, addAuthUser, authUserLoading, authTokenLoading } =
  authSlice.actions;

export default authSlice.reducer;
