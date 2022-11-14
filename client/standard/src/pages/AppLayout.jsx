import React from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";

import NavBar from "../components/Navbar/Navbar";

function AppLayout() {
  return (
    <Container fluid="md">
      <NavBar />
      <Outlet />
    </Container>
  );
}

export default AppLayout;
