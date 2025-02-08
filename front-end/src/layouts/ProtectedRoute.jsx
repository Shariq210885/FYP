import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("userData")); // Example: Get user data from localStorage

  if (!user) {
    // Redirect to login if not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to a "Not Authorized" page if the role is not allowed
    return <Navigate to="/" replace />;
  }

  return children; // Render the protected route
};

export default ProtectedRoute;
