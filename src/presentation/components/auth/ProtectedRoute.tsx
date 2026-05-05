import React from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "@/application/stores/userStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { firebaseUser, isAuthLoading } = useUserStore();

  if (isAuthLoading) {
    return null; // Or a loading spinner, but App.tsx already handles the initial loading
  }

  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
