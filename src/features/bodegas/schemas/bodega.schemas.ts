import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Máximo ${max} caracteres.`);

export const createBodegaSchema = z.object({
  codigo: z
    .string()
    .trim()
    .min(2, "El código debe tener al menos 2 caracteres.")
    .max(30, "El código no puede exceder 30 caracteres."),
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(120, "El nombre no puede exceder 120 caracteres."),
  descripcion: optionalText(500),
  direccion: optionalText(250),
  telefono: optionalText(40),
  esPrincipal: z.boolean(),
  responsableId: z.number().int().positive().nullable(),
});

export const updateBodegaSchema = z.object({
  codigo: z
    .string()
    .trim()
    .min(2, "El código debe tener al menos 2 caracteres.")
    .max(30, "El código no puede exceder 30 caracteres."),
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(120, "El nombre no puede exceder 120 caracteres."),
  descripcion: optionalText(500),
  direccion: optionalText(250),
  telefono: optionalText(40),
});

export const assignBodegaResponsibleSchema = z.object({
  responsableId: z.number().int().positive().nullable(),
});

export const deactivateBodegaSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(3, "El motivo debe tener al menos 3 caracteres.")
    .max(300, "El motivo no puede exceder 300 caracteres."),
});

export type CreateBodegaFormValues = z.infer<typeof createBodegaSchema>;
export type UpdateBodegaFormValues = z.infer<typeof updateBodegaSchema>;
export type AssignBodegaResponsibleFormValues = z.infer<
  typeof assignBodegaResponsibleSchema
>;
export type DeactivateBodegaFormValues = z.infer<
  typeof deactivateBodegaSchema
>;
