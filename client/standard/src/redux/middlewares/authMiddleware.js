import { authStorage } from "../../utils/browserStorage";
import { authUserLogout } from "../features/auth/authSlice";

const authMiddleware = (storeAPI) => (next) => (action) => {
  if (action.type === authUserLogout().type) {
    authStorage.logout();
  }
  return next(action);
};

export default authMiddleware;
