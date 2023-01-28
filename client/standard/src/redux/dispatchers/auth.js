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

      const { accessToken } = response.data;

      // dispatch(addAuthUser({ user: response.data?.user }));
      // const user = jwt_decode(response.data?.accessToken);
      // dispatch(addAuthUser({ user }));
      // dispatch(addAuthToken({ token: response.data?.accessToken }));

      // Add the retrieved Access Token before loading user profile
      dispatch(addAuthToken({ token: accessToken }));

      // Load the user profile (will use the access token in redux store)
      dispatch(getUserProfile());

      console.log("---LOGIN SUCCESS---: ", response.data);
    } catch (error) {
      console.log(error);

      // Call calback if exists
      if (callback) {
        callback(error);
      }
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

      const { accessToken } = response.data;

      // const user = jwt_decode(accessToken);
      // dispatch(addAuthUser({ user }));

      // Add the retrieved Access Token before loading user profile
      dispatch(addAuthToken({ token: accessToken }));

      // Load the user profile(will use the access token)
      dispatch(getUserProfile());
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
      const { accessToken } = response.data;

      // Add the new Access token to redux store
      dispatch(addAuthToken({ token: accessToken }));

      // Load the user Profile
      dispatch(getUserProfile());
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

export function logout() {
  return async function (dispatch) {
    try {
      const response = await API.logout();

      console.log("---LOGOUT SUCCESS---: ", response.data);
      dispatch(authUserLogout());
    } catch (error) {
      console.log(error);
    }
  };
}

export function logoutEveryDevice() {
  return async function (dispatch) {
    try {
      const response = await API.logoutEveryDevice();

      console.log("---LOGOUT FROM ALL DEVICES SUCCESS---: ", response.data);
      dispatch(authUserLogout());
    } catch (error) {
      console.log(error);
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
      // Errors handled by axios interceptors
    } finally {
      dispatch(authUserLoading({ loading: false }));
    }
  };
}

export function resetPassword(data) {
  return async function (dispatch) {
    try {
      dispatch(authUserLoading({ loading: true }));
      const response = await API.resetpass(data);
      dispatch(
        newNotify({
          msg: "Your Password has been changed successfuly. Now login with your new password.",
          variant: "success",
        })
      );
    } catch (error) {
      // Errors handled by axios interceptors
      console.log("Aha! We hit a block: ", error);
    } finally {
      dispatch(authUserLoading({ loading: false }));
    }
  };
}
