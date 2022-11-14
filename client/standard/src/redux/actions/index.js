import { createAsyncThunk } from "@reduxjs/toolkit";
import { todoAdded, todosLoading } from "../reducers/todosSlice";
import store from "../store";

export async function updateTodo(data) {
//   return createAsyncThunk("todoToggled", async () => {
//     const response = await client.post("/fakeApi/todos", { data });
//     return response.todos;
//   });

store.dispatch(todosLoading());

const response = await client.post("/fakeApi/todos", { data });

store.dispatch(todoAdded(response))
}
