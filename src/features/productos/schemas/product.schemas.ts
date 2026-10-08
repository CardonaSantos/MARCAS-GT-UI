import { z } from "zod";

const pricePattern = /^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/;
const money = (label: string, allowZero: boolean) =>
  z.string().trim()
    .refine((value) => pricePattern.test(value), {
      message: `${label}: utiliza un importe válido con hasta 2 decimales.`,
    })
    .refine((value) => !pricePattern.test(value) || (allowZero ? Number(value) >= 0 : Number(value) > 0), {
      message: `${label}: ${allowZero ? "no puede ser negativo" : "debe ser mayor que cero"}.`,
    });

export const createProductSchema = z.object({
  nombre: z.string().trim().min(1, "Escribe el nombre del producto.")
    .max(200, "Máximo 200 caracteres."),
  codigoProducto: z.string().trim().min(1, "Escribe un código único.")
    .max(120, "Máximo 120 caracteres."),
  descripcion: z.string().trim().max(1500, "Máximo 1500 caracteres."),
  categoriaIds: z.array(z.number().int().positive())
    .min(1, "Selecciona al menos una categoría."),
  precio: money("Precio de venta", false),
  precioCosto: money("Costo de referencia", true),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;

export const emptyProductForm: CreateProductFormValues = {
  nombre: "",
  codigoProducto: "",
  descripcion: "",
  categoriaIds: [],
  precio: "",
  precioCosto: "0",
};
