import { createSlice } from "@reduxjs/toolkit";

/**
 * Converts HTTP status code to string magnitude of contextual intensity
 * @param {number} statusCode 
 * @returns {string}
 */
function numberToStringType(statusCode) {
  if (statusCode >= 400 && statusCode <= 599) {
    return "danger";
  } else if (statusCode >= 200 && statusCode <= 299) {
    return "success";
  } else {
    return "info";
  }
}

const initialState = {
  open: false,
  msg: "",
  variant: "", // success | error | info
};

const notifySlice = createSlice({
  name: "notify",
  initialState,
  reducers: {
    newNotify(state, action) {
      const { payload } = action;
      // ✅ "mutating" state is okay inside of createSlice!
      state.open = "open" in payload ? payload?.open : Boolean(payload?.msg); // If there is a message, set open
      state.msg = payload?.msg || "";
      state.variant = Number.isInteger(payload?.variant)
        ? numberToStringType(payload?.variant)
        : payload?.variant;
    },
    closeNotify(state) {
      state.open = false;
    },
  },
});

export const { newNotify, closeNotify } = notifySlice.actions;

export default notifySlice.reducer;
