import http from "..";
import axios from "axios";
import { refreshAccessToken } from "../../../api";
import { newFeedBack } from "../../../redux/reducers/feedbackSlice";
import { browserStorage } from "../../browserStorage";

const interceptor = (store) => {
  // Request interceptor
  http.interceptors.request.use(
    (config) => {
      if (config.requireAuthHeader) {
        const token = browserStorage.authTkn;
        config.headers.Authorization = `Bearer ${token}`;
        delete config.requireAuthHeader;
      }
      return config;
    },
    (error) => {
      logError(error, store);
      return Promise.reject(error);
    }
  );

  // We write the response interceptor inside a function
  // so that we may reference to it
  function registerResponseInterceptor() {
    // Response interceptor
    const responseInterceptor = http.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        console.log("RESPONSE INTERCEPTOR RUNNING!!");
        const config = error.config; // Ensuring this value is an Object even when it is undefined
        const errorResponse = error?.response;

        if (
          errorResponse?.status === 401 &&
          errorResponse?.headers?.get("www-authenticate")?.startsWith("Bearer ")
        ) {
          let retry = 0;

          // Detach the response interceptors temporarily
          http.interceptors.response.eject(responseInterceptor);

          try {
            // Increment the retry count of attempts to fetch this resource
            retry += 1;

            console.group("errorResponse === 401 && WWW-Authenticate Header");
            console.log("AUTO REFRESH A-T ATTEPT : ", retry);
            // console.log(config?.headers);
            console.groupEnd();

            // Get a new Access Token
            console.log("Getting A New Access Token...");

            const { data } = await refreshAccessToken();
            const newAccessToken = data?.accessToken;
            console.log(
              "NEW A-T FROM AXIOS Interceptor",
              `...${newAccessToken
                .toString()
                .substring(newAccessToken.length - 20)}`
            );
            config.headers.Authorization = `Bearer ${newAccessToken}`;

            // Attach back interceptor
            registerResponseInterceptor();

            // Fetch the Initial resource again
            return http({ ...config, headers: config.headers.toJSON() });
          } catch (reauthError) {
            // Create recursion(loop)
            // if (retry < 1) {
            //   return getNewAccessToken();
            // }

            console.log("reauthError -- ", reauthError);
            // Attach back interceptor
            registerResponseInterceptor();
            // We are rejecting with Error from initial Request
            // return Promise.reject(error);
            logError(error, store);
            return Promise.reject(error);
          }

          // await getNewAccessToken();
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

    // Trigger Feedback alert in the application
    store?.dispatch(
      newFeedBack({
        type: error.response.status,
        msg: error.response.data?.feedback,
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
