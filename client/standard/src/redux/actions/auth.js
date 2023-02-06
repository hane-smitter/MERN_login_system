import * as API from "../../api";
import {
  addAuthToken,
  authTokenLoading,
  authUserLoading,
  authUserLogout,
} from "../features/auth/authSlice";
import { newNotify } from "../features/notify/notifySlice";
import { getUserProfile } from "./user";

export function login(data, callback) {
  return async function (dispatch) {
    try {
      dispatch(authUserLoading({ loading: true }));

      const response = await API.login(data);
      const accessToken = response.data?.accessToken || response.data?.token;

      // Add the retrieved Access Token to redux store
      dispatch(addAuthToken({ token: accessToken }));
      // Load the user profile (will use the access token in redux store)
      dispatch(getUserProfile());

      console.log("---LOGIN SUCCESS---: ", response.data);
    } catch (error) {
      console.error(error);

      // Call callback if exists
      if (callback) {
        callback(error);
      }
    } finally {
      dispatch(authUserLoading({ loading: false }));
    }
  };
}

export function signup(data, callback) {
  return async function (dispatch) {
    try {
      dispatch(authUserLoading({ loading: true }));

      const response = await API.signup(data);
      const { accessToken } = response.data;

      dispatch(addAuthToken({ token: accessToken }));
      dispatch(getUserProfile());
    } catch (error) {
      console.error(error);

      // Call callback if exists
      if (callback) {
        callback(error);
      }
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
      const { accessToken } = response.data;

      dispatch(addAuthToken({ token: accessToken }));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(authTokenLoading({ loading: false }));
    }
  };
}

export function logout() {
  return async function (dispatch) {
    try {
      const response = await API.logout();

      dispatch(authUserLogout());
      console.log("---LOGOUT SUCCESS---: ", response.data);
    } catch (error) {
      console.error(error);
    }
  };
}

export function logoutEveryDevice() {
  return async function (dispatch) {
    try {
      const response = await API.logoutEveryDevice();

      dispatch(authUserLogout());
      console.log("---LOGOUT FROM ALL DEVICES SUCCESS---: ", response.data);
    } catch (error) {
      console.error(error);
    }
  };
}

export function forgotPassword(data) {
  return async function (dispatch) {
    try {
      const DEFAULTMSG =
        "Password reset has been initiated. Please check your inbox for further instructions.";

      dispatch(authUserLoading({ loading: true }));

      const response = await API.forgotpass(data);

      dispatch(
        newNotify({
          msg: response.data?.feedback || DEFAULTMSG,
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(authUserLoading({ loading: false }));
    }
  };
}

export function resetPassword(data) {
  return async function (dispatch) {
    try {
      dispatch(authUserLoading({ loading: true }));

      await API.resetpass(data);

      dispatch(
        newNotify({
          msg: "Your Password has been changed successfuly. Now login with your new password.",
          variant: "success",
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(authUserLoading({ loading: false }));
    }
  };
}
