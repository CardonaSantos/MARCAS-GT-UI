import { RolUsuario } from "@/Crm/features/users/users-rol";

import type { Route } from "./crm-route-types";
import { routesCrm_Admin } from "./routes-admin";
import { routesCrm_Cobrador } from "./routes-cobrador";
import { routesCrm_CoordinadorOperaciones } from "./routes-coordinador-operaciones";
import { routesCrm_Oficina } from "./routes-oficina";
import { routesCrm_SuperAdmin } from "./routes-super-admin";
import { routesCrm_Tecnico } from "./routes-tecnico";
import { routesCrm_Tienda } from "./routes-tienda";

export const CRM_ROUTES = {
  [RolUsuario.SUPER_ADMIN]: routesCrm_SuperAdmin,
  [RolUsuario.ADMIN]: routesCrm_Admin,
  [RolUsuario.COORDINADOR_OPERACIONES]: routesCrm_CoordinadorOperaciones,
  [RolUsuario.OFICINA]: routesCrm_Oficina,
  [RolUsuario.TIENDA]: routesCrm_Tienda,
  [RolUsuario.TECNICO]: routesCrm_Tecnico,
  [RolUsuario.COBRADOR]: routesCrm_Cobrador,
} satisfies Record<RolUsuario, Route[]>;

export function getCrmRoutesByRole(
  role: RolUsuario | null | undefined,
): Route[] {
  if (!role) return [];

  return CRM_ROUTES[role];
}
