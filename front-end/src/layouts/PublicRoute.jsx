import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("userData")); // Example: Get user data from localStorage

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children; 
};

export default PublicRoute;
