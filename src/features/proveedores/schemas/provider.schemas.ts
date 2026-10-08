import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max, `Máximo ${max} caracteres.`);
const optionalEmail = z.string().trim().refine(
  (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  "Introduce un correo electrónico válido.",
);

export const providerSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre del proveedor es obligatorio.")
    .max(150, "Máximo 150 caracteres."),
  correo: optionalEmail,
  telefono: optionalText(40),
  direccion: optionalText(250),
  razonSocial: optionalText(200),
  rfc: optionalText(40),
  nombreContacto: optionalText(150),
  telefonoContacto: optionalText(40),
  emailContacto: optionalEmail,
  pais: optionalText(100),
  ciudad: optionalText(120),
  codigoPostal: optionalText(25),
  notas: optionalText(2000),
  activo: z.boolean(),
});

export type ProviderFormValues = z.infer<typeof providerSchema>;

export const emptyProviderForm: ProviderFormValues = {
  nombre: "",
  correo: "",
  telefono: "",
  direccion: "",
  razonSocial: "",
  rfc: "",
  nombreContacto: "",
  telefonoContacto: "",
  emailContacto: "",
  pais: "",
  ciudad: "",
  codigoPostal: "",
  notas: "",
  activo: true,
};
