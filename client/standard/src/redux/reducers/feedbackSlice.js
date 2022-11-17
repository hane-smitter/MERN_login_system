import { createSlice } from "@reduxjs/toolkit";

function typeOfStatusCode(statusCode) {
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
  type: "", // success | error | info
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    newFeedBack(state, action) {
      const { payload } = action;
      // ✅ "mutating" state is okay inside of createSlice!
      state.open = Boolean(payload?.msg);
      state.msg = payload?.msg;
      state.type =
        typeof payload?.type === "number"
          ? typeOfStatusCode(payload?.type)
          : payload?.type;
    },
    closeFeedback(state) {
      state.open = false;
    },
  },
});

export const { newFeedBack, closeFeedback } = feedbackSlice.actions;

export default feedbackSlice.reducer;
