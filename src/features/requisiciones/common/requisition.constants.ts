import type {
  RequisitionReceiptState,
  RequisitionSortField,
  RequisitionState,
} from "../api/requisition.types";

export const REQUISITION_STATES = [
  "BORRADOR",
  "SOLICITADA",
  "APROBADA",
  "RECHAZADA",
  "PARCIAL",
  "COMPLETADA",
  "CANCELADA",
] as const satisfies readonly RequisitionState[];

export const REQUISITION_STATE_LABELS: Record<RequisitionState, string> = {
  BORRADOR: "Borrador",
  SOLICITADA: "Solicitada",
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
  PARCIAL: "Recepción parcial",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
};

export const REQUISITION_RECEIPT_STATES = [
  "PENDIENTE",
  "APLICADA",
  "FALLIDA",
] as const satisfies readonly RequisitionReceiptState[];

export const REQUISITION_RECEIPT_STATE_LABELS: Record<
  RequisitionReceiptState,
  string
> = {
  PENDIENTE: "Pendiente",
  APLICADA: "Aplicada",
  FALLIDA: "Fallida",
};

export const REQUISITION_SORT_FIELDS = [
  "creadoEn",
  "actualizadoEn",
  "estado",
  "bodega",
  "proveedor",
  "solicitante",
] as const satisfies readonly RequisitionSortField[];

export const REQUISITION_DETAIL_TABS = [
  "resumen",
  "productos",
  "recepciones",
  "actividad",
] as const;

export type RequisitionDetailTab =
  (typeof REQUISITION_DETAIL_TABS)[number];

export const requisitionStateTone = (state: RequisitionState) => {
  if (state === "COMPLETADA") return "success" as const;
  if (state === "APROBADA" || state === "PARCIAL") return "info" as const;
  if (state === "SOLICITADA" || state === "BORRADOR") return "warning" as const;
  if (state === "RECHAZADA" || state === "CANCELADA") return "danger" as const;
  return "neutral" as const;
};

export const requisitionReceiptTone = (state: RequisitionReceiptState) => {
  if (state === "APLICADA") return "success" as const;
  if (state === "FALLIDA") return "danger" as const;
  return "warning" as const;
};
