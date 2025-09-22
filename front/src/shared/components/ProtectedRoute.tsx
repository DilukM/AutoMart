import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { getColorClasses } from "../styles/colors";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  console.log(
    "ProtectedRoute - isAuthenticated:",
    isAuthenticated,
    "loading:",
    loading
  );

  if (loading) {
    console.log("ProtectedRoute - showing loading screen");
    return (
      <div
        className={`min-h-screen ${getColorClasses.background.main} flex items-center justify-center`}
      >
        <span className={getColorClasses.text.primary}>Loading...</span>
      </div>
    );
  }

  if (isAuthenticated) {
    console.log("ProtectedRoute - user authenticated, showing children");
    return <>{children}</>;
  } else {
    console.log(
      "ProtectedRoute - user not authenticated, redirecting to /login"
    );
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
