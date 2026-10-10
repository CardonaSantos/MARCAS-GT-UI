import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useStore } from "@/Context/ContextSucursal";

export function ProtectedRouteAdmin({ children }: { children: ReactNode }) {
  const authToken = useStore((state) => state.authToken);
  const rolUser = useStore((state) => state.userRol);

  if (!authToken) {
    return <Navigate to="/marcas-gt/login" replace />;
  }

  if (rolUser !== "ADMIN") {
    return <Navigate to="/marcas-gt/dashboard-empleado" replace />;
  }

  return <>{children}</>;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const authToken = useStore((state) => state.authToken);

  if (!authToken) {
    return <Navigate to="/marcas-gt/login" replace />;
  }

  return <>{children}</>;
}
