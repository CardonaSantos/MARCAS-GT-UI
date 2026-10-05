import { z } from "zod";

const requiredSelectId = (message: string) =>
  z
    .number()
    .int()
    .positive()
    .nullable()
    .refine((value) => value !== null, { message });

const positiveIntegerText = z
  .string()
  .trim()
  .regex(/^[1-9]\d*$/, "Ingresa un número entero mayor que cero.");

const optionalPositiveIntegerText = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^[1-9]\d*$/.test(value),
    "Ingresa un número entero mayor que cero.",
  );

const costText = z
  .string()
  .trim()
  .regex(
    /^\d+(?:\.\d{1,4})?$/,
    "Ingresa un costo válido con máximo 4 decimales.",
  );

const optionalCostText = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\d+(?:\.\d{1,4})?$/.test(value),
    "Ingresa un costo válido con máximo 4 decimales.",
  );

const optionalText = (max: number) =>
  z.string().trim().max(max, `Máximo ${max} caracteres.`);

const referenceFields = {
  referenciaTipo: optionalText(80),
  referenciaId: optionalPositiveIntegerText,
};

function validateReferencePair(
  values: { referenciaTipo: string; referenciaId: string },
  ctx: z.RefinementCtx,
) {
  const hasType = values.referenciaTipo.trim().length > 0;
  const hasId = values.referenciaId.trim().length > 0;

  if (hasType === hasId) return;

  if (!hasType) {
    ctx.addIssue({
      code: "custom",
      path: ["referenciaTipo"],
      message: "Indica el tipo de referencia.",
    });
  }

  if (!hasId) {
    ctx.addIssue({
      code: "custom",
      path: ["referenciaId"],
      message: "Indica el ID de referencia.",
    });
  }
}

export const registerInventoryEntrySchema = z
  .object({
    bodegaId: requiredSelectId("Selecciona una bodega."),
    productoId: requiredSelectId("Selecciona un producto."),
    cantidad: positiveIntegerText,
    costoUnitario: costText,
    proveedorId: z.number().int().positive().nullable(),
    observaciones: optionalText(500),
    ...referenceFields,
  })
  .superRefine(validateReferencePair);

export const adjustInventorySchema = z.object({
  bodegaId: requiredSelectId("Selecciona una bodega."),
  productoId: requiredSelectId("Selecciona un producto."),
  tipo: z.enum(["ENTRADA", "SALIDA"]),
  cantidad: positiveIntegerText,
  costoUnitario: optionalCostText,
  motivo: z
    .string()
    .trim()
    .min(3, "El motivo debe tener al menos 3 caracteres.")
    .max(500, "El motivo no puede exceder 500 caracteres."),
});

export const registerInventoryReturnSchema = z
  .object({
    bodegaId: requiredSelectId("Selecciona una bodega."),
    productoId: requiredSelectId("Selecciona un producto."),
    cantidad: positiveIntegerText,
    costoUnitario: optionalCostText,
    observaciones: optionalText(500),
    ...referenceFields,
  })
  .superRefine(validateReferencePair);

export const reserveInventorySchema = z.object({
  pedidoDetalleId: requiredSelectId("Selecciona un detalle de pedido."),
  bodegaId: requiredSelectId("Selecciona una bodega."),
  cantidad: positiveIntegerText,
});

export const reservationMutationSchema = z
  .object({
    cantidad: positiveIntegerText,
    observaciones: optionalText(500),
    ...referenceFields,
  })
  .superRefine(validateReferencePair);

export const cancelReservationSchema = z
  .object({
    motivo: z
      .string()
      .trim()
      .min(3, "El motivo debe tener al menos 3 caracteres.")
      .max(500, "El motivo no puede exceder 500 caracteres."),
    ...referenceFields,
  })
  .superRefine(validateReferencePair);

export type RegisterInventoryEntryFormValues = z.infer<
  typeof registerInventoryEntrySchema
>;
export type AdjustInventoryFormValues = z.infer<typeof adjustInventorySchema>;
export type RegisterInventoryReturnFormValues = z.infer<
  typeof registerInventoryReturnSchema
>;
export type ReserveInventoryFormValues = z.infer<typeof reserveInventorySchema>;
export type ReservationMutationFormValues = z.infer<
  typeof reservationMutationSchema
>;
export type CancelReservationFormValues = z.infer<
  typeof cancelReservationSchema
>;
