import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { useStore } from "@/Context/ContextSucursal";
import gif from "@/assets/images/loading.gif";

interface ProtectedRouteProps {
  children: ReactNode;
}

function LoadingScreen() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-2">
      <img src={gif} alt="Cargando..." className="w-16 h-16 object-contain" />
      <p className="text-lg font-semibold text-gray-600">Cargando...</p>
    </div>
  );
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // 1) ¿Está autenticado?
  const isAuth = Boolean(localStorage.getItem("authToken"));
  if (!isAuth) {
    return <Navigate to="/marcas-gt/login" replace />;
  }

  // 2) Si está auth, esperamos a que el rol esté definido
  const rolUser = useStore((state) => state.userRol);
  const [loadingRol, setLoadingRol] = useState(true);

  useEffect(() => {
    if (rolUser !== undefined) {
      setLoadingRol(false);
    }
  }, [rolUser]);

  if (loadingRol) {
    return <LoadingScreen />;
  }

  // 3) Ya está autenticado y tenemos rol cargado, devolvemos los children
  return <>{children}</>;
}
