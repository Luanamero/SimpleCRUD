import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../services/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "customer" | "seller" | "admin"; // Roles that can access this route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading indicator while checking authentication
    return <div className="auth-loading">Carregando...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Check if the path is already correct for the user's role to avoid redirect loops
    const customerPath = "/customer/profile";
    const sellerPath = "/admin";
/* 
    if (user?.role === "customer" && location.pathname !== customerPath) {
      return <Navigate to={customerPath} replace />;
    } else if (
      user?.role === "seller" &&
      ![
        sellerPath,
        "/livros",
        "/autores",
        "/editoras",
        "/clients",
        "/orders",
        "/reports",
      ].includes(location.pathname)
    ) {
      return <Navigate to={sellerPath} replace />;
    } */
  }

  return <>{children}</>;
};

export default ProtectedRoute;
