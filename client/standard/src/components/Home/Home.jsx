import React from "react";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import image from "../../images/capital.jpg";
import { demo, demo2, demoAddToDo } from "../../redux/dispatchers";

function Home() {
  const dispatch = useDispatch();

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
        <p className="lead">
          Thank you for chosing <span className="fw-bold">Capital</span> to be
          your trusted service provider.
          <br />
          <span className="fst-italic text-muted">Sign Up to get started.</span>
        </p>
        <div>
          <Button
            as={Link}
            to="/signup"
            className="text-uppercase fw-bolder"
            variant="primary"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </Stack>
  );
}

export default Home;
