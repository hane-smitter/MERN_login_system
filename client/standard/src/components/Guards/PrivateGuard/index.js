import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getUserProfile, refreshAccessToken } from "../../../api";
import {
  addAuthToken,
  addAuthUser,
} from "../../../redux/features/auth/authSlice";
import { authStorage } from "../../../utils/browserStorage";

const PrivateRoute = () => {
  const token = useSelector((state) => state?.auth?.token);
  const userIsAuthenticated = token || authStorage.isAuthenticated;

  const [displayPage, setDisplayPage] = useState(false);
  const here = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    // We refresh token when component is mounted 1st time and if user is authenticated, i.e has token
    // Authenticated user when refreshes browser, token in redux store is cleared
    // But user is still authenticated(should stay logged in)
    // `userIsAuthenticated` backs up redux store when it is cleared
    if (!token && userIsAuthenticated) {
      refreshAccessToken()
        .then((response) => {
          // Add the new Access token to redux store
          dispatch(addAuthToken({ token: response?.data?.accessToken }));

          return getUserProfile(); // Get user profile
        })
        .then((response) => {
          const user = response.data?.user;
          // Add authenticated user to redux store
          dispatch(addAuthUser({ user }));
        })
        .finally(() => {
          isMounted && setDisplayPage(true);
        });
    } else {
      setDisplayPage(true);
    }

    return () => (isMounted = false);
  }, []);

  if (!displayPage) {
    return "LOADING..."; // Display your loading indicator here
  }
  if (!userIsAuthenticated) {
    return <Navigate to="/login" state={{ comingFrom: here }} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
