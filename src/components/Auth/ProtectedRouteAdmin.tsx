import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useStore } from "@/Context/ContextSucursal";
import { useEffect, useState } from "react";
import gif from "@/assets/images/loading.gif";

// interface ProtectedRouteAdminProps {
//   children: ReactNode;
// }

function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-2">
      <img src={gif} alt="Cargando..." className="w-16 h-16" />
      <p className="text-lg font-semibold text-gray-600">Cargando...</p>
    </div>
  );
}

export function ProtectedRouteAdmin({ children }: { children: ReactNode }) {
  // 1) ¿Está logueado?
  const isAuth = Boolean(localStorage.getItem("authToken"));
  if (!isAuth) {
    return <Navigate to="/marcas-gt/login" replace />;
  }

  // 2) Cargo el rol y espero a que esté definido
  const rolUser = useStore((s) => s.userRol);
  const [loadingRol, setLoadingRol] = useState(true);

  useEffect(() => {
    if (rolUser !== undefined) {
      setLoadingRol(false);
    }
  }, [rolUser]);

  if (loadingRol) {
    return <Loading />;
  }

  // 3) Si no es ADMIN, lo bajo a empleado
  if (rolUser !== "ADMIN") {
    return <Navigate to="/marcas-gt/dashboard-empleado" replace />;
  }

  // 4) OK, es admin
  return <>{children}</>;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  // Sólo comprueba que esté logueado
  const isAuth = Boolean(localStorage.getItem("authToken"));

  if (!isAuth) {
    return <Navigate to="/marcas-gt/login" replace />;
  }

  return <>{children}</>;
}
