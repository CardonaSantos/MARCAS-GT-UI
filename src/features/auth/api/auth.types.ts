import type { MarcasUserRole } from "@/features/usuarios/api/user.types";

export interface LoginPayload {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  authToken: string;
  usuario: {
    id: number;
    nombre: string;
    correo: string;
    rol: MarcasUserRole;
    empresaId: number | null;
    activo: boolean;
  };
}

/**
 * Punto de entrada verificado contra las rutas de App.tsx.
 * Los colaboradores usan el dashboard accesible a los roles no ADMIN.
 */
export const LOGIN_HOME_BY_ROLE: Record<MarcasUserRole, string> = {
  ADMIN: "/marcas-gt/dashboard",
  VENDEDOR: "/marcas-gt/dashboard-empleado",
  BODEGA: "/marcas-gt/dashboard-empleado",
  CONTABILIDAD: "/marcas-gt/dashboard-empleado",
  REPARTIDOR: "/marcas-gt/dashboard-empleado",
};

export function getLoginHome(role: MarcasUserRole): string {
  return LOGIN_HOME_BY_ROLE[role];
}
