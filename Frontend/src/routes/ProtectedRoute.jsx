import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  if (allowedRoles && userJson) {
    try {
      const user = JSON.parse(userJson);
      // Support both snake_case and camelCase for role strings
      const mappedRole = user.role === "salesManager" ? "sales_manager" : (user.role === "salesExecutive" ? "sales_executive" : user.role);
      
      const isAllowed = allowedRoles.some(r => {
        const mappedAllowedRole = r === "salesManager" ? "sales_manager" : (r === "salesExecutive" ? "sales_executive" : r);
        return mappedAllowedRole === mappedRole;
      });

      if (!isAllowed) {
        if (mappedRole === "admin") {
          return <Navigate to="/admin-dashboard" replace />;
        } else if (mappedRole === "sales_manager") {
          return <Navigate to="/manager-dashboard" replace />;
        } else if (mappedRole === "sales_executive") {
          return <Navigate to="/executive-dashboard" replace />;
        } else {
          return <Navigate to="/Login" replace />;
        }
      }
    } catch (e) {
      console.error("Failed to parse user role in ProtectedRoute:", e);
      return <Navigate to="/Login" replace />;
    }
  }

  return <Outlet />;
}

export default ProtectedRoute;