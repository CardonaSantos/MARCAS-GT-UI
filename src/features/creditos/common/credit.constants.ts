import type {
  CreditApplicationState,
  CreditDecisionType,
  CreditDocumentState,
  CreditDocumentType,
  CreditEventType,
  CreditIntegrationState,
  CreditReferenceResult,
  CreditReferenceType,
  CreditRequirementState,
  CreditSortField,
} from "../api/credit.types";

export const CREDIT_APPLICATION_STATES: readonly CreditApplicationState[] = [
  "PENDIENTE",
  "EN_REVISION",
  "APROBADA",
  "RECHAZADA",
  "CANCELADA",
];

export const CREDIT_APPLICATION_STATE_LABELS: Record<
  CreditApplicationState,
  string
> = {
  PENDIENTE: "Pendiente",
  EN_REVISION: "En revisión",
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
  CANCELADA: "Cancelada",
};

export const CREDIT_APPLICATION_STATE_TONES: Record<
  CreditApplicationState,
  "neutral" | "warning" | "success" | "danger" | "primary"
> = {
  PENDIENTE: "warning",
  EN_REVISION: "primary",
  APROBADA: "success",
  RECHAZADA: "danger",
  CANCELADA: "neutral",
};

export const CREDIT_REFERENCE_TYPES: readonly CreditReferenceType[] = [
  "PERSONAL",
  "COMERCIAL",
  "LABORAL",
  "OTRA",
];

export const CREDIT_REFERENCE_TYPE_LABELS: Record<
  CreditReferenceType,
  string
> = {
  PERSONAL: "Personal",
  COMERCIAL: "Comercial",
  LABORAL: "Laboral",
  OTRA: "Otra",
};

export const CREDIT_REFERENCE_RESULTS: readonly CreditReferenceResult[] = [
  "PENDIENTE",
  "VERIFICADA",
  "NO_VERIFICADA",
  "RECHAZADA",
];

export const CREDIT_REFERENCE_RESULT_LABELS: Record<
  CreditReferenceResult,
  string
> = {
  PENDIENTE: "Pendiente",
  VERIFICADA: "Verificada",
  NO_VERIFICADA: "No verificada",
  RECHAZADA: "Rechazada",
};

export const CREDIT_REFERENCE_RESULT_TONES: Record<
  CreditReferenceResult,
  "neutral" | "warning" | "success" | "danger"
> = {
  PENDIENTE: "warning",
  VERIFICADA: "success",
  NO_VERIFICADA: "neutral",
  RECHAZADA: "danger",
};

export const CREDIT_DOCUMENT_TYPES: readonly CreditDocumentType[] = [
  "DPI",
  "NIT",
  "ESTADO_CUENTA",
  "CONSTANCIA_INGRESOS",
  "PATENTE",
  "OTRO",
];

export const CREDIT_DOCUMENT_TYPE_LABELS: Record<
  CreditDocumentType,
  string
> = {
  DPI: "DPI",
  NIT: "NIT",
  ESTADO_CUENTA: "Estado de cuenta",
  CONSTANCIA_INGRESOS: "Constancia de ingresos",
  PATENTE: "Patente",
  OTRO: "Otro",
};

export const CREDIT_DOCUMENT_STATES: readonly CreditDocumentState[] = [
  "PENDIENTE",
  "VALIDADO",
  "RECHAZADO",
];

export const CREDIT_DOCUMENT_STATE_LABELS: Record<
  CreditDocumentState,
  string
> = {
  PENDIENTE: "Pendiente",
  VALIDADO: "Validado",
  RECHAZADO: "Rechazado",
};

export const CREDIT_DOCUMENT_STATE_TONES: Record<
  CreditDocumentState,
  "warning" | "success" | "danger"
> = {
  PENDIENTE: "warning",
  VALIDADO: "success",
  RECHAZADO: "danger",
};

export const CREDIT_REQUIREMENT_STATES: readonly CreditRequirementState[] = [
  "PENDIENTE",
  "CUMPLIDO",
  "NO_CUMPLE",
  "EXONERADO",
];

export const CREDIT_REQUIREMENT_STATE_LABELS: Record<
  CreditRequirementState,
  string
> = {
  PENDIENTE: "Pendiente",
  CUMPLIDO: "Cumplido",
  NO_CUMPLE: "No cumple",
  EXONERADO: "Exonerado",
};

export const CREDIT_REQUIREMENT_STATE_TONES: Record<
  CreditRequirementState,
  "warning" | "success" | "danger" | "neutral"
> = {
  PENDIENTE: "warning",
  CUMPLIDO: "success",
  NO_CUMPLE: "danger",
  EXONERADO: "neutral",
};

