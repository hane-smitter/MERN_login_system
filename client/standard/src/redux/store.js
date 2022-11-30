import { configureStore } from "@reduxjs/toolkit";

import todosReducer from "./slices/todosSlice";
import feedbackSlice from "./slices/feedbackSlice";
import authSlice from "./slices/authSlice";
import { browserStorage } from "../utils/browserStorage";

const store = configureStore({
  reducer: {
    todos: todosReducer,
    auth: authSlice,
    feedback: feedbackSlice,
  },
});

function persistState(state) {
  const userAuthToken = state.auth.token;
  if (userAuthToken) {
    browserStorage.setAuthTkn = userAuthToken;
  } else {
    browserStorage.deleteAuthTkn();
  }
}

store.subscribe(() => {
  persistState(store.getState());
});
export default store;
