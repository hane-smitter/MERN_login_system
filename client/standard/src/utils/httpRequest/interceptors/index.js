import http from "..";
import { newNotify } from "../../../redux/features/notify/notifySlice";
import { authStorage } from "../../browserStorage";
import {
  addAuthToken,
  authUserLogout,
} from "../../../redux/features/auth/authSlice";
import { refreshAccessToken } from "../../../api";

const attach = (store) => {
  // REQUEST INTERCEPTOR
  http.interceptors.request.use(
    (config) => {
      if (config.requireAuthHeader) {
        const token = store?.getState()?.auth?.token || authStorage.authTkn;
        config.headers.Authorization = `Bearer ${token}`;
        delete config.requireAuthHeader;
        console.log(
          "Header attached on request: ",
          config.headers.Authorization
        );
      }
      return config;
    },
    (error) => {
      logError(error, store);
      return Promise.reject(error);
    }
  );

  // RESPONSE INTERCEPTOR
  // We write the response interceptor inside a function
  // so that we may reference to it
  function registerResponseInterceptor() {
    const responseInterceptor = http.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        console.log("---RESPONSE INTERCEPTOR RUNNING!!---");
        const config = error.config; // Ensuring this value is an Object even when it is undefined
        const responseError = error?.response;

        if (
          responseError?.status === 401 &&
          responseError?.headers?.get("www-authenticate")?.startsWith("Bearer ")
        ) {
          // Detach the response interceptors temporarily
          http.interceptors.response.eject(responseInterceptor);

          try {
            console.group("responseError === 401 && WWW-Authenticate Header");
            console.log("AUTO REFRESHING A-T..");
            // console.log(config?.headers);
            console.groupEnd();

            const oldAT = store?.getState().auth?.token;
            console.log(
              "OLD A-T FROM REDUX STORE",
              `...${oldAT?.toString()?.substring(oldAT.length - 20)}`
            );

            // Get a new Access Token
            console.log("Getting A New Access Token...");

            // store?.dispatch(authTokenLoading({ loading: true }));

            const { data } = await refreshAccessToken();
            const newAccessToken = data?.accessToken;
            console.log(
              "NEW A-T FROM AXIOS Interceptor",
              `...${newAccessToken
                .toString()
                .substring(newAccessToken.length - 20)}`
            );
            // Add newly obtained Access token to initial request
            config.headers.Authorization = `Bearer ${newAccessToken}`;

            // Add newly Obtained token to redux store
            store?.dispatch(addAuthToken({ token: newAccessToken }));
            console.log("JUST ADDED new AT to redux store!");

            // Attach back interceptor
            registerResponseInterceptor();

            // Fetch the Initial resource again
            return http({ ...config, headers: config.headers.toJSON() });
          } catch (reauthError) {
            console.log("reauthError -- ", reauthError);
            // Attach back interceptor
            registerResponseInterceptor();

            // Log with error of request before trying to get new AccessToken
            logError(error, store);

            // We are rejecting with Error from initial Request
            return Promise.reject(error);
          }
          // finally {
          //   store?.dispatch(authTokenLoading({ loading: false }));
          // }
        }

        logError(error, store);

        return Promise.reject(error);
      }
    );
  }
  registerResponseInterceptor();
};

/**
 * Axios Error Handler
 * @param {Error} error - Error object
 * @param {Object} store - Redux Store
 */
function logError(error, store) {
  // Request made and server responded with error
  if (error.response) {
    const { error: respMessage, feedback: respFeedback } = error.response.data;
    const DEFAULTMSG = "Something's not right. Try again later.";
    let notificationMsg = respFeedback || respMessage || DEFAULTMSG;

    if (error.response.status === 401) {
      notificationMsg = "You need to Log In";

      // Fire redux store logout action
      store?.dispatch(authUserLogout());
    }

    // Trigger notification alert in the application
    store?.dispatch(
      newNotify({
        variant: error.response.status,
        msg: notificationMsg,
      })
    );
  }
  // The request was made but no response was received
  else if (error.request) {
    if (error?.code === "ERR_NETWORK") window.NetworkError = error?.code;

    store?.dispatch(
      newNotify({
        variant: "danger",
        msg: error.message,
      })
    );
  }
  // Something happened in setting up the request that triggered an Error
  else {
    store?.dispatch(
      newNotify({
        variant: "danger",
        msg: "Oops! An Error Occured!",
      })
    );
  }
}

const interceptors = { attach };

export default interceptors;
