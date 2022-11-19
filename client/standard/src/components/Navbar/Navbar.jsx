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
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
              <NavDropdown title="My Account" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Activity</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">profile</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Log Out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link href="#deets">More deets</Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
                Dank memes
              </Nav.Link>
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
