import { Navigate } from "react-router-dom";

import gif from "@/assets/loading.gif";
import { useAuthStore } from "./AuthState";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"] as const;

export function ProtectRouteAdmin({ children }: ProtectedRouteProps) {
  const { userRol, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <img src={gif} alt="Cargando..." className="h-16 w-16 object-contain" />
        <p className="text-lg font-semibold text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!userRol) {
    return <Navigate to="/login" replace />;
  }

  if (!ADMIN_ROLES.includes(userRol as (typeof ADMIN_ROLES)[number])) {
    return <Navigate to="/dashboard-empleado" replace />;
  }

  return children;
}
