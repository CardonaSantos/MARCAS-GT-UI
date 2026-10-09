import type { PageResult } from "@/features/common/types/pagination.types";

export type CreditApplicationState =
  | "PENDIENTE"
  | "EN_REVISION"
  | "APROBADA"
  | "RECHAZADA"
  | "CANCELADA";

export type CreditReferenceType =
  | "PERSONAL"
  | "COMERCIAL"
  | "LABORAL"
  | "OTRA";

export type CreditReferenceResult =
  | "PENDIENTE"
  | "VERIFICADA"
  | "NO_VERIFICADA"
  | "RECHAZADA";

export type CreditDocumentType =
  | "DPI"
  | "NIT"
  | "ESTADO_CUENTA"
  | "CONSTANCIA_INGRESOS"
  | "PATENTE"
  | "OTRO";

export type CreditDocumentState =
  | "PENDIENTE"
  | "VALIDADO"
  | "RECHAZADO";

export type CreditRequirementState =
  | "PENDIENTE"
  | "CUMPLIDO"
  | "NO_CUMPLE"
  | "EXONERADO";

export type CreditDecisionType =
  | "APROBADA"
  | "RECHAZADA"
  | "AJUSTADA";

export type CreditIntegrationState =
  | "PENDIENTE"
  | "APLICADA"
  | "FALLIDA";

export type CreditEventType =
  | "CREADA"
  | "ACTUALIZADA"
  | "ENVIADA_REVISION"
  | "REFERENCIA_AGREGADA"
  | "REFERENCIA_ACTUALIZADA"
  | "REFERENCIA_VERIFICADA"
  | "DOCUMENTO_AGREGADO"
  | "DOCUMENTO_VALIDADO"
  | "DOCUMENTO_RECHAZADO"
  | "REQUISITO_ACTUALIZADO"
  | "APROBADA"
  | "APROBADA_AJUSTADA"
  | "RECHAZADA"
  | "CANCELADA"
  | "CREDITO_CREADO"
  | "INTEGRACION_PEDIDO_APLICADA"
  | "INTEGRACION_PEDIDO_FALLIDA"
  | "OBSERVACION";

export type CreditSortField =
  | "solicitadaEn"
  | "actualizadoEn"
  | "numero"
  | "estado"
  | "cliente"
  | "vendedor"
  | "solicitante"
  | "montoSolicitado"
  | "plazoDias";

export type SortDirection = "asc" | "desc";

