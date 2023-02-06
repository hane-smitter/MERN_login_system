import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { useSelector } from "react-redux";

import NavBar from "../components/Navbar";
import AppNotification from "../utils/appNotification";
import { AuthenticationContext } from "../context/authenticationContext";
import useLocalStorage from "../hooks/useLocalStorage";
// import { authStorage } from "../utils/browserStorage";

function AppLayout() {
  const hasToken = useSelector((state) => state.auth?.token);
  const authStorage = useLocalStorage((storage) => storage.authStorage);
  const userIsAuthenticated = Boolean(hasToken) || authStorage?.isAuthenticated;

  console.log(
    "User is Authenticated:: %s -- %s",
    Boolean(hasToken),
    authStorage?.isAuthenticated
  );

  return (
    <AuthenticationContext.Provider value={{ userIsAuthenticated }}>
      <Container fluid="md">
        <NavBar />
        {/* Component that reports to user Errors encountered */}
        <AppNotification />
        <Outlet />
      </Container>
    </AuthenticationContext.Provider>
  );
}

export default AppLayout;
