import http from "..";
import { refreshAccessToken } from "../../../api";

const interceptor = (store) => {
  // Request interceptor
  http.interceptors.request.use(
    (config) => {
      console.log("store.getState() : ", store.getState());
      if (config.requireAuthHeader) {
        const token = store.getState().token;
        config.headers.Authorization = `Bearer ${token}`;
        delete config.requireAuthHeader;
      }
      // if (token && !config.headers.Authorization) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  http.interceptors.response.use(
    (next) => {
      // console.group("success happend");
      // console.log(next);
      // console.groupEnd();
      // const feedbackInfo = next?.data?.status?.info;
      // const feedback = feedbackInfo?.message;
      // const feedbackSeverity = feedbackInfo?.severity;
      // Boolean(feedback) &&
      //   NotificationService.notify(feedback, feedbackSeverity);
      return next;
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

      return Promise.reject(error);
    }
  );
};

export default { interceptor };
