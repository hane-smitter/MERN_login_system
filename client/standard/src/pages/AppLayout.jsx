import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { useSelector } from "react-redux";

import NavBar from "../components/Navbar/Navbar";
import AppNotification from "../utils/appNotification";
import { AuthenticationContext } from "../context/authenticationContext";
import { authStorage } from "../utils/browserStorage";

function AppLayout() {
  const { token: hasToken } = useSelector((state) => state.auth);
  const userIsAuthenticated = Boolean(hasToken) || authStorage.isAuthenticated;

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
