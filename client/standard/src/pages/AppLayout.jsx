import React from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";

import NavBar from "../components/Navbar/Navbar";
import AppFeedback from "../utils/appFeedback";

function AppLayout() {
  return (
    <Container fluid="md">
      <NavBar />
      <AppFeedback />
      <Outlet />
    </Container>
  );
}

export default AppLayout;
