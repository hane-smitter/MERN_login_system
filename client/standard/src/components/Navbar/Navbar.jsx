import React, { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/dispatchers";

function NavBar() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

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
      {Boolean(token) ? (
        <React.Fragment>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="My Account" id="collasible-nav-dropdown">
                <NavDropdown.Item as={Link} to="/home/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <Button
                  as={NavDropdown.Item}
                  onClick={() => dispatch(logout())}
                >
                  Log Out
                </Button>
              </NavDropdown>
              <Nav.Link href="#new">What's New ?</Nav.Link>
              <Nav.Link href="#history">History</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </React.Fragment>
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
