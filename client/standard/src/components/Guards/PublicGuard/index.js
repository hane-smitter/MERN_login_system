import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthenticationContext } from "../../../context/authenticationContext";

const PublicRoute = () => {
  const location = useLocation();
  const { userIsAuthenticated } = useContext(AuthenticationContext);

  const originPath = location?.state?.comingFrom;
  const targetPath = originPath
    ? `${originPath?.pathname}${originPath?.search}`
    : "/home";

  if (userIsAuthenticated) {
    return <Navigate to={targetPath} />;
  }
  return <Outlet />;
};

export default PublicRoute;
