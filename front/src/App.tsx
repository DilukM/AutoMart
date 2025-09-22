import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./shared/hooks/AuthContext";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import LoginPage from "./features/auth/pages/LoginPage";
import Dashboard from "./features/admin/pages/Dashboard";
import VehicleManagement from "./features/admin/pages/VehicleManagement";
import VehicleDetails from "./features/admin/pages/VehicleDetails";
import UserManagement from "./features/admin/pages/UserManagement";
import EditVehicle from "./features/admin/pages/EditVehicle";
import AddNewVehicle from "./features/admin/pages/AddNewVehicle";
import Settings from "./features/admin/pages/Settings";
import Home from "./features/consumer/pages/Home";
import ConsumerVehicleDetails from "./features/consumer/pages/VehicleDetails";

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vehicles" element={<VehicleManagement />} />
              <Route path="/vehicles/:id" element={<VehicleDetails />} />
              <Route path="/vehicles/:id/edit" element={<EditVehicle />} />
              <Route path="/vehicles/add" element={<AddNewVehicle />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </ProtectedRoute>
        }
      />
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <Navigate to="/admin" replace />
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vehicle/:id" element={<ConsumerVehicleDetails />} />
            </Routes>
          )
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
