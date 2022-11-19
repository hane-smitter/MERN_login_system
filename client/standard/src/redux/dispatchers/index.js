import jwt_decode from "jwt-decode";
import * as API from "../../api";
import {
  addAuthUser,
  addAuthToken,
  authTokenLoading,
  authUserLoading,
} from "../reducers/authSlice";

export function login(data) {
  return async function (dispatch) {
    try {
      dispatch(authUserLoading({ loading: true }));
      const response = await API.login(data);

      const user = jwt_decode(response.data?.accessToken);
      dispatch(addAuthUser(user));
      dispatch(addAuthToken({ token: response.data?.accessToken }));

      console.log("---LOGIN SUCCESS---: ", response.data);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(authUserLoading({ loading: false }));
    }
  };
}

export function signup(data) {
  return async function (dispatch) {
    try {
      dispatch(authUserLoading({ loading: true }));
      const response = await API.signup(data);

      const user = jwt_decode(response.data?.accessToken);
      dispatch(addAuthUser(user));
      dispatch(addAuthToken({ token: response.data?.accessToken }));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(authUserLoading({ loading: false }));
    }
  };
}

export function refreshAccessToken() {
  return async function (dispatch) {
    try {
      dispatch(authTokenLoading({ loading: true }));
      const response = await API.refreshAccessToken();
      console.log(response.data);

      dispatch(addAuthToken({ token: response.data?.accessToken }));
    } catch (error) {
      if (error?.code === "ERR_CANCELED") {
        console.log("error.code: ", error?.code);
        console.log("Request canceled:: ", error.message);
      } else {
        console.log(error);
      }
    } finally {
      dispatch(authTokenLoading({ loading: false }));
    }
  };
}
