// import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, refreshAccessToken } from "../../api";
import { todoAdded, todosLoading } from "../reducers/todosSlice";
import store from "../store";

export function demo() {
  return async function () {
    const response = await login();

    console.log("Demmo action after fired!!");
  };
}

export function updateTodo(data) {
  return async function (dispatch) {
    store.dispatch(todosLoading());

    const response = `await client.post("/fakeApi/todos", { data })`;

    store.dispatch(todoAdded(response));
  };
  //   return createAsyncThunk("todoToggled", async () => {
  //     const response = await client.post("/fakeApi/todos", { data });
  //     return response.todos;
  //   });
}
