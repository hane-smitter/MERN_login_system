import { createBrowserRouter } from "react-router-dom";
import Home from "../components/Home/Home";
import AppLayout from "../pages/AppLayout";
import Login from "../pages/LoginForm";
import Signup from "../pages/SignupForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
    ],
  },
]);

export { router };
