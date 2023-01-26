import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { authStorage } from "../../../utils/browserStorage";

const PublicRoute = () => {
  const userIsAuthenticated =
    useSelector((state) => state?.auth?.token) || authStorage.isAuthenticated;
  const location = useLocation();

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
