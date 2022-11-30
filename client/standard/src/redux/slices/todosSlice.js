import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  entities: [],
  status: null,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    todoAdded(state, action) {
      // ✅ This "mutating" code is okay inside of createSlice!
      state.entities.push(action.payload);
    },
    todoToggled(state, action) {
      const todo = state.entities.find((todo) => todo.id === action.payload);
      todo.completed = !todo.completed;
    },
    todosLoading(state, action) {
      return {
        ...state,
        status: "loading",
      };
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchTodos.pending, (state, action) => {
  //       state.status = "loading";
  //     })
  //     .addCase(fetchTodos.fulfilled, (state, action) => {
  //       const newEntities = {};
  //       action.payload.forEach((todo) => {
  //         newEntities[todo.id] = todo;
  //       });
  //       state.entities = newEntities;
  //       state.status = "idle";
  //     });
  // },
});

export const { todoAdded, todoToggled, todosLoading } = todosSlice.actions;

export default todosSlice.reducer;
