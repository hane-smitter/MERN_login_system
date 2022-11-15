import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: {}, token: "" };

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
  },
});

export const { todoAdded, todoToggled, todosLoading } = authSlice.actions;

export default authSlice.reducer;
