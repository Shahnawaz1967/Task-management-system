import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading} = useAuth();
  if(loading){
    return <p>Loading...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet/>;
};

export default ProtectedRoute;