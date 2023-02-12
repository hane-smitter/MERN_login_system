import http from "..";
import { authStorage } from "../../browserStorage";
import { addAuthToken } from "../../../redux/features/auth/authSlice";
import { refreshAccessToken } from "../../../api";
import logError from "../errorHandler";

const attach = (store) => {
  /* 1. REQUEST INTERCEPTOR */
  http.interceptors.request.use(
    (config) => {
      console.log("---REQ INTERCEPTOR running---");
      if (config.requireAuthHeader) {
        const token = store?.getState()?.auth?.token || authStorage.authTkn;
        console.log(
          "Token retrieved on REQ intercept, ",
          token.toString().substring(token.length - 20)
        );
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

  /* 2. RESPONSE INTERCEPTOR */
  // We write the response interceptor inside a function
  // so that we may reference to it
  function attachResponseInterceptor() {
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
            const MAX_RETRIES = 2;
            config._retries = Math.abs(config._retries) || 0;

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

            if (config._retries >= MAX_RETRIES)
              throw new Error(`Max retries(${config?._retries}) reached!`);

            config._retries++;
            attachResponseInterceptor();
            // Fetch the Initial resource again
            return http({ ...config, headers: config.headers.toJSON() });
          } catch (reauthError) {
            attachResponseInterceptor();
            console.log("Re Authentication Error -- ", reauthError);
          }
        }

        logError(error, store);

        return Promise.reject(error);
      }
    );
  }
  attachResponseInterceptor();
};

const interceptors = { attach };

export default interceptors;

/* Of primary importance to the success of any application is the health, or robustness, of the application. If the application is unstable or crashing intermittently, resolve these issues before placing it in a high availability environment. */
