import type {
  OrderEventType,
  OrderPaymentCondition,
  OrderPaymentState,
  OrderSortField,
  OrderState,
} from "../api/order.types";

export const ORDER_STATES: readonly OrderState[] = [
  "BORRADOR",
  "PENDIENTE_VALIDACION",
  "CONFIRMADO",
  "EN_PREPARACION",
  "PARCIALMENTE_DESPACHADO",
  "DESPACHADO",
  "PARCIALMENTE_ENTREGADO",
  "ENTREGADO",
  "CANCELADO",
];

export const ORDER_PAYMENT_STATES: readonly OrderPaymentState[] = [
  "PENDIENTE",
  "PARCIAL",
  "PAGADO",
  "REEMBOLSADO",
  "ANULADO",
];

export const ORDER_PAYMENT_CONDITIONS: readonly OrderPaymentCondition[] = [
  "PREPAGO",
  "CONTRAENTREGA",
  "CREDITO",
];

export const ORDER_SORT_FIELDS: readonly OrderSortField[] = [
  "creadoEn",
  "actualizadoEn",
  "numero",
  "estado",
  "estadoPago",
  "cliente",
  "vendedor",
  "total",
];

export const ORDER_STATE_LABELS: Record<OrderState, string> = {
  BORRADOR: "Borrador",
  PENDIENTE_VALIDACION: "Pendiente de validación",
  CONFIRMADO: "Confirmado",
  EN_PREPARACION: "En preparación",
  PARCIALMENTE_DESPACHADO: "Parcialmente despachado",
  DESPACHADO: "Despachado",
  PARCIALMENTE_ENTREGADO: "Parcialmente entregado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export const ORDER_STATE_TONES: Record<
  OrderState,
  "neutral" | "warning" | "success" | "primary" | "danger"
> = {
  BORRADOR: "neutral",
  PENDIENTE_VALIDACION: "warning",
  CONFIRMADO: "primary",
  EN_PREPARACION: "primary",
  PARCIALMENTE_DESPACHADO: "warning",
  DESPACHADO: "primary",
  PARCIALMENTE_ENTREGADO: "warning",
  ENTREGADO: "success",
  CANCELADO: "danger",
};

export const ORDER_PAYMENT_STATE_LABELS: Record<OrderPaymentState, string> = {
  PENDIENTE: "Pendiente",
  PARCIAL: "Parcial",
  PAGADO: "Pagado",
  REEMBOLSADO: "Reembolsado",
  ANULADO: "Anulado",
};

export const ORDER_PAYMENT_STATE_TONES: Record<
  OrderPaymentState,
  "neutral" | "warning" | "success" | "danger" | "primary"
> = {
  PENDIENTE: "warning",
  PARCIAL: "primary",
  PAGADO: "success",
  REEMBOLSADO: "neutral",
  ANULADO: "danger",
};

export const ORDER_PAYMENT_CONDITION_LABELS: Record<
  OrderPaymentCondition,
  string
> = {
  PREPAGO: "Prepago",
  CONTRAENTREGA: "Contraentrega",
  CREDITO: "Crédito",
  MIXTO: "Mixto",
};

export const ORDER_EVENT_LABELS: Record<OrderEventType, string> = {
  CREADO: "Creado",
  ACTUALIZADO: "Actualizado",
  VALIDACION_SOLICITADA: "Validación solicitada",
  CONFIRMADO: "Confirmado",
  CREDITO_APROBADO: "Crédito aprobado",
  CREDITO_RECHAZADO: "Crédito rechazado",
  RESERVA_CREADA: "Reserva creada",
  RESERVA_LIBERADA: "Reserva liberada",
  PREPARACION_INICIADA: "Preparación iniciada",
  DESPACHO_PARCIAL: "Despacho parcial",
  DESPACHADO: "Despachado",
  ENTREGA_PARCIAL: "Entrega parcial",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
  OBSERVACION: "Observación",
};

export const ORDER_EVENT_FILTER_TYPES = [
  "CREADO",
  "ACTUALIZADO",
  "VALIDACION_SOLICITADA",
  "CONFIRMADO",
  "RESERVA_CREADA",
  "RESERVA_LIBERADA",
  "PREPARACION_INICIADA",
  "DESPACHO_PARCIAL",
  "DESPACHADO",
  "ENTREGA_PARCIAL",
  "ENTREGADO",
  "CANCELADO",
  "OBSERVACION",
] as const;

export const ORDER_DETAIL_TABS = [
  "resumen",
  "productos",
  "operacion",
  "actividad",
] as const;

export type OrderDetailTab = (typeof ORDER_DETAIL_TABS)[number];

export const ORDER_READ_ROLES = [
  "ADMIN",
  "VENDEDOR",
  "BODEGA",
  "CONTABILIDAD",
] as const;

export const ORDER_WRITE_ROLES = ["ADMIN", "VENDEDOR"] as const;
