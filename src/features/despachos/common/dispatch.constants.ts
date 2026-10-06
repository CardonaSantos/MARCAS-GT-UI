import type {
  DispatchEventType,
  DispatchOperationState,
  DispatchOperationType,
  DispatchSortField,
  DispatchState,
} from "../api/dispatch.types";

export const DISPATCH_STATES = [
  "PENDIENTE",
  "PREPARANDO",
  "PREPARADA",
  "PARCIALMENTE_DESPACHADA",
  "DESPACHADA",
  "CANCELADA",
] as const satisfies readonly DispatchState[];

export const DISPATCH_STATE_LABELS: Record<DispatchState, string> = {
  PENDIENTE: "Pendiente",
  PREPARANDO: "Preparando",
  PREPARADA: "Preparada",
  PARCIALMENTE_DESPACHADA: "Parcialmente despachada",
  DESPACHADA: "Despachada",
  CANCELADA: "Cancelada",
};

export const DISPATCH_STATE_TONES = {
  PENDIENTE: "warning",
  PREPARANDO: "info",
  PREPARADA: "primary",
  PARCIALMENTE_DESPACHADA: "warning",
  DESPACHADA: "success",
  CANCELADA: "danger",
} as const;

export const DISPATCH_OPERATION_TYPES = [
  "RESERVA_PREPARACION",
  "SALIDA_DESPACHO",
  "LIBERACION_RESERVA",
] as const satisfies readonly DispatchOperationType[];

export const DISPATCH_OPERATION_TYPE_LABELS: Record<
  DispatchOperationType,
  string
> = {
  RESERVA_PREPARACION: "Reserva de preparación",
  SALIDA_DESPACHO: "Salida de despacho",
  LIBERACION_RESERVA: "Liberación de reserva",
};

export const DISPATCH_OPERATION_STATES = [
  "PENDIENTE",
  "APLICANDO",
  "APLICADA",
  "FALLIDA",
] as const satisfies readonly DispatchOperationState[];

export const DISPATCH_OPERATION_STATE_LABELS: Record<
  DispatchOperationState,
  string
> = {
  PENDIENTE: "Pendiente",
  APLICANDO: "Aplicando",
  APLICADA: "Aplicada",
  FALLIDA: "Fallida",
};

export const DISPATCH_OPERATION_STATE_TONES = {
  PENDIENTE: "warning",
  APLICANDO: "info",
  APLICADA: "success",
  FALLIDA: "danger",
} as const;

export const DISPATCH_EVENT_TYPES = [
  "CREADA",
  "ACTUALIZADA",
  "PREPARACION_INICIADA",
  "PREPARACION_AJUSTADA",
  "PREPARADA",
  "DESPACHO_PARCIAL",
  "DESPACHADA",
  "CANCELADA",
  "OPERACION_FALLIDA",
  "OPERACION_REINTENTADA",
  "OBSERVACION",
] as const satisfies readonly DispatchEventType[];

export const DISPATCH_EVENT_LABELS: Record<DispatchEventType, string> = {
  CREADA: "Creada",
  ACTUALIZADA: "Actualizada",
  PREPARACION_INICIADA: "Preparación iniciada",
  PREPARACION_AJUSTADA: "Preparación ajustada",
  PREPARADA: "Preparada",
  DESPACHO_PARCIAL: "Despacho parcial",
  DESPACHADA: "Despachada",
  CANCELADA: "Cancelada",
  OPERACION_FALLIDA: "Operación fallida",
  OPERACION_REINTENTADA: "Operación reintentada",
  OBSERVACION: "Observación",
};

export const DISPATCH_SORT_FIELDS = [
  "creadoEn",
  "actualizadoEn",
  "numero",
  "estado",
  "programadoEn",
  "pedido",
  "cliente",
  "bodega",
  "preparadoEn",
  "despachadoEn",
] as const satisfies readonly DispatchSortField[];

export const DISPATCH_DETAIL_TABS = [
  "resumen",
  "productos",
  "operaciones",
  "actividad",
  "logistica",
] as const;

export type DispatchDetailTab = (typeof DISPATCH_DETAIL_TABS)[number];

export const DISPATCH_READ_ROLES = [
  "ADMIN",
  "BODEGA",
  "CONTABILIDAD",
  "VENDEDOR",
  "REPARTIDOR",
] as const;

export const DISPATCH_OPERATIVE_ROLES = ["ADMIN", "BODEGA"] as const;
