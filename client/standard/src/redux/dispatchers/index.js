// import { createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../../api";
import { addAuthUser, addAuthToken, authLoading } from "../reducers/authSlice";
import store from "../store";

export function login(data, cb) {
  return async function (dispatch) {
    try {
      dispatch(authLoading({ loading: true }));
      const response = await API.login(data);
      console.log({ response });
    } catch (error) {
      console.log(error);
    } finally {
      console.log("authLoading(false):: ", authLoading({ loading: false }));
      dispatch(authLoading({ loading: false }));
      if (cb) {
        cb();
      }
    }
  };
}

export function signup(data) {
  return async function (dispatch) {
    try {
      dispatch(authLoading({ loading: true }));
      const response = await API.signup(data);
      console.log({ response });
    } catch (error) {
      console.log(error);
    } finally {
      console.log("authLoading(false):: ", authLoading({ loading: false }));
      dispatch(authLoading({ loading: false }));
    }
  };
}

export function refreshAccessToken() {
  return async function () {
    try {
      const response = await API.refreshAccessToken();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
}
