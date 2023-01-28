import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Your Profile</h2>

          <div className="card position-relative">
            <div className="card-header">
              Details of user:
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <b>First Name: </b>
                  <span>{user?.firstName}</span>
                </li>

                <li className="list-group-item">
                  <b>Last Name: </b>
                  <span>{user?.lastName}</span>
                </li>

                <li className="list-group-item">
                  <b>Email: </b>
                  <span>{user?.email}</span>
                </li>
              </ul>
            </div>
          </div>
          <Link to="/" className="btn btn-primary my-2">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
