import React from "react";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

import image from "../../images/capital.jpg";

function Home() {
  return (
    <Stack direction="horizontal" gap={2}>
      <div>
        <img
          src={image}
          alt="banner"
          width={400}
          height={500}
          className="rounded-2"
        />
      </div>
      <div className="mx-auto">
        <h1 className="text-uppercase">Welcome !!</h1>
        <p className="text-muted">
          Thank you for chosing <span className="fw-bold">Capital</span> to be
          your trusted service provider.
          <br />
          <span className="fst-italic">Sign in to get started.</span>
        </p>
        <div>
          <Button as={Link} to="/login" className="text-uppercase fw-bolder">
            Sign in
          </Button>
        </div>
      </div>
    </Stack>
  );
}

export default Home;
