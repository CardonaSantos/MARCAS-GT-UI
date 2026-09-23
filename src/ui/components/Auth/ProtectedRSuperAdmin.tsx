import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useStore } from "../Context/ContextSucursal";
interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectRSuperAdmin({ children }: ProtectedRouteProps) {
  const isAuth = localStorage.getItem("authTokenPos");

  const userRol = useStore((state) => state.userRol);

  if (!isAuth || !userRol) return <Navigate to="/dashboard" />;

  if (userRol !== "SUPER_ADMIN") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
