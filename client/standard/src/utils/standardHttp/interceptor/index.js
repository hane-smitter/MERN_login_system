import http from "..";
import { newFeedBack } from "../../../redux/slices/feedbackSlice";
import { browserStorage } from "../../browserStorage";
import {
  addAuthToken,
  authTokenLoading,
  authUserLogout,
} from "../../../redux/slices/authSlice";
import { refreshAccessToken } from "../../../api";

const interceptor = (store) => {
  // REQUEST INTERCEPTOR
  http.interceptors.request.use(
    (config) => {
      if (config.requireAuthHeader) {
        const token = store?.getState()?.auth?.token || browserStorage.authTkn;
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
        const errorResponse = error?.response;

        if (
          errorResponse?.status === 401 &&
          errorResponse?.headers?.get("www-authenticate")?.startsWith("Bearer ")
        ) {
          // Detach the response interceptors temporarily
          http.interceptors.response.eject(responseInterceptor);

          try {
            console.group("errorResponse === 401 && WWW-Authenticate Header");
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
  if (error.response) {
    // Request made and server responded
    console.group("error.response");
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    console.groupEnd();

    let msg;
    if (error.response.status === 401) {
      msg = "You need to Log In";

      // Fire redux store logout action
      store?.dispatch(authUserLogout());
    } else {
      msg = error.response.data?.feedback;
    }

    // Trigger Feedback alert in the application
    store?.dispatch(
      newFeedBack({
        type: error.response.status,
        msg,
      })
    );
  } else if (error.request) {
    // The request was made but no response was received
    console.group("error.request");
    console.log(error);
    console.groupEnd();

    store?.dispatch(
      newFeedBack({
        msg: error.message,
        type: "danger",
      })
    );
  } else {
    // Something happened in setting up the request that triggered an Error
    console.group("Default error structure");
    console.log("Error ---> ", error);
    console.log("Error ---> ", error.message);
    console.groupEnd();

    store?.dispatch(
      newFeedBack({
        // type: "",
        msg: "Oops! An Error Occured!",
      })
    );
  }
}

export default { interceptor };
