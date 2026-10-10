export const MARCAS_USER_ROLES = [
  "ADMIN", "VENDEDOR", "BODEGA", "CONTABILIDAD", "REPARTIDOR",
] as const;

export type MarcasUserRole = (typeof MARCAS_USER_ROLES)[number];

export const USER_ROLE_OPTIONS: { value: MarcasUserRole; label: string }[] = [
  { value: "ADMIN", label: "Administrador" },
  { value: "VENDEDOR", label: "Vendedor" },
  { value: "BODEGA", label: "Personal de bodega" },
  { value: "CONTABILIDAD", label: "Contabilidad" },
  { value: "REPARTIDOR", label: "Repartidor" },
];

export interface SystemUser {
  id: number;
  nombre: string;
  correo: string;
  rol: MarcasUserRole;
  activo: boolean;
  empresaId: number | null;
  creadoEn: string;
  actualizadoEn: string;
}

export type UserSortField = "nombre" | "correo" | "rol" | "activo" | "creadoEn" | "actualizadoEn";
export interface UserDirectoryFilters {
  page: number;
  limit: number;
  search?: string;
  rol?: MarcasUserRole;
  activo?: "true" | "false";
  sortBy: UserSortField;
  sortDir: "asc" | "desc";
}
export interface UserDirectoryPage {
  data: SystemUser[];
  meta: { page: number; limit: number; total: number; totalPages: number };
  summary: { total: number; active: number; inactive: number; admins: number };
}
export interface CreateUserPayload {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: MarcasUserRole;
  empresaId: number;
}
export type CreateUserResponse = SystemUser;
export interface UpdateUserPayload {
  nombre: string;
  correo: string;
  rol: MarcasUserRole;
  activo: boolean;
}
export interface ChangePasswordPayload {
  adminPassword: string;
  newPassword: string;
}
