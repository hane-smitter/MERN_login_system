import { authUserLogout } from "../features/auth/authSlice";
import { authStorage } from "../../utils/browserStorage";

const authMiddleware = (storeAPI) => (next) => (action) => {
  if (action.type === authUserLogout().type) {
    authStorage.logout();
  }
  return next(action);
};

export default authMiddleware;
