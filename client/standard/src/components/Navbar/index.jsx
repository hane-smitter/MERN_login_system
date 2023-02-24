import { useContext } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logout, logoutEveryDevice } from "../../redux/actions";
import { AuthenticationContext } from "../../context/authenticationContext";
import { closeNotify } from "../../redux/features/notify/notifySlice";

function NavBar() {
  const dispatch = useDispatch();
  const { userIsAuthenticated } = useContext(AuthenticationContext);

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="light"
      variant="light"
      className="px-2 mb-2 justify-content-between"
    >
      <Navbar.Brand as={Link} to="/" tabIndex="1" rel="opener">
        Capital
      </Navbar.Brand>
      {userIsAuthenticated ? (
        <>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown
                title="My Account"
                id="collasible-nav-dropdown"
                tabIndex="1"
              >
                <NavDropdown.Item as={Link} to="/dash/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
              </NavDropdown>

              <Nav.Link href="#sth" tabIndex="1">
                Something here
              </Nav.Link>

              <hr />
              <NavDropdown
                title="Security"
                id="collasible-nav-dropdown-2"
                tabIndex="1"
              >
                <Button
                  as={NavDropdown.Item}
                  onClick={() => {
                    dispatch(closeNotify());
                    dispatch(logoutEveryDevice());
                  }}
                >
                  Log Out From All Devices
                </Button>
              </NavDropdown>

              <Button
                as={Nav.Item}
                onClick={() => {
                  dispatch(closeNotify());
                  dispatch(logout());
                }}
                tabIndex="1"
              >
                Log Out
              </Button>
            </Nav>
          </Navbar.Collapse>
        </>
      ) : (
        <Button
          as={Link}
          to="/login"
          className="text-uppercase fw-bolder"
          variant="outline-dark"
          tabIndex="1"
        >
          Sign in
        </Button>
      )}
    </Navbar>
  );
}

export default NavBar;
