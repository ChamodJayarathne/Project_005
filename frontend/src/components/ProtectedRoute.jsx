import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  user,
  // eslint-disable-next-line no-unused-vars
  authLoading,
  allowedRoles,
  children,
}) {


  // Auth check complete, no user found
  if (!user) {
    return <Navigate to="/login" />;
  }

  // User found but wrong role
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // All checks passed
  return children;
}

