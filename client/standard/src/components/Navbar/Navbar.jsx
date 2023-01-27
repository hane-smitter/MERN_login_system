import React, { useContext } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, logoutEverywhere } from "../../redux/dispatchers";
import { AuthenticationContext } from "../../context/authenticationContext";

function NavBar() {
  // const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const {userIsAuthenticated} = useContext(AuthenticationContext)

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="light"
      variant="light"
      className="px-2 mb-2 justify-content-between"
    >
      <Navbar.Brand as={Link} to="/">
        Capital
      </Navbar.Brand>
      {userIsAuthenticated ? (
        <>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="My Account" id="collasible-nav-dropdown">
                <NavDropdown.Item as={Link} to="/home/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
              </NavDropdown>

              <Nav.Link href="#sth">Something here</Nav.Link>

              <hr />
              <Button as={Nav.Item} onClick={() => dispatch(logout())}>
                Log Out
              </Button>

              <NavDropdown title="Security" id="collasible-nav-dropdown-2">
                <Button
                  as={NavDropdown.Item}
                  onClick={() => dispatch(logoutEverywhere())}
                >
                  Log Out From All Devices
                </Button>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </>
      ) : (
        <Button
          as={Link}
          to="/login"
          className="text-uppercase fw-bolder"
          variant="outline-dark"
        >
          Sign in
        </Button>
      )}
    </Navbar>
  );
}

export default NavBar;
