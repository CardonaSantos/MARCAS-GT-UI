import { z } from "zod";

import {
  INCIDENT_SEVERITIES,
  INCIDENT_TYPES,
  SHIPMENT_MODES,
} from "../common/transport.constants";

const nullableId = z.number().int().positive().nullable();

const optionalDateTime = z.string().trim().max(40).optional();

const optionalDecimal = z
  .string()
  .trim()
  .refine(
    (value) =>
      value === "" ||
      (Number.isFinite(Number(value)) && Number(value) >= 0),
    "Ingresa un valor numérico válido.",
  );

const optionalCoordinate = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || Number.isFinite(Number(value)),
    "Ingresa una coordenada válida.",
  );

export const shipmentPlanningSchema = z.object({
  bodegaId: nullableId,
  modalidad: z.enum(SHIPMENT_MODES),
  salidaProgramadaEn: optionalDateTime,
  entregaEstimadaEn: optionalDateTime,
  guia: z.string().trim().max(120).optional(),
  costo: optionalDecimal,
  trackingUrl: z.string().trim().max(500).optional(),
  comprobanteUrl: z.string().trim().max(500).optional(),
  observaciones: z.string().trim().max(1000).optional(),
}).superRefine((values, ctx) => {
  if (values.bodegaId === null) {
    ctx.addIssue({
      code: "custom",
      path: ["bodegaId"],
      message: "Selecciona una bodega.",
    });
  }
});

export const shipmentInternalAssignmentSchema = z.object({
  vehiculoId: z.number().int().positive().nullable(),
  conductorId: z.number().int().positive().nullable(),
  responsableId: z.number().int().positive().nullable(),
}).superRefine((values, ctx) => {
  if (values.vehiculoId === null) {
    ctx.addIssue({ code: "custom", path: ["vehiculoId"], message: "Selecciona un vehículo." });
  }
  if (values.conductorId === null) {
    ctx.addIssue({ code: "custom", path: ["conductorId"], message: "Selecciona un conductor." });
  }
  if (values.responsableId === null) {
    ctx.addIssue({ code: "custom", path: ["responsableId"], message: "Selecciona un responsable." });
  }
});

export const shipmentExternalAssignmentSchema = z.object({
  transportistaId: z.number().int().positive().nullable(),
}).superRefine((values, ctx) => {
  if (values.transportistaId === null) {
    ctx.addIssue({ code: "custom", path: ["transportistaId"], message: "Selecciona un transportista." });
  }
});

export const shipmentLoadSchema = z.object({
  lineas: z.array(z.object({
    cargaDetalleId: z.number().int().positive(),
    cantidadCargada: z
      .string()
      .trim()
      .refine(
        (value) => Number.isInteger(Number(value)) && Number(value) > 0,
        "La cantidad debe ser un entero mayor que 0.",
      ),
  })).min(1),
});

export const shipmentRouteSchema = z.object({
  latitud: optionalCoordinate,
  longitud: optionalCoordinate,
}).superRefine((values, ctx) => {
  if (values.latitud !== "" && Math.abs(Number(values.latitud)) > 90) {
    ctx.addIssue({ code: "custom", path: ["latitud"], message: "Latitud fuera de rango." });
  }
  if (values.longitud !== "" && Math.abs(Number(values.longitud)) > 180) {
    ctx.addIssue({ code: "custom", path: ["longitud"], message: "Longitud fuera de rango." });
  }
});

export const shipmentCancelSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(3, "El motivo debe tener al menos 3 caracteres.")
    .max(500),
});

export const shipmentObservationSchema = z.object({
  detalle: z
    .string()
    .trim()
    .min(2, "Escribe al menos 2 caracteres.")
    .max(1000),
});

export const shipmentIncidentSchema = z.object({
  tipo: z.enum(INCIDENT_TYPES),
  severidad: z.enum(INCIDENT_SEVERITIES),
  descripcion: z.string().trim().min(3).max(1500),
  latitud: optionalCoordinate,
  longitud: optionalCoordinate,
}).superRefine((values, ctx) => {
  if (values.latitud !== "" && Math.abs(Number(values.latitud)) > 90) {
    ctx.addIssue({ code: "custom", path: ["latitud"], message: "Latitud fuera de rango." });
  }
  if (values.longitud !== "" && Math.abs(Number(values.longitud)) > 180) {
    ctx.addIssue({ code: "custom", path: ["longitud"], message: "Longitud fuera de rango." });
  }
});

export const resolveShipmentIncidentSchema = z.object({
  resolucion: z.string().trim().min(3).max(1500),
});

export const carrierSchema = z.object({
  codigo: z.string().trim().max(80).optional(),
  tipo: z.enum(SHIPMENT_MODES),
  nombre: z.string().trim().min(2).max(150),
  telefono: z.string().trim().max(50).optional(),
  correo: z.string().trim().max(150).optional(),
});

export const vehicleSchema = z.object({
  transportistaId: nullableId,
  placa: z.string().trim().min(2).max(30),
  marca: z.string().trim().max(80).optional(),
  modelo: z.string().trim().max(80).optional(),
  capacidadKg: optionalDecimal,
});

export const driverSchema = z.object({
  transportistaId: nullableId,
  nombre: z.string().trim().min(2).max(150),
  telefono: z.string().trim().max(50).optional(),
  licencia: z.string().trim().max(100).optional(),
});

export const deactivateTransportResourceSchema = z.object({
  motivo: z.string().trim().min(3).max(500),
});

export type ShipmentPlanningFormValues = z.infer<typeof shipmentPlanningSchema>;
export type ShipmentInternalAssignmentFormValues = z.infer<typeof shipmentInternalAssignmentSchema>;
export type ShipmentExternalAssignmentFormValues = z.infer<typeof shipmentExternalAssignmentSchema>;
export type ShipmentLoadFormValues = z.infer<typeof shipmentLoadSchema>;
export type ShipmentRouteFormValues = z.infer<typeof shipmentRouteSchema>;
export type ShipmentCancelFormValues = z.infer<typeof shipmentCancelSchema>;
export type ShipmentObservationFormValues = z.infer<typeof shipmentObservationSchema>;
export type ShipmentIncidentFormValues = z.infer<typeof shipmentIncidentSchema>;
export type ResolveShipmentIncidentFormValues = z.infer<typeof resolveShipmentIncidentSchema>;
export type CarrierFormValues = z.infer<typeof carrierSchema>;
export type VehicleFormValues = z.infer<typeof vehicleSchema>;
export type DriverFormValues = z.infer<typeof driverSchema>;
export type DeactivateTransportResourceFormValues = z.infer<typeof deactivateTransportResourceSchema>;
