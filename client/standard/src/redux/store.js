import { configureStore } from "@reduxjs/toolkit";

import todosReducer from "./reducers/todosSlice";
import feedbackSlice from "./reducers/feedbackSlice";
import authSlice from "./reducers/authSlice";
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
