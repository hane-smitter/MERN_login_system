import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/dispatchers";

const Profile = () => {
  const dispatch = useDispatch();
  const { user_loading, user } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   dispatch(getUserProfile(user?._id));
  // }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Your Profile</h2>

          <div className="card position-relative">
            {/* Spinner */}
            {user_loading ? (
              <div className="position-absolute w-100">
                <div className="mx-auto" style={{ width: "50px" }}>
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="card-header">
              Details of user id :
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
