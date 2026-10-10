import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useStore } from "@/Context/ContextSucursal";

interface ProtectedRouteProps {
  children: ReactNode;
}

interface ProtectedRouteRolesProps extends ProtectedRouteProps {
  roles: readonly string[];
  fallback?: string;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const authToken = useStore((state) => state.authToken);

  if (!authToken) {
    return <Navigate to="/marcas-gt/login" replace />;
  }

  return <>{children}</>;
}

export function ProtectedRouteRoles({
  children,
  roles,
  fallback,
}: ProtectedRouteRolesProps) {
  const authToken = useStore((state) => state.authToken);
  const userRol = useStore((state) => state.userRol);

  if (!authToken) {
    return <Navigate to="/marcas-gt/login" replace />;
  }

  if (!userRol || !roles.includes(userRol)) {
    return (
      <Navigate
        to={
          fallback ??
          (userRol === "ADMIN"
            ? "/marcas-gt/dashboard"
            : "/marcas-gt/dashboard-empleado")
        }
        replace
      />
    );
  }

  return <>{children}</>;
}
