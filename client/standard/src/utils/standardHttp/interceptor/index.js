import http from "..";
import { refreshAccessToken } from "../../../api";
import { newFeedBack } from "../../../redux/reducers/feedbackSlice";
import { browserStorage } from "../../browserStorage";

const interceptor = (store) => {
  // Request interceptor
  http.interceptors.request.use(
    (config) => {
      console.log("config in request Interceptor : ", config);
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

  // Response interceptor
  http.interceptors.response.use(
    (response) => {
      // console.group("success happend");
      // console.log(response);
      // console.groupEnd();
      // const feedbackInfo = response?.data?.status?.info;
      // const feedback = feedbackInfo?.message;
      // const feedbackSeverity = feedbackInfo?.severity;
      // Boolean(feedback) &&
      //   NotificationService.notify(feedback, feedbackSeverity);
      return response;
    },
    async (error) => {
      const config = new Object(error.config); // Ensuring this value is an Object even when it is undefined
      const errorResponse = error?.response;
      const numberOfRetries = config?.__retryCount || 0;

      config.__retryCount = numberOfRetries;
      console.log("numberOfRetries: ", config?.__retryCount);

      if (numberOfRetries >= 3) {
        return Promise.reject(error);
      }

      // console.log(
      //   "WWW-Authenticate",
      //   error?.response?.headers?.get("www-authenticate")
      // );
      // console.log("WWW-Authenticate tst", error?.response);

      // Retrieve a new access Token if UNAUTHORIZED error(401) and `WWW-Authenticate` header
      // is included
      if (
        errorResponse?.status === 401 &&
        errorResponse?.headers?.get("www-authenticate")?.startsWith("Bearer ")
      ) {
        console.group("errorResponse === 401 && WWW-Authenticate Header");
        console.log(config?.headers);
        console.groupEnd();
        try {
          // Get a new Access Token
          const { data } = await refreshAccessToken();
          const newAccessToken = data?.status?.payload?.token;
          console.log(
            "NEW AT FROM AXIOS Interceptor",
            `...${newAccessToken
              .toString()
              .substring(newAccessToken.length - 20)}`
          );
          config.headers.Authorization = `Bearer ${newAccessToken}`;

          // Increment the retry count of attempts to fetch this resource
          config.__retryCount += 1;
          // Fetch resource again
          return http(config);
        } catch (error) {
          return Promise.reject(error);
        }
      }

      logError(error, store);

      return Promise.reject(error);
    }
  );
};

/**
 * Axios Error Handler
 * @param {Object} store - Redux Store
 * @param {Error} error - Error object
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
        msg: error.message,
      })
    );
  }
}

export default { interceptor };
