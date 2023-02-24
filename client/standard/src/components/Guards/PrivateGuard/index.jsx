import React, { useEffect, useState, useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getUserProfile, refreshAccessToken } from "../../../api";
import {
  addAuthToken,
  addAuthUser,
} from "../../../redux/features/auth/authSlice";
import { AuthenticationContext } from "../../../context/authenticationContext";

let cmpntInitialized = false;
let componentIsMounted = false;

const PrivateRouteGuard = () => {
  const token = useSelector((state) => state?.auth?.token);
  const { userIsAuthenticated } = useContext(AuthenticationContext);

  const [displayPage, setDisplayPage] = useState(false);
  const here = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    componentIsMounted = true;
    console.log("Component IS initialized:)! ", cmpntInitialized);
    console.log("How many time this runs:)! ", componentIsMounted);

    // We refresh token when component is mounted 1st time and if user is authenticated, i.e has token
    // Authenticated user when refreshes browser, token in redux store is cleared
    // But user is still authenticated(should stay logged in)
    // `userIsAuthenticated` backs up redux store when it is cleared
    // Rehydrate redux store if it is missing and yet user is Authenticated
    if (!token && userIsAuthenticated) {
      console.log("No TKN on redux store yet user is AUTH");
      if (cmpntInitialized) return setDisplayPage(true);
      // To prevent double firing in react strict mode development
      console.log("So, refresh Access token!");
      cmpntInitialized = true;
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
          componentIsMounted && setDisplayPage(true);
        });
    } else {
      setDisplayPage(true);
    }

    return () => {
      componentIsMounted = false;
      console.log("CLEAN UP RAN: ", componentIsMounted);
    };
  }, []);

  if (!displayPage) {
    return "LOADING..."; // Display your loading indicator here
  }
  if (!userIsAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ comingFrom: here, reason: "NOAUTH" }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default PrivateRouteGuard;
