import { z } from "zod";

const nullableSelectId = z.number().int().positive().nullable();

const integerText = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || (Number.isInteger(Number(value)) && Number(value) >= 0),
    "Ingresa un número entero válido.",
  );

const positiveIntegerText = z
  .string()
  .trim()
  .refine(
    (value) => Number.isInteger(Number(value)) && Number(value) > 0,
    "La cantidad debe ser un entero mayor que 0.",
  );

const optionalDateTime = z.string().trim().max(40).optional();

export const dispatchPlanningLineSchema = z.object({
  pedidoDetalleId: z.number().int().positive(),
  cantidadProgramada: integerText,
  observaciones: z.string().trim().max(500).optional(),
});

export const dispatchPlanningSchema = z
  .object({
    pedidoId: nullableSelectId,
    bodegaId: nullableSelectId,
    programadoEn: optionalDateTime,
    observaciones: z.string().trim().max(1000).optional(),
    detalles: z.array(dispatchPlanningLineSchema).max(200),
  })
  .superRefine((values, ctx) => {
    if (values.pedidoId === null) {
      ctx.addIssue({
        code: "custom",
        path: ["pedidoId"],
        message: "Selecciona un pedido.",
      });
    }

    if (values.bodegaId === null) {
      ctx.addIssue({
        code: "custom",
        path: ["bodegaId"],
        message: "Selecciona una bodega.",
      });
    }

    if (!values.detalles.some((line) => Number(line.cantidadProgramada) > 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["detalles"],
        message: "Programa al menos una línea del pedido.",
      });
    }
  });

export const dispatchStartPreparationSchema = z.object({
  observaciones: z.string().trim().max(1000).optional(),
  ocurridaEn: optionalDateTime,
});

export const dispatchPreparationLineSchema = z.object({
  detalleId: z.number().int().positive(),
  cantidadPreparada: integerText,
  observaciones: z.string().trim().max(500).optional(),
});

export const dispatchPreparationSchema = z.object({
  detalles: z.array(dispatchPreparationLineSchema).min(1).max(200),
});

export const dispatchOutputLineSchema = z.object({
  detalleId: z.number().int().positive(),
  cantidad: integerText,
});

export const dispatchOutputSchema = z
  .object({
    observaciones: z.string().trim().max(1000).optional(),
    ocurridaEn: optionalDateTime,
    detalles: z.array(dispatchOutputLineSchema).min(1).max(200),
  })
  .superRefine((values, ctx) => {
    if (!values.detalles.some((line) => Number(line.cantidad) > 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["detalles"],
        message: "Registra al menos una cantidad de salida.",
      });
    }
  });

export const dispatchCancelSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(3, "El motivo debe tener al menos 3 caracteres.")
    .max(500, "El motivo no puede exceder 500 caracteres."),
  ocurridaEn: optionalDateTime,
});

export const dispatchObservationSchema = z.object({
  detalle: z
    .string()
    .trim()
    .min(2, "Escribe al menos 2 caracteres.")
    .max(1000, "La observación no puede exceder 1000 caracteres."),
});

export type DispatchPlanningFormValues = z.infer<typeof dispatchPlanningSchema>;
export type DispatchStartPreparationFormValues = z.infer<
  typeof dispatchStartPreparationSchema
>;
export type DispatchPreparationFormValues = z.infer<
  typeof dispatchPreparationSchema
>;
export type DispatchOutputFormValues = z.infer<typeof dispatchOutputSchema>;
export type DispatchCancelFormValues = z.infer<typeof dispatchCancelSchema>;
export type DispatchObservationFormValues = z.infer<
  typeof dispatchObservationSchema
>;

export { positiveIntegerText };
