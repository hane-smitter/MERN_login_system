import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const user = useSelector((state) => state?.auth?.user);
  const location = useLocation();

  if (!Object.keys(user).length) {
    return <Navigate to="/login" state={{ comingFrom: location }} />;
  }
  return <Outlet />;
};

export default PrivateRoute;
