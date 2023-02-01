import React from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const Lost = () => {
  return (
    <div style={{ maxWidth: 500, marginInline: "auto" }}>
      <span>
        <h1 className="text-uppercase text-center">Nothing is here</h1>
        <h4 className="lead text-center">
          You are seeing this because you are headed into abyss!⚫
        </h4>
        <p className="text-muted text-center mt-3">
          <Button as={Link} to="/" className="text-uppercase">
            go home
          </Button>
        </p>
      </span>
    </div>
  );
};

export default Lost;
