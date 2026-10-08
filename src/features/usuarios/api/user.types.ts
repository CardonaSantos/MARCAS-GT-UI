export const MARCAS_USER_ROLES = [
  "ADMIN", "VENDEDOR", "BODEGA", "CONTABILIDAD", "REPARTIDOR",
] as const;

export type MarcasUserRole = (typeof MARCAS_USER_ROLES)[number];

export const USER_ROLE_OPTIONS: {value: MarcasUserRole; label: string}[] = [
  { value: "ADMIN", label: "Administrador" },
  { value: "VENDEDOR", label: "Vendedor" },
  { value: "BODEGA", label: "Personal de bodega" },
  { value: "CONTABILIDAD", label: "Contabilidad" },
  { value: "REPARTIDOR", label: "Repartidor" },
];

export interface CreateUserPayload {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: MarcasUserRole;
  empresaId: number;
}

export interface CreateUserResponse {
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
