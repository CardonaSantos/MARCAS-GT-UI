import { z } from "zod";

export const categorySchema = z.object({
  nombre: z.string()
    .trim()
    .min(1, "Ingresa el nombre de la categoría.")
    .max(120, "El nombre no puede superar 120 caracteres."),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const emptyCategoryForm: CategoryFormValues = { nombre: "" };
