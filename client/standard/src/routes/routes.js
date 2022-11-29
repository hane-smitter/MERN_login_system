import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Home from "../components/Home/Home";
import PrivateRoute from "../components/Guards/PrivateGuard";
import PublicRoute from "../components/Guards/PublicGuard";
import Profile from "../components/Profile/Profile";
import AppLayout from "../pages/AppLayout";
import Login from "../pages/LoginForm";
import Lost from "../pages/Lost";
import Signup from "../pages/SignupForm";
import ForgotPass from "../pages/ForgotPassForm";

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
          { path: "/recoverpass", element: <ForgotPass /> },
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
