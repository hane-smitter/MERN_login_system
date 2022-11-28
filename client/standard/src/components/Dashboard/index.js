import React from "react";

const Dashboard = () => {
  return (
    <div
      className="border border-1 border-success rounded-1 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "#F5F5F5", minHeight: 500 }}
    >
      <div>
        <div className="text-muted">You are viewing</div>
        <div className="display-6 text-success">Dashboard</div>
      </div>
    </div>
  );
};

export default Dashboard;