export const CREDIT_DECISION_TYPES: readonly CreditDecisionType[] = [
  "APROBADA",
  "RECHAZADA",
  "AJUSTADA",
];

export const CREDIT_DECISION_LABELS: Record<CreditDecisionType, string> = {
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
  AJUSTADA: "Aprobada con ajuste",
};

export const CREDIT_INTEGRATION_STATES: readonly CreditIntegrationState[] = [
  "PENDIENTE",
  "APLICADA",
  "FALLIDA",
];

export const CREDIT_INTEGRATION_LABELS: Record<
  CreditIntegrationState,
  string
> = {
  PENDIENTE: "Pendiente",
  APLICADA: "Aplicada",
  FALLIDA: "Fallida",
};

export const CREDIT_INTEGRATION_TONES: Record<
  CreditIntegrationState,
  "warning" | "success" | "danger"
> = {
  PENDIENTE: "warning",
  APLICADA: "success",
  FALLIDA: "danger",
};

export const CREDIT_EVENT_TYPES: readonly CreditEventType[] = [
  "CREADA",
  "ACTUALIZADA",
  "ENVIADA_REVISION",
  "REFERENCIA_AGREGADA",
  "REFERENCIA_ACTUALIZADA",
  "REFERENCIA_VERIFICADA",
  "DOCUMENTO_AGREGADO",
  "DOCUMENTO_VALIDADO",
  "DOCUMENTO_RECHAZADO",
  "REQUISITO_ACTUALIZADO",
  "APROBADA",
  "APROBADA_AJUSTADA",
  "RECHAZADA",
  "CANCELADA",
  "CREDITO_CREADO",
  "INTEGRACION_PEDIDO_APLICADA",
  "INTEGRACION_PEDIDO_FALLIDA",
  "OBSERVACION",
];

export const CREDIT_EVENT_LABELS: Record<CreditEventType, string> = {
  CREADA: "Creada",
  ACTUALIZADA: "Actualizada",
  ENVIADA_REVISION: "Enviada a revisión",
  REFERENCIA_AGREGADA: "Referencia agregada",
  REFERENCIA_ACTUALIZADA: "Referencia actualizada",
  REFERENCIA_VERIFICADA: "Referencia revisada",
  DOCUMENTO_AGREGADO: "Documento agregado",
  DOCUMENTO_VALIDADO: "Documento validado",
  DOCUMENTO_RECHAZADO: "Documento rechazado",
  REQUISITO_ACTUALIZADO: "Requisito actualizado",
  APROBADA: "Aprobada",
  APROBADA_AJUSTADA: "Aprobada con ajuste",
  RECHAZADA: "Rechazada",
  CANCELADA: "Cancelada",
  CREDITO_CREADO: "Crédito creado",
  INTEGRACION_PEDIDO_APLICADA: "Integración con pedido aplicada",
  INTEGRACION_PEDIDO_FALLIDA: "Integración con pedido fallida",
  OBSERVACION: "Observación",
};

export const CREDIT_SORT_FIELDS: readonly CreditSortField[] = [
  "solicitadaEn",
  "actualizadoEn",
  "numero",
  "estado",
  "cliente",
  "vendedor",
  "solicitante",
  "montoSolicitado",
  "plazoDias",
];

export const CREDIT_DETAIL_TABS = [
  "resumen",
  "requisitos",
  "referencias",
  "documentos",
  "financiero",
  "actividad",
] as const;

export type CreditDetailTab = (typeof CREDIT_DETAIL_TABS)[number];

export const CREDIT_READ_ROLES = [
  "ADMIN",
  "VENDEDOR",
  "CONTABILIDAD",
] as const;

export const CREDIT_WRITE_ROLES = ["ADMIN", "VENDEDOR"] as const;
export const CREDIT_REVIEW_ROLES = ["ADMIN", "CONTABILIDAD"] as const;


export const CREDIT_PAYMENT_PLAN_FREQUENCIES = [
  "SEMANAL",
  "QUINCENAL",
  "MENSUAL",
  "PERSONALIZADA",
] as const;

export const CREDIT_PAYMENT_PLAN_FREQUENCY_LABELS = {
  SEMANAL: "Semanal",
  QUINCENAL: "Quincenal",
  MENSUAL: "Mensual",
  PERSONALIZADA: "Personalizada",
} as const;

export const CREDIT_PORTFOLIO_DETAIL_TABS = [
  "resumen",
  "plan",
  "pagos",
  "cuentas",
  "facturacion",
  "actividad",
] as const;

export type CreditPortfolioDetailTab =
  (typeof CREDIT_PORTFOLIO_DETAIL_TABS)[number];