export interface CreditUser {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

export interface CreditCustomer {
  id: number;
  nombre: string;
  apellido: string | null;
  nombreCompleto: string;
  telefono: string;
  correo: string | null;
  direccion: string;
}

export interface CreditOriginOrder {
  id: number;
  numero: string;
  estado: string;
  condicionPago: "CREDITO";
  estadoPago: string;
  total: string;
  creadoEn: string;
}

export interface CreditApplicationListItem {
  id: number;
  numero: string;
  estado: CreditApplicationState;
  origen: {
    tipo: "PEDIDO";
    pedido: CreditOriginOrder;
    visita: {
      id: number;
      inicio: string;
      fin: string | null;
      estado: string;
    } | null;
  };
  cliente: CreditCustomer;
  vendedor: CreditUser;
  solicitante: CreditUser;
  politica: {
    id: number;
    nombre: string;
  } | null;
  montos: {
    solicitado: string;
    anticipoPropuesto: string;
    autorizado: string | null;
    anticipoRequerido: string | null;
    financiado: string | null;
  };
  plazos: {
    solicitadoDias: number;
    autorizadoDias: number | null;
  };
  expediente: {
    requisitos: number;
    requisitosCumplidos: number;
    requisitosPendientes: number;
    requisitosNoCumplidos: number;
    referencias: number;
    referenciasVerificadas: number;
    referenciasPendientes: number;
    referenciasRechazadas: number;
    documentos: number;
    documentosValidados: number;
    documentosPendientes: number;
    documentosRechazados: number;
  };
  decision: {
    id: number;
    tipo: CreditDecisionType;
    decididoPor: CreditUser;
    observaciones: string | null;
    creadoEn: string;
  } | null;
  credito: {
    id: number;
    numero: string | null;
    estado: string;
    aprobadoPor: CreditUser | null;
    aprobadoEn: string | null;
  } | null;
  integracion: {
    id: number;
    tipo: string;
    estado: CreditIntegrationState;
    actor: CreditUser;
    intentos: number;
    ultimoError: string | null;
    creadoEn: string;
    actualizadoEn: string;
    aplicadaEn: string | null;
  } | null;
  pagos: {
    cantidad: number;
    montoRegistrado: string;
    montoVerificado: string;
    ultimoPagoEn: string | null;
  };
  cuentasPorCobrar: {
    cantidad: number;
    montoOriginal: string;
    saldoPendiente: string;
    vencidas: number;
  };
  fechas: {
    solicitadaEn: string;
    actualizadoEn: string;
    enRevisionEn: string | null;
    resueltaEn: string | null;
    canceladaEn: string | null;
  };
  ultimaActividad: {
    tipo: CreditEventType;
    actor: CreditUser | null;
    creadoEn: string;
  } | null;
  motivo: string | null;
  motivoCancelacion: string | null;
}

export interface CreditEvent {
  id: number;
  tipo: CreditEventType;
  detalle: string | null;
  actor: CreditUser | null;
  referencia: {
    tipo: string;
    id: number;
  } | null;
  creadoEn: string;
}

export interface CreditRequirement {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  obligatorio: boolean;
  estado: CreditRequirementState;
  observaciones: string | null;
  revisadoPor: CreditUser | null;
  revisadoEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreditReference {
  id: number;
  tipo: CreditReferenceType;
  nombre: string;
  telefono: string;
  relacion: string | null;
  resultado: CreditReferenceResult;
  observaciones: string | null;
  verificadoPor: CreditUser | null;
  verificadoEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreditDocument {
  id: number;
  tipo: CreditDocumentType;
  url: string;
  key: string | null;
  mimeType: string | null;
  size: number | null;
  estado: CreditDocumentState;
  observaciones: string | null;
  revisadoPor: CreditUser | null;
  revisadoEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreditAccount {
  id: number;
  numeroDocumento: string | null;
  montoOriginal: string;
  saldoPendiente: string;
  estado: string;
  fechaEmision: string;
  fechaVencimiento: string;
  aplicado: string;
}

export interface CreditPaymentDetail {
  id: number;
  metodo: string;
  estado: string;
  monto: string;
  referencia: string | null;
  fechaPago: string;
  verificadoEn: string | null;
  registradoPor: CreditUser | null;
}

export interface CreditInvoice {
  id: number;
  estado: string;
  serie: string | null;
  numero: string | null;
  total: string;
  emitidaEn: string | null;
  fechaVencimiento: string | null;
}

export interface CreditActions {
  puedeEditar: boolean;
  puedeEnviarRevision: boolean;
  puedeCancelar: boolean;
  puedeAgregarExpediente: boolean;
  puedeRevisarExpediente: boolean;
  puedeAprobar: boolean;
  puedeRechazar: boolean;
  puedeReintentarIntegracion: boolean;
}

export interface CreditDetail extends CreditApplicationListItem {
  version: number;
  requisitos: CreditRequirement[];
  referencias: CreditReference[];
  documentos: CreditDocument[];
  cuentas: CreditAccount[];
  pagosDetalle: CreditPaymentDetail[];
  facturas: CreditInvoice[];
  ultimosEventos: CreditEvent[];
  acciones: CreditActions;
}

export interface CreditSummary {
  totalSolicitudes: number;
  porEstado: Record<CreditApplicationState, number>;
  montos: {
    solicitado: string;
    autorizado: string;
    anticipoRequerido: string;
    financiado: string;
    cuentasOriginal: string;
    cuentasPendiente: string;
    pagadoAplicado: string;
  };
  promedios: {
    plazoSolicitadoDias: number | null;
    plazoAutorizadoDias: number | null;
    porcentajeAprobacion: number;
  };
  integraciones: {
    pendientes: number;
    aplicadas: number;
    fallidas: number;
  };
  topSolicitantes: Array<{
    usuario: CreditUser;
    solicitudes: number;
    montoSolicitado: string;
  }>;
  topClientes: Array<{
    cliente: {
      id: number;
      nombre: string;
      apellido: string | null;
      nombreCompleto: string;
    };
    solicitudes: number;
    montoSolicitado: string;
  }>;
  topPoliticas: Array<{
    politica: {
      id: number;
      nombre: string;
    };
    solicitudes: number;
    montoSolicitado: string;
  }>;
}

export interface CreditPolicyRequirement {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  obligatorio: boolean;
  orden: number;
  activo: boolean;
}

export interface CreditPolicy {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  montoMaximo: string | null;
  plazoMaximoDias: number | null;
  porcentajeAnticipo: string | null;
  motivoInactivacion: string | null;
  inactivadaEn: string | null;
  version: number;
  requisitos: CreditPolicyRequirement[];
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreditPortfolioItem {
  id: number;
  numero: string;
  estado: string;
  solicitud: {
    id: number;
    numero: string;
    estado: CreditApplicationState;
  };
  pedido: {
    id: number;
    numero: string;
    estado: string;
    condicionPago: "CREDITO";
    total: string;
  };
  cliente: CreditCustomer;
  vendedor: CreditUser;
  aprobadoPor: CreditUser | null;
  montos: {
    autorizado: string;
    anticipoRequerido: string;
    financiado: string;
    cuentaOriginal: string;
    saldoPendiente: string | null;
    pagadoAplicado: string;
  };
  plazoAutorizadoDias: number;
  cuentas: {
    cantidad: number;
    vencidas: number;
    proximoVencimiento: string | null;
  };
  aprobadoEn: string | null;
  cerradoEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreditListFilters {
  page: number;
  limit: number;
  search?: string;
  estado?: CreditApplicationState;
  clienteId?: number;
  solicitanteId?: number;
  vendedorId?: number;
  politicaId?: number;
  tipoDecision?: CreditDecisionType;
  integracionEstado?: CreditIntegrationState;
  condicionPago: "CREDITO";
  fechaDesde?: string;
  fechaHasta?: string;
  soloPendientes?: boolean;
  sortBy: CreditSortField;
  sortDir: SortDirection;
}

export interface CreditSummaryFilters {
  estado?: CreditApplicationState;
  clienteId?: number;
  solicitanteId?: number;
  vendedorId?: number;
  politicaId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface CreditEventFilters {
  page: number;
  limit: number;
  tipo?: CreditEventType;
  usuarioId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface CreditPolicyFilters {
  page: number;
  limit: number;
  search?: string;
  activo?: boolean;
}

export interface CreditPortfolioFilters {
  page: number;
  limit: number;
  search?: string;
  estado?: "ACTIVO" | "CERRADO";
  clienteId?: number;
  vendedorId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  conSaldoPendiente?: boolean;
}

export interface RequestCreditFromOrderPayload {
  plazoDias: number;
  politicaId?: number | null;
  motivo?: string | null;
}

export interface ApproveCreditWithSchedulePayload extends ApproveCreditPayload {
  plan: {
    frecuencia: "SEMANAL" | "QUINCENAL" | "MENSUAL";
    numeroCuotas: number;
    primeraFechaVencimiento: string;
  };
}

export interface CreateCreditApplicationPayload {
  pedidoId: number;
  politicaId?: number | null;
  montoSolicitado: string;
  plazoDias: number;
  motivo?: string | null;
}

export interface UpdateCreditApplicationPayload {
  politicaId?: number | null;
  montoSolicitado?: string;
  plazoDias?: number;
  motivo?: string | null;
}

export interface CreditReasonPayload {
  motivo: string;
  claveIdempotencia: string;
}

export interface AddCreditReferencePayload {
  tipo: CreditReferenceType;
  nombre: string;
  telefono: string;
  relacion?: string | null;
  observaciones?: string | null;
}

export interface UpdateCreditReferencePayload {
  nombre?: string;
  telefono?: string;
  relacion?: string | null;
  observaciones?: string | null;
}

export interface ReviewCreditReferencePayload {
  resultado: Exclude<CreditReferenceResult, "PENDIENTE">;
  observaciones?: string | null;
}

export interface AddCreditDocumentPayload {
  tipo: CreditDocumentType;
  url: string;
  key?: string | null;
  mimeType?: string | null;
  size?: number | null;
  observaciones?: string | null;
}

export interface ReviewCreditDocumentPayload {
  estado: Exclude<CreditDocumentState, "PENDIENTE">;
  observaciones?: string | null;
}

export interface ReviewCreditRequirementPayload {
  estado: Exclude<CreditRequirementState, "PENDIENTE">;
  observaciones?: string | null;
}

export interface ApproveCreditPayload {
  montoAutorizado: string;
  plazoAutorizadoDias: number;
  anticipoRequerido: "0.00";
  observaciones?: string | null;
  claveIdempotencia: string;
}

export interface CreditPolicyRequirementPayload {
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  obligatorio?: boolean;
  orden?: number;
  activo?: boolean;
}

export interface CreateCreditPolicyPayload {
  nombre: string;
  descripcion?: string | null;
  montoMaximo?: string | null;
  plazoMaximoDias?: number | null;
  requisitos?: CreditPolicyRequirementPayload[];
}

export type UpdateCreditPolicyPayload = Partial<CreateCreditPolicyPayload>;

export interface CreditPolicyStatusPayload {
  activo: boolean;
  motivo?: string | null;
}

export type CreditPageResponse = PageResult<CreditApplicationListItem>;
export type CreditEventPageResponse = PageResult<CreditEvent>;
export type CreditPolicyPageResponse = PageResult<CreditPolicy>;
export type CreditPortfolioPageResponse = PageResult<CreditPortfolioItem>;


export type CreditPaymentPlanState = "BORRADOR" | "ACTIVO" | "CANCELADO";
export type CreditPaymentPlanFrequency =
  | "SEMANAL"
  | "QUINCENAL"
  | "MENSUAL"
  | "PERSONALIZADA";

export interface CreditPortfolioDetail {
  id: number;
  numero: string;
  estado: "ACTIVO" | "CERRADO";
  cliente: CreditCustomer;
  vendedor: CreditUser;
  aprobadoPor: CreditUser | null;
  solicitud: {
    id: number;
    numero: string;
    estado: CreditApplicationState;
  };
  pedido: {
    id: number;
    numero: string;
    estado: string;
    condicionPago: string;
    estadoPago: string;
    moneda: string;
    total: string;
  };
  montos: {
    autorizado: string;
    anticipoRequerido: string;
    financiado: string;
    pagadoVerificado: string;
    pagadoAplicado: string;
    saldoPendiente: string | null;
  };
  plazoAutorizadoDias: number;
  aprobadoEn: string | null;
  cerradoEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
  planPago: null | {
    id: number;
    estado: CreditPaymentPlanState;
    frecuencia: CreditPaymentPlanFrequency;
    montoProgramado: string;
    numeroCuotas: number;
    primeraFechaVencimiento: string;
    activadoEn: string | null;
    version: number;
    cuotas: Array<{
      id: number;
      numero: number;
      montoProgramado: string;
      fechaVencimiento: string;
      estado: string;
      cuentaPorCobrarId: number | null;
      montoPagado: string;
      saldoPendiente: string;
    }>;
    eventos: Array<{
      id: number;
      tipo: string;
      estado: CreditPaymentPlanState;
      detalle: string | null;
      actor: CreditUser | null;
      creadoEn: string;
    }>;
  };
  cuentasPorCobrar: Array<{
    id: number;
    numeroDocumento: string | null;
    estado: string;
    montoOriginal: string;
    saldoPendiente: string;
    fechaEmision: string;
    fechaVencimiento: string;
    cuotaNumero: number | null;
  }>;
  pagos: Array<{
    id: number;
    metodo: string;
    estado: string;
    monto: string;
    montoAplicado: string;
    montoDisponible: string;
    referencia: string | null;
    fechaPago: string;
    verificadoEn: string | null;
  }>;
  facturas: Array<{
    id: number;
    estado: string;
    serie: string | null;
    numero: string | null;
    total: string;
    emitidaEn: string | null;
    fechaVencimiento: string | null;
  }>;
  acciones: {
    puedeGestionarPlan: boolean;
    puedeActivarPlan: boolean;
  };
}

export interface CreditPlanInstallmentPayload {
  fechaVencimiento: string;
  montoProgramado: string;
}

export interface CreateCreditPaymentPlanPayload {
  frecuencia: CreditPaymentPlanFrequency;
  cuotas: CreditPlanInstallmentPayload[];
  claveIdempotencia: string;
}

export interface UpdateCreditPaymentPlanPayload
  extends CreateCreditPaymentPlanPayload {
  expectedVersion: number;
}

export interface ActivateCreditPaymentPlanPayload {
  expectedVersion: number;
  claveIdempotencia: string;
}

export interface CreditPaymentPlanResponse {
  id: number;
  empresaId: number;
  creditoId: number;
  estado: CreditPaymentPlanState;
  frecuencia: CreditPaymentPlanFrequency;
  montoProgramado: string;
  numeroCuotas: number;
  primeraFechaVencimiento: string;
  version: number;
  activadoEn: string | null;
  cuotas: Array<{
    id: number;
    numero: number;
    montoProgramado: string;
    fechaVencimiento: string;
    cuentaPorCobrarId: number | null;
  }>;
}
