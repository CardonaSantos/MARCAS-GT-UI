import { z } from "zod";
import { MARCAS_USER_ROLES } from "../api/user.types";

export const createUserSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa al menos 2 caracteres.").max(120),
  correo: z.string().trim().toLowerCase().email("Ingresa un correo válido.").max(250),
  contrasena: z.string().min(8, "La contraseña debe tener al menos 8 caracteres.").max(128),
  confirmarContrasena: z.string().min(1, "Confirma la contraseña."),
  rol: z.enum(MARCAS_USER_ROLES, { error: "Selecciona un rol válido." }),
}).refine((values) => values.contrasena === values.confirmarContrasena, {
  path: ["confirmarContrasena"],
  message: "Las contraseñas no coinciden.",
});
export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  nombre: z.string().trim().min(2, "Indica el nombre.").max(120),
  correo: z.string().trim().toLowerCase().email("Ingresa un correo válido.").max(250),
  rol: z.enum(MARCAS_USER_ROLES),
  activo: z.boolean(),
});
export type EditUserFormValues = z.infer<typeof editUserSchema>;

export const resetPasswordSchema = z.object({
  adminPassword: z.string().min(1, "Ingresa tu contraseña de administrador."),
  newPassword: z.string().min(8, "Mínimo 8 caracteres.").max(128),
  confirmPassword: z.string().min(1, "Confirma la contraseña nueva."),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"], message: "Las contraseñas no coinciden.",
});
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
