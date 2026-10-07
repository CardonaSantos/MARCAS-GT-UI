import type {
  PaymentApplicationState,
  PaymentMethod,
  PaymentState,
} from "../api/payment.types";

export const PAYMENT_STATES = [
  "PENDIENTE",
  "VERIFICADO",
  "RECHAZADO",
  "ANULADO",
] as const satisfies readonly PaymentState[];

export const PAYMENT_STATE_LABELS: Record<PaymentState, string> = {
  PENDIENTE: "Pendiente",
  VERIFICADO: "Verificado",
  RECHAZADO: "Rechazado",
  ANULADO: "Anulado",
};

export const PAYMENT_STATE_TONES = {
  PENDIENTE: "warning",
  VERIFICADO: "success",
  RECHAZADO: "danger",
  ANULADO: "neutral",
} as const;

export const PAYMENT_METHODS = [
  "EFECTIVO",
  "TARJETA",
  "TRANSFERENCIA_BANCO",
  "DEPOSITO",
  "CHEQUE",
  "OTRO",
] as const satisfies readonly PaymentMethod[];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  EFECTIVO: "Efectivo",
  TARJETA: "Tarjeta",
  TRANSFERENCIA_BANCO: "Transferencia bancaria",
  DEPOSITO: "Depósito",
  CHEQUE: "Cheque",
  OTRO: "Otro",
};

export const BANK_REQUIRED_METHODS: readonly PaymentMethod[] = [
  "TRANSFERENCIA_BANCO",
  "DEPOSITO",
  "CHEQUE",
];

export const PAYMENT_APPLICATION_STATES = [
  "ACTIVA",
  "REVERSADA",
] as const satisfies readonly PaymentApplicationState[];

export const PAYMENT_APPLICATION_STATE_LABELS: Record<
  PaymentApplicationState,
  string
> = {
  ACTIVA: "Activa",
  REVERSADA: "Reversada",
};

export const PAYMENT_APPLICATION_STATE_TONES = {
  ACTIVA: "success",
  REVERSADA: "neutral",
} as const;

export const PAYMENT_DETAIL_TABS = [
  "resumen",
  "comprobantes",
  "aplicaciones",
  "actividad",
] as const;

export type PaymentDetailTab = (typeof PAYMENT_DETAIL_TABS)[number];
