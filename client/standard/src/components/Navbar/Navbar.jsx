import React, { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function NavBar() {
  const token = useSelector((state) => state.auth.token);

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
              <Nav.Link href="#new">New</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
              <NavDropdown title="My Account" id="collasible-nav-dropdown">
                <NavDropdown.Item as={Link} to="/home/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <Button
                  as={NavDropdown.Item}
                  onClick={() => console.log("logout button clicked")}
                >
                  Log Out
                </Button>
              </NavDropdown>
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
