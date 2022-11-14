import React from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Your Profile</h2>

          <div className="card">
            <div className="card-header">
              Details of user id :
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <b>Name: </b>
                </li>

                <li className="list-group-item">
                  <b>UserName: </b>
                </li>

                <li className="list-group-item">
                  <b>Email: </b>
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
