import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Loading } from "./components/shared/Loading";
import { useAuth } from "./hooks/useAuth";

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Loading />;
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
};
