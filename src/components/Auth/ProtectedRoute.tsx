import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useStore } from "@/Context/ContextSucursal";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const authToken = useStore((state) => state.authToken);

  if (!authToken) {
    return <Navigate to="/marcas-gt/login" replace />;
  }

  return <>{children}</>;
}
