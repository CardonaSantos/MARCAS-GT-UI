/** Contrato de Proveedor definido en el schema Prisma y /provider. */
export interface Provider {
  id: number;
  nombre: string;
  correo: string | null;
  telefono: string | null;
  direccion: string | null;
  razonSocial: string | null;
  rfc: string | null;
  nombreContacto: string | null;
  telefonoContacto: string | null;
  emailContacto: string | null;
  pais: string | null;
  ciudad: string | null;
  codigoPostal: string | null;
  notas: string | null;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export type ProviderOptionalField =
  | "correo"
  | "telefono"
  | "direccion"
  | "razonSocial"
  | "rfc"
  | "nombreContacto"
  | "telefonoContacto"
  | "emailContacto"
  | "pais"
  | "ciudad"
  | "codigoPostal"
  | "notas";

export type ProviderPayload = {
  nombre: string;
  activo: boolean;
} & Record<ProviderOptionalField, string | null>;

export interface UpdateProviderVariables {
  id: number;
  payload: ProviderPayload;
}

export interface DeleteProviderVariables {
  id: number;
}
