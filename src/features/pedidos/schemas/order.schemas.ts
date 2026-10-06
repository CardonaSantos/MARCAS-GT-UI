import { z } from "zod";

import { ORDER_PAYMENT_CONDITIONS } from "../common/order.constants";

const moneyText = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\d{1,10}(?:\.\d{1,2})?$/.test(value),
    "Ingresa un monto válido con máximo 2 decimales.",
  );

const orderLineSchema = z.object({
  productoId: z
    .number()
    .int()
    .positive()
    .nullable()
    .refine((value) => value !== null, {
      message: "Selecciona un producto.",
    }),
  cantidadSolicitada: z
    .string()
    .trim()
    .regex(/^[1-9]\d*$/, "Ingresa una cantidad entera mayor que cero."),
  descuento: moneyText,
  observaciones: z
    .string()
    .trim()
    .max(500, "Máximo 500 caracteres."),
});

export const orderFormSchema = z
  .object({
    clienteId: z
      .number()
      .int()
      .positive()
      .nullable()
      .refine((value) => value !== null, {
        message: "Selecciona un cliente.",
      }),
    vendedorId: z
      .number()
      .int()
      .positive()
      .nullable()
      .refine((value) => value !== null, {
        message: "Selecciona un vendedor.",
      }),
    visitaId: z.number().int().positive().nullable(),
    condicionPago: z.enum(ORDER_PAYMENT_CONDITIONS),
    observaciones: z
      .string()
      .trim()
      .max(1000, "Máximo 1000 caracteres."),
    detalles: z.array(orderLineSchema).max(200, "Máximo 200 productos."),
  })
  .superRefine((values, ctx) => {
    const seen = new Set<number>();

    values.detalles.forEach((line, index) => {
      if (line.productoId === null) return;

      if (seen.has(line.productoId)) {
        ctx.addIssue({
          code: "custom",
          path: ["detalles", index, "productoId"],
          message: "El producto ya está incluido en el pedido.",
        });
      }

      seen.add(line.productoId);
    });
  });

export const cancelOrderSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(3, "El motivo debe tener al menos 3 caracteres.")
    .max(500, "Máximo 500 caracteres."),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
export type CancelOrderFormValues = z.infer<typeof cancelOrderSchema>;
