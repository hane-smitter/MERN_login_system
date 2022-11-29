import jwt_decode from "jwt-decode";
import * as API from "../../api";
import {
  addAuthUser,
  addAuthToken,
  authTokenLoading,
  authUserLoading,
  authUserLogout,
} from "../reducers/authSlice";
import { newFeedBack } from "../reducers/feedbackSlice";

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

export function forgotPassword(data) {
  return async function (dispatch) {
    try {
      dispatch(authUserLoading({ loading: true }));
      const response = await API.forgotpass(data);
      dispatch(
        newFeedBack({
          msg: "Your Password reset was successfully initiated. Please check your inbox for further instructions",
        })
      );
    } catch (error) {
      dispatch(
        newFeedBack({
          msg: "Oops! We couldn't initiate a password reset at this time. Please try again later",
        })
      );
      console.log("Aha! We hit a block: ", error);
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
        newFeedBack({
          msg: "Your Password has been changed successfuly. Proceed to login with your new password",
          type: "success",
        })
      );
    } catch (error) {
      console.log("Aha! We hit a block: ", error);
    } finally {
      dispatch(authUserLoading({ loading: false }));
    }
  };
}
