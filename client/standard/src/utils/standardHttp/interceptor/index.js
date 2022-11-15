import http from "..";
import { refreshAccessToken } from "../../../api";
import { newFeedBack } from "../../../redux/reducers/feedbackSlice";

const interceptor = (store) => {
  // Request interceptor
  http.interceptors.request.use(
    (config) => {
      console.log("store.getState() : ", store.getState());
      if (config.requireAuthHeader) {
        const token = store.getState().auth.token;
        config.headers.Authorization = `Bearer ${token}`;
        delete config.requireAuthHeader;
      }
      return config;
    },
    (error) => {
      logError(store, error);
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
      const config = error.config;
      config.__retryCount = config.__retryCount || 0;
      console.log("__retry count", config.__retryCount);

      if (config.__retryCount >= 3) {
        return Promise.reject(error);
      }

      const errorStatus = error?.response?.status;

      // Retrieve a new access Token if UNAUTHORIZED error(401)
      if (errorStatus === 401) {
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

      logError(store, error);

      return Promise.reject(error);
    }
  );
};

/**
 * Axios Error Handler
 * @param {Object} store - Redux Store
 * @param {Error} error - Error object
 */
function logError(store, error) {
  if (error.response) {
    // Request made and server responded
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);

    // Trigger Feedback alert in the application
    store?.dispatch(
      newFeedBack({
        type: error.response.status,
        msg: error.response.data?.feedback,
      })
    );
  } else if (error.request) {
    // The request was made but no response was received
    console.log(error);

    store?.dispatch(
      newFeedBack({
        msg: error.message,
        type: "danger"
      })
    );
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error ---> ", error);
    console.log("Error ---> ", error.message);

    store?.dispatch(
      newFeedBack({
        // type: "",
        msg: error.message,
      })
    );
  }
}

export default { interceptor };
