import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { getColorClasses } from "../styles/colors";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        className={`min-h-screen ${getColorClasses.background.main} flex items-center justify-center`}
      >
        <span className={getColorClasses.text.primary}>Loading...</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
