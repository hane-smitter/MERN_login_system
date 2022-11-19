import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Home from "../components/Home/Home";
import PrivateRoute from "../components/PrivateRoute";
import Profile from "../components/Profile/Profile";
import PublicRoute from "../components/PublicRoute";
import AppLayout from "../pages/AppLayout";
import Login from "../pages/LoginForm";
import Lost from "../pages/Lost";
import Signup from "../pages/SignupForm";

const router = createBrowserRouter([
  {
    path: "",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <PublicRoute />,
        children: [
          { path: "", element: <Home /> },
          { path: "/login", element: <Login /> },
          { path: "/signup", element: <Signup /> },
        ],
      },
      {
        path: "/home",
        element: <PrivateRoute />,
        children: [
          { path: "", element: <Dashboard /> },
          { path: "profile", element: <Profile /> },
        ],
      },
      {
        path: "*",
        element: <Lost />
      }
    ],
  },
]);

export { router };
