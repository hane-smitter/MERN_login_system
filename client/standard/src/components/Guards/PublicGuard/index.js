import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const user = useSelector((state) => state?.auth?.user);
  const location = useLocation();

  const redirectedFrom = location?.state?.comingFrom;
  const GOTO = redirectedFrom
    ? `${redirectedFrom?.pathname}${redirectedFrom?.search}`
    : "/home";

  console.log("location in route guard;; ", location);

  if (Object.keys(user).length > 0) {
    return <Navigate to={GOTO} state={{ comingFrom: location }} />;
  }
  return <Outlet />;
};

export default PublicRoute;
