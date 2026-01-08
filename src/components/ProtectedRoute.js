// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();

  if (!user) {
    // Nếu chưa login, redirect về /login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
