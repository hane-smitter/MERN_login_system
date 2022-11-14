import { configureStore } from "@reduxjs/toolkit";

import todosReducer from "./reducers/todosSlice";
// import filtersReducer from "./features/filters/filtersSlice";

const store = configureStore({
  reducer: {
    // Define a top-level state field named `todos`, handled by `todosReducer`
    todos: todosReducer,
    // filters: filtersReducer,
  },
});

export default store;
