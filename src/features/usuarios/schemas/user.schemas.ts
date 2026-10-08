import { z } from "zod";
import { MARCAS_USER_ROLES } from "../api/user.types";

export const createUserSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa al menos 2 caracteres.").max(120),
  correo: z.string().trim().toLowerCase().email("Ingresa un correo válido."),
  contrasena: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
  confirmarContrasena: z.string().min(1, "Confirma la contraseña."),
  rol: z.enum(MARCAS_USER_ROLES, { error: "Selecciona un rol válido." }),
}).refine((values) => values.contrasena === values.confirmarContrasena, {
  path: ["confirmarContrasena"],
  message: "Las contraseñas no coinciden.",
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
