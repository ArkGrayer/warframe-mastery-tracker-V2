import React from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "@/application/stores/userStore";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { firebaseUser, isAuthLoading } = useUserStore();

  if (isAuthLoading) {
    return null;
  }

  if (firebaseUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
