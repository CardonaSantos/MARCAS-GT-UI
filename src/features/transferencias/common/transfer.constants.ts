import type {
  TransferOperationState,
  TransferOperationType,
  TransferSortField,
  TransferState,
} from "../api/transfer.types";

export const TRANSFER_STATES = [
  "BORRADOR",
  "PREPARADA",
  "EN_TRANSITO",
  "RECIBIDA_PARCIAL",
  "RECIBIDA",
  "CANCELADA",
] as const satisfies readonly TransferState[];

export const TRANSFER_STATE_LABELS: Record<TransferState, string> = {
  BORRADOR: "Borrador",
  PREPARADA: "Lista para salida",
  EN_TRANSITO: "En tránsito",
  RECIBIDA_PARCIAL: "Recepción parcial",
  RECIBIDA: "Recibida",
  CANCELADA: "Cancelada",
};

export const TRANSFER_OPERATION_TYPES = [
  "SALIDA",
  "RECEPCION",
] as const satisfies readonly TransferOperationType[];

export const TRANSFER_OPERATION_TYPE_LABELS: Record<
  TransferOperationType,
  string
> = {
  SALIDA: "Salida",
  RECEPCION: "Recepción",
};

export const TRANSFER_OPERATION_STATES = [
  "PENDIENTE",
  "APLICADA",
  "FALLIDA",
] as const satisfies readonly TransferOperationState[];

export const TRANSFER_OPERATION_STATE_LABELS: Record<
  TransferOperationState,
  string
> = {
  PENDIENTE: "Pendiente",
  APLICADA: "Aplicada",
  FALLIDA: "Fallida",
};

export const TRANSFER_SORT_FIELDS = [
  "creadoEn",
  "actualizadoEn",
  "estado",
  "bodegaOrigen",
  "bodegaDestino",
  "creadoPor",
] as const satisfies readonly TransferSortField[];

export const TRANSFER_DETAIL_TABS = [
  "resumen",
  "productos",
  "operaciones",
  "actividad",
] as const;

export type TransferDetailTab = (typeof TRANSFER_DETAIL_TABS)[number];

export const transferStateTone = (state: TransferState) => {
  if (state === "RECIBIDA") return "success" as const;
  if (state === "EN_TRANSITO" || state === "RECIBIDA_PARCIAL") {
    return "info" as const;
  }
  if (state === "BORRADOR" || state === "PREPARADA") {
    return "warning" as const;
  }
  if (state === "CANCELADA") return "danger" as const;
  return "neutral" as const;
};

export const transferOperationTone = (state: TransferOperationState) => {
  if (state === "APLICADA") return "success" as const;
  if (state === "FALLIDA") return "danger" as const;
  return "warning" as const;
};
