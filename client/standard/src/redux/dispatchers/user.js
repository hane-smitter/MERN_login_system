import * as API from "../../api";
import { addAuthUser, authUserLoading } from "../slices/authSlice";

export function getUserProfile() {

  return async function (dispatch) {
    try {
      dispatch(authUserLoading({ loading: true }));
      const response = await API.getUserProfile();

      const user = response.data?.user;
      dispatch(addAuthUser({ user }));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(authUserLoading({ loading: false }));
    }
  };
}
