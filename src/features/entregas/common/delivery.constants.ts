import type {
  DeliveryEvidenceType,
  DeliveryFailureReason,
  DeliverySortField,
  DeliveryState,
} from "../api/delivery.types";

export const DELIVERY_STATES = [
  "PENDIENTE",
  "EN_RUTA",
  "PARCIAL",
  "ENTREGADA",
  "RECHAZADA",
  "NO_ENTREGADA",
  "CANCELADA",
] as const satisfies readonly DeliveryState[];

export const DELIVERY_STATE_LABELS: Record<DeliveryState, string> = {
  PENDIENTE: "Pendiente",
  EN_RUTA: "En atención",
  PARCIAL: "Parcial",
  ENTREGADA: "Entregada",
  RECHAZADA: "Rechazada",
  NO_ENTREGADA: "No entregada",
  CANCELADA: "Cancelada",
};

export const DELIVERY_STATE_TONES = {
  PENDIENTE: "warning",
  EN_RUTA: "primary",
  PARCIAL: "warning",
  ENTREGADA: "success",
  RECHAZADA: "danger",
  NO_ENTREGADA: "danger",
  CANCELADA: "neutral",
} as const;

export const DELIVERY_FAILURE_REASONS = [
  "CLIENTE_AUSENTE",
  "DIRECCION_INCORRECTA",
  "LOCAL_CERRADO",
  "REPROGRAMADA",
  "RECHAZO_CLIENTE",
  "PROBLEMA_ACCESO",
  "DOCUMENTACION",
  "MERCADERIA_DANADA",
  "OTRO",
] as const satisfies readonly DeliveryFailureReason[];

export const DELIVERY_FAILURE_REASON_LABELS: Record<
  DeliveryFailureReason,
  string
> = {
  CLIENTE_AUSENTE: "Cliente ausente",
  DIRECCION_INCORRECTA: "Dirección incorrecta",
  LOCAL_CERRADO: "Local cerrado",
  REPROGRAMADA: "Reprogramada",
  RECHAZO_CLIENTE: "Rechazo del cliente",
  PROBLEMA_ACCESO: "Problema de acceso",
  DOCUMENTACION: "Documentación",
  MERCADERIA_DANADA: "Mercadería dañada",
  OTRO: "Otro",
};

export const DELIVERY_EVIDENCE_TYPES = [
  "FIRMA",
  "FOTO",
  "DOCUMENTO",
  "OTRO",
] as const satisfies readonly DeliveryEvidenceType[];

export const DELIVERY_EVIDENCE_TYPE_LABELS: Record<
  DeliveryEvidenceType,
  string
> = {
  FIRMA: "Firma",
  FOTO: "Fotografía",
  DOCUMENTO: "Documento",
  OTRO: "Otro",
};

export const DELIVERY_SORT_FIELDS = [
  "creadoEn",
  "actualizadoEn",
  "estado",
  "iniciadaEn",
  "finalizadaEn",
] as const satisfies readonly DeliverySortField[];

export const DELIVERY_DETAIL_TABS = [
  "resumen",
  "productos",
  "evidencias",
  "actividad",
  "tracking",
] as const;

export type DeliveryDetailTab = (typeof DELIVERY_DETAIL_TABS)[number];

export const DELIVERY_READ_ROLES = [
  "ADMIN",
  "BODEGA",
  "CONTABILIDAD",
  "VENDEDOR",
  "REPARTIDOR",
] as const;

export const DELIVERY_OPERATE_ROLES = ["ADMIN", "BODEGA", "REPARTIDOR"] as const;
