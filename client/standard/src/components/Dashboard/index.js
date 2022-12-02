import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state) => state?.auth?.user);
  return (
    <div className="mt-2">
      <span className="text-muted">Welcome Dear {user?.firstName}</span>
      <div
        className="border border-1 border-success rounded-1 d-flex justify-content-center align-items-center"
        style={{ backgroundColor: "#F5F5F5", minHeight: 500 }}
      >
        <div>
          <div className="text-muted">You are viewing</div>
          <div className="display-6 text-success">Dashboard</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
