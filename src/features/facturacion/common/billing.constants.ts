import type {
  FiscalDocumentState,
  FiscalEnvironment,
  FiscalIdentityType,
  FiscalItemType,
  InvoiceSortField,
  InvoiceState,
  PaymentCondition,
  ReceivableState,
} from "../api/billing.types";

export const INVOICE_STATES = [
  "BORRADOR",
  "LISTA_EMISION",
  "EMITIDA",
  "DESCARTADA",
  "ANULADA",
] as const satisfies readonly InvoiceState[];

export const INVOICE_STATE_LABELS: Record<InvoiceState, string> = {
  BORRADOR: "Borrador",
  LISTA_EMISION: "Lista para emisión",
  EMITIDA: "Emitida",
  DESCARTADA: "Descartada",
  ANULADA: "Anulada",
};

export const INVOICE_STATE_TONES = {
  BORRADOR: "warning",
  LISTA_EMISION: "primary",
  EMITIDA: "success",
  DESCARTADA: "neutral",
  ANULADA: "danger",
} as const;

export const FISCAL_STATES = [
  "BORRADOR",
  "PREPARADO",
  "EN_PROCESO",
  "CERTIFICACION_INCIERTA",
  "CERTIFICADO",
  "RECHAZADO",
  "CONTINGENCIA",
  "ANULACION_PENDIENTE",
  "ANULADO",
] as const satisfies readonly FiscalDocumentState[];

export const FISCAL_STATE_LABELS: Record<FiscalDocumentState, string> = {
  BORRADOR: "Borrador",
  PREPARADO: "Preparado",
  EN_PROCESO: "En proceso",
  CERTIFICACION_INCIERTA: "Certificación incierta",
  CERTIFICADO: "Certificado",
  RECHAZADO: "Rechazado",
  CONTINGENCIA: "Contingencia",
  ANULACION_PENDIENTE: "Anulación pendiente",
  ANULADO: "Anulado",
};

export const FISCAL_STATE_TONES = {
  BORRADOR: "neutral",
  PREPARADO: "primary",
  EN_PROCESO: "primary",
  CERTIFICACION_INCIERTA: "warning",
  CERTIFICADO: "success",
  RECHAZADO: "danger",
  CONTINGENCIA: "warning",
  ANULACION_PENDIENTE: "warning",
  ANULADO: "neutral",
} as const;

export const PAYMENT_CONDITIONS = [
  "PREPAGO",
  "CONTRAENTREGA",
  "CREDITO",
  "MIXTO",
] as const satisfies readonly PaymentCondition[];

export const PAYMENT_CONDITION_LABELS: Record<PaymentCondition, string> = {
  PREPAGO: "Prepago",
  CONTRAENTREGA: "Contraentrega",
  CREDITO: "Crédito",
  MIXTO: "Mixto",
};

export const RECEIVABLE_STATES = [
  "PENDIENTE",
  "PARCIAL",
  "PAGADA",
  "VENCIDA",
  "ANULADA",
] as const satisfies readonly ReceivableState[];

export const RECEIVABLE_STATE_LABELS: Record<ReceivableState, string> = {
  PENDIENTE: "Pendiente",
  PARCIAL: "Parcial",
  PAGADA: "Pagada",
  VENCIDA: "Vencida",
  ANULADA: "Anulada",
};

export const RECEIVABLE_STATE_TONES = {
  PENDIENTE: "warning",
  PARCIAL: "primary",
  PAGADA: "success",
  VENCIDA: "danger",
  ANULADA: "neutral",
} as const;

export const FISCAL_ENVIRONMENTS = [
  "PRUEBAS",
  "PRODUCCION",
] as const satisfies readonly FiscalEnvironment[];

export const FISCAL_IDENTITY_TYPES = [
  "NIT",
  "CUI",
  "CF",
  "PASAPORTE",
  "OTRO",
] as const satisfies readonly FiscalIdentityType[];

export const FISCAL_ITEM_TYPES = [
  "BIEN",
  "SERVICIO",
] as const satisfies readonly FiscalItemType[];

export const INVOICE_SORT_FIELDS = [
  "creadoEn",
  "actualizadoEn",
  "estado",
  "total",
  "emitidaEn",
] as const satisfies readonly InvoiceSortField[];

export const INVOICE_DETAIL_TABS = [
  "resumen",
  "lineas",
  "fiscal",
  "actividad",
  "fel",
] as const;

export type InvoiceDetailTab = (typeof INVOICE_DETAIL_TABS)[number];
