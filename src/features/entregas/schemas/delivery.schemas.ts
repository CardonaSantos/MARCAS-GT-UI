import { z } from "zod";

import {
  DELIVERY_EVIDENCE_TYPES,
  DELIVERY_FAILURE_REASONS,
} from "../common/delivery.constants";

const optionalCoordinate = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || Number.isFinite(Number(value)),
    "Ingresa una coordenada válida.",
  );

function coordinateState(values: { latitud?: string; longitud?: string }) {
  const lat = values.latitud ?? "";
  const lng = values.longitud ?? "";
  return {
    latInvalid: lat !== "" && Math.abs(Number(lat)) > 90,
    lngInvalid: lng !== "" && Math.abs(Number(lng)) > 180,
  };
}

export const startDeliverySchema = z
  .object({
    latitud: optionalCoordinate,
    longitud: optionalCoordinate,
  })
  .superRefine((values, ctx) => {
    const coordinates = coordinateState(values);
    if (coordinates.latInvalid) {
      ctx.addIssue({
        code: "custom",
        path: ["latitud"],
        message: "Latitud fuera de rango.",
      });
    }
    if (coordinates.lngInvalid) {
      ctx.addIssue({
        code: "custom",
        path: ["longitud"],
        message: "Longitud fuera de rango.",
      });
    }
  });

export const deliveryResultSchema = z
  .object({
    receptorNombre: z.string().trim().max(160).optional(),
    receptorDocumento: z.string().trim().max(80).optional(),
    latitud: optionalCoordinate,
    longitud: optionalCoordinate,
    observaciones: z.string().trim().max(1500).optional(),
    detalles: z
      .array(
        z.object({
          detalleId: z.number().int().positive(),
          cantidadEntregada: z
            .string()
            .trim()
            .refine(
              (value) => Number.isInteger(Number(value)) && Number(value) >= 0,
              "Debe ser un entero no negativo.",
            ),
          cantidadRechazada: z
            .string()
            .trim()
            .refine(
              (value) => Number.isInteger(Number(value)) && Number(value) >= 0,
              "Debe ser un entero no negativo.",
            ),
          motivoRechazo: z.string().trim().max(500).optional(),
        }),
      )
      .min(1),
  })
  .superRefine((values, ctx) => {
    const coordinates = coordinateState(values);
    if (coordinates.latInvalid) {
      ctx.addIssue({
        code: "custom",
        path: ["latitud"],
        message: "Latitud fuera de rango.",
      });
    }
    if (coordinates.lngInvalid) {
      ctx.addIssue({
        code: "custom",
        path: ["longitud"],
        message: "Longitud fuera de rango.",
      });
    }
  });

export const deliveryEvidenceSchema = z.object({
  tipo: z.enum(DELIVERY_EVIDENCE_TYPES),
  descripcion: z.string().trim().max(1000).optional(),
});

export const finalizeDeliverySchema = z
  .object({
    resultado: z.enum(["ENTREGADA", "PARCIAL", "RECHAZADA", "NO_ENTREGADA"]),
    receptorNombre: z.string().trim().max(160).optional(),
    receptorDocumento: z.string().trim().max(80).optional(),
    latitud: optionalCoordinate,
    longitud: optionalCoordinate,
    motivoNoEntrega: z.enum(DELIVERY_FAILURE_REASONS).nullable(),
    detalleNoEntrega: z.string().trim().max(1000).optional(),
    observaciones: z.string().trim().max(1500).optional(),
  })
  .superRefine((values, ctx) => {
    const coordinates = coordinateState(values);
    if (coordinates.latInvalid) {
      ctx.addIssue({
        code: "custom",
        path: ["latitud"],
        message: "Latitud fuera de rango.",
      });
    }
    if (coordinates.lngInvalid) {
      ctx.addIssue({
        code: "custom",
        path: ["longitud"],
        message: "Longitud fuera de rango.",
      });
    }
    if (values.resultado === "NO_ENTREGADA" && !values.motivoNoEntrega) {
      ctx.addIssue({
        code: "custom",
        path: ["motivoNoEntrega"],
        message: "Selecciona un motivo de no entrega.",
      });
    }
    if (
      values.resultado === "NO_ENTREGADA" &&
      values.motivoNoEntrega === "OTRO" &&
      !values.detalleNoEntrega?.trim()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["detalleNoEntrega"],
        message: "Describe el motivo de no entrega.",
      });
    }
  });

export const deliveryObservationSchema = z.object({
  detalle: z.string().trim().min(2).max(1000),
});

export type StartDeliveryFormValues = z.infer<typeof startDeliverySchema>;
export type DeliveryResultFormValues = z.infer<typeof deliveryResultSchema>;
export type DeliveryEvidenceFormValues = z.infer<typeof deliveryEvidenceSchema>;
export type FinalizeDeliveryFormValues = z.infer<typeof finalizeDeliverySchema>;
export type DeliveryObservationFormValues = z.infer<typeof deliveryObservationSchema>;
