import { configureStore } from "@reduxjs/toolkit";

import todosReducer from "./reducers/todosSlice";
import feedbackSlice from "./reducers/feedbackSlice";
import authSlice from "./reducers/authSlice";

const store = configureStore({
  reducer: {
    todos: todosReducer,
    auth: authSlice,
    feedback: feedbackSlice,
  },
});

export default store;
