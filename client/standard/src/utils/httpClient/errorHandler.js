import { authUserLogout } from "../../redux/features/auth/authSlice";
import { newNotify } from "../../redux/features/notify/notifySlice";

/**
 * Axios Error Handler
 * @param {Error} error - Error object
 * @param {Object} store - Redux Store
 */
function logError(error, store) {
  // Request made and server responded with error
  if (error.response) {
    const { error: respMessage, feedback: respFeedback } = error.response.data;
    const DEFAULTMSG = "Something's not right:( Try again later.";
    let notificationMsg = respFeedback || respMessage || DEFAULTMSG;

    if (error.response.status === 401) {
      notificationMsg = "You need to Log In";

      // Fire redux store logout action
      store?.dispatch(authUserLogout());
    }

    // Fire to the redux store with notification data
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
 export default logError;