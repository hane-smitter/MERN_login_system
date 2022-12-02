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

  if (Object.keys(Object(user)).length > 0) {
    console.log("User length > 0: ", user);
    return <Navigate to={GOTO} state={{ comingFrom: location }} />;
  }
  return <Outlet />;
};

export default PublicRoute;
