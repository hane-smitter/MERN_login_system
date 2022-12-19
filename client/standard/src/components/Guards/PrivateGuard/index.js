import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, refreshAccessToken } from "../../../api";
import { addAuthToken, addAuthUser } from "../../../redux/slices/authSlice";

// import { refreshAccessToken } from "../../../redux/dispatchers";

const PrivateRoute = () => {
  const [viewPage, setViewPage] = useState(false);
  const {
    user,
    token,
    token_loading: tknLoading,
  } = useSelector((state) => state?.auth);

  const location = useLocation();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   console.log("Considering to dispatch...");
  //   if (!Object.keys(user).length) {
  //     console.log("Dispatching in privateguard");
  //     dispatch(refreshAccessToken());
  //   }
  //   setViewPage(true);
  // }, []);

  useEffect(() => {
    if (!Object.keys(Object(user)).length) {
      refreshAccessToken()
        .then((response) => {
          console.log("RESPONSE IN PRIVATE GUARD:: ", response);
          // Add the new Access token to redux store
          dispatch(addAuthToken({ token: response?.data?.accessToken }));
          return getUserProfile();
        })
        .then((response) => {
          const user = response.data?.user;
          dispatch(addAuthUser({ user }));
        })
        .finally(() => {
          setViewPage(true);
        });
    } else {
      setViewPage(true);
    }
  }, []);

  console.log("token loading: %s viewPage: %s", tknLoading, !viewPage);

  if (!viewPage) {
    console.log("If token loading rum=nning");
    console.log("Viepage is:: ", viewPage);
    return "LOADING...";
  }

  if (!Object.keys(Object(user)).length) {
    console.log("If user object is set running and its value: ", user);
    return <Navigate to="/login" state={{ comingFrom: location }} />;
  }
  return <Outlet />;
};

export default PrivateRoute;
