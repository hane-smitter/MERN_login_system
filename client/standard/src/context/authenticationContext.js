import { createContext } from "react";

import store from "../redux/store";
import { authStorage } from "../utils/browserStorage";

// const hasToken = Boolean(store.getState().auth.token);
// console.log("Has token in ctx: ", hasToken);
// console.log("Has auth in state: ", store.getState().auth);
// const userIsAuthenticated = hasToken || authStorage.isAuthenticated;

export const AuthenticationContext = createContext({
  userIsAuthenticated: false,
});
