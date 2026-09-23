// import { RolUsuario } from "@/Crm/features/users/users-rol";

// export const CRM_ROUTES: Partial<Record<RolUsuario, Route[]>> = {
//   [RolUsuario.SUPER_ADMIN]: routesCrm_SuperAdmin,
//   [RolUsuario.ADMIN]: routesCrm_Admin,
//   [RolUsuario.OFICINA]: routesCrm_Oficina,
//   [RolUsuario.TECNICO]: routesCrm_Tecnico,
//   [RolUsuario.COBRADOR]: routesCrm_Cobrador,
// };

// export function getCrmRoutesByRole(
//   role: RolUsuario | null | undefined,
// ): Route[] {
//   if (!role) {
//     return routesCrm_Otro;
//   }

//   return CRM_ROUTES[role] ?? routesCrm_Otro;
// }
