import type { Provider, ProviderOptionalField, ProviderPayload } from "../api/provider.types";
import type { ProviderFormValues } from "../schemas/provider.schemas";

const optionalFields = [
  "correo", "telefono", "direccion", "razonSocial", "rfc",
  "nombreContacto", "telefonoContacto", "emailContacto",
  "pais", "ciudad", "codigoPostal", "notas",
] as const satisfies readonly ProviderOptionalField[];

export function toProviderForm(provider: Provider): ProviderFormValues {
  return {
    nombre: provider.nombre,
    activo: provider.activo,
    correo: provider.correo ?? "",
    telefono: provider.telefono ?? "",
    direccion: provider.direccion ?? "",
    razonSocial: provider.razonSocial ?? "",
    rfc: provider.rfc ?? "",
    nombreContacto: provider.nombreContacto ?? "",
    telefonoContacto: provider.telefonoContacto ?? "",
    emailContacto: provider.emailContacto ?? "",
    pais: provider.pais ?? "",
    ciudad: provider.ciudad ?? "",
    codigoPostal: provider.codigoPostal ?? "",
    notas: provider.notas ?? "",
  };
}

/** Enviar null para poder limpiar campos opcionales durante la edición. */
export function toProviderPayload(values: ProviderFormValues): ProviderPayload {
  const optional = Object.fromEntries(
    optionalFields.map((field) => [field, values[field].trim() || null]),
  ) as Record<ProviderOptionalField, string | null>;

  return {
    nombre: values.nombre.trim(),
    activo: values.activo,
    ...optional,
  };
}
