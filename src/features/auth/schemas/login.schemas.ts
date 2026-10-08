import { z } from "zod";

import { MARCAS_USER_ROLES } from "@/features/usuarios/api/user.types";

export const loginSchema = z.object({
  correo: z.string().trim().toLowerCase().email("Ingresa un correo electrónico válido."),
  // El contrato de POST /auth/login no impone longitud mínima. No bloquear
  // cuentas legadas que el backend todavía pueda autenticar.
  contrasena: z.string().min(1, "Ingresa tu contraseña."),
});

export const loginResponseSchema = z.object({
  authToken: z.string().min(1),
  usuario: z.object({
    id: z.number().int().positive(),
    nombre: z.string(),
    correo: z.string(),
    rol: z.enum(MARCAS_USER_ROLES),
    empresaId: z.number().int().positive().nullable(),
    activo: z.boolean(),
  }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
