import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthenticationContext } from "../../../context/authenticationContext";

const PublicRouteGuard = () => {
  const location = useLocation();
  const { userIsAuthenticated } = useContext(AuthenticationContext);

  const origin = location?.state?.comingFrom;
  const targetPath = origin
    ? `${origin?.pathname}${origin?.search}`
    : "/dash";

  if (userIsAuthenticated) {
    return <Navigate to={targetPath} />;
  }
  return <Outlet />;
};

export default PublicRouteGuard;
