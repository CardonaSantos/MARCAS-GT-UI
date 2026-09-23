// PROTECTOR PARA CUALQUIER USUARIO LOGUEADO
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import gif from "@/assets/loading.gif";
import { useAuthStore } from "./AuthState";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { userRol, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-2">
        <img src={gif} alt="Cargando..." className="w-16 h-16 object-contain" />
        <p className="text-lg font-semibold text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!userRol) {
    return <Navigate to="/login" />;
  }

  return children;
}
