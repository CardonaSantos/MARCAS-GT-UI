import type { PageResult } from "@/features/common/types/pagination.types";

export type PaymentMethod =
  | "EFECTIVO"
  | "TARJETA"
  | "TRANSFERENCIA_BANCO"
  | "DEPOSITO"
  | "CHEQUE"
  | "OTRO";

export type PaymentState =
  | "PENDIENTE"
  | "VERIFICADO"
  | "RECHAZADO"
  | "ANULADO";

export type PaymentApplicationState = "ACTIVA" | "REVERSADA";

export type PaymentEventType =
  | "CREADO"
  | "COMPROBANTE_AGREGADO"
  | "VERIFICADO"
  | "RECHAZADO"
  | "APLICADO"
  | "APLICACION_REVERTIDA"
  | "ANULADO"
  | "OBSERVACION";

export interface PaymentUser {
  id: number;
  nombre: string;
  correo?: string;
  rol: string;
}

export interface PaymentCustomer {
  id: number;
  nombre: string;
  apellido: string | null;
  telefono?: string;
  correo?: string | null;
}

export interface PaymentBank {
  id: number;
  nombre: string;
  codigo?: string | null;
  cuenta?: string | null;
  activo?: boolean;
}

export interface PaymentOrder {
  id: number;
  numero: string;
  estado?: string;
  condicionPago?: string;
  estadoPago?: string;
  total?: string;
  moneda?: string;
  vendedorId?: number;
}

export interface PaymentListItem {
  id: number;
  cliente: PaymentCustomer;
  pedido: PaymentOrder | null;
  banco: Pick<PaymentBank, "id" | "nombre"> | null;
  registradoPor: PaymentUser | null;
  metodo: PaymentMethod;
  estado: PaymentState;
  moneda: string;
  monto: string;
  montoAplicado: string;
  montoDisponible: string;
  referencia: string | null;
  fechaPago: string;
  comprobantes: number;
  creadoEn: string;
}

export interface PaymentProof {
  id: number;
  pagoId: number;
  url: string;
  key: string | null;
  mimeType: string | null;
  size: number | null;
  descripcion: string | null;
  claveIdempotencia: string | null;
  subidoPorId: number | null;
  subidoPor: PaymentUser | null;
  creadoEn: string;
  actualizadoEn?: string;
}

export interface PaymentApplication {
  id: number;
  pagoId: number;
  cuentaPorCobrarId: number;
  monto: string;
  estado: PaymentApplicationState;
  aplicadoPor: PaymentUser | null;
  revertidaEn: string | null;
  revertidaPor: PaymentUser | null;
  motivoReversion: string | null;
  claveIdempotencia: string | null;
  version: number;
  creadoEn: string;
  cuentaPorCobrar: {
    id: number;
    empresaId: number;
    clienteId: number;
    pedidoId: number | null;
    facturaId: number | null;
    creditoId: number | null;
    numeroDocumento: string | null;
    moneda: string;
    montoOriginal: string;
    saldoPendiente: string;
    fechaEmision: string;
    fechaVencimiento: string;
    estado: string;
    factura: {
      id: number;
      numero: string | null;
      serie: string | null;
      estado: string;
      total: string;
      emitidaEn?: string | null;
    } | null;
    credito: {
      id: number;
      numero: string;
      estado: string;
    } | null;
  };
}

export interface PaymentEvent {
  id: number;
  pagoId: number;
  usuarioId: number | null;
  tipo: PaymentEventType | string;
  estado: PaymentState;
  detalle: string | null;
  referenciaTipo: string | null;
  referenciaId: number | null;
  claveIdempotencia: string | null;
  metadata: unknown;
  creadoEn: string;
  usuario: PaymentUser | null;
}

export interface PaymentDetail {
  id: number;
  empresaId: number;
  cliente: PaymentCustomer;
  pedido: PaymentOrder | null;
  banco: PaymentBank | null;
  metodo: PaymentMethod;
  estado: PaymentState;
  moneda: string;
  monto: string;
  montoAplicado: string;
  montoDisponible: string;
  referencia: string | null;
  fechaPago: string;
  observaciones: string | null;
  verificadoEn: string | null;
  rechazadoEn: string | null;
  motivoRechazo: string | null;
  anuladoEn: string | null;
  motivoAnulacion: string | null;
  version: number;
  registradoPor: PaymentUser | null;
  verificadoPor: PaymentUser | null;
  rechazadoPor: PaymentUser | null;
  anuladoPor: PaymentUser | null;
  comprobantes: PaymentProof[];
  aplicaciones: PaymentApplication[];
  creadoEn: string;
  actualizadoEn: string;
  acciones: {
    puedeVerificar: boolean;
    puedeRechazar: boolean;
    puedeAplicar: boolean;
    puedeAnular: boolean;
    puedeAgregarComprobante: boolean;
  };
}

export interface ReceivableCandidate {
  id: number;
  empresaId: number;
  clienteId: number;
  pedido: {
    id: number;
    numero: string;
    vendedorId: number;
  } | null;
  factura: {
    id: number;
    numero: string | null;
    serie: string | null;
    estado: string;
    total: string;
  } | null;
  credito: {
    id: number;
    numero: string;
    estado: string;
  } | null;
  numeroDocumento: string | null;
  moneda: string;
  montoOriginal: string;
  saldoPendiente: string;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: string;
  montoMaximoAplicable: string;
}

export interface PaymentBankOption {
  id: number;
  nombre: string;
  codigo: string | null;
}

export interface PaymentSummary {
  total: number;
  porEstado: Partial<Record<PaymentState, number>>;
  porMetodo: Partial<Record<PaymentMethod, number>>;
  montos: {
    verificado: string;
    pendiente: string;
    disponibleNoAplicado: string;
  };
}

export interface PaymentListFilters {
  page: number;
  limit: number;
  search?: string;
  estado?: PaymentState;
  metodo?: PaymentMethod;
  clienteId?: number;
  pedidoId?: number;
  bancoId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  soloConSaldoDisponible?: boolean;
}

export interface PaymentRangeFilters {
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface RegisterPaymentPayload {
  clienteId: number;
  pedidoId?: number;
  bancoId?: number;
  metodo: PaymentMethod;
  moneda?: string;
  monto: string;
  referencia?: string;
  fechaPago?: string;
  observaciones?: string;
  claveIdempotencia: string;
}

export interface PaymentActionPayload {
  claveIdempotencia: string;
}

export interface PaymentReasonActionPayload extends PaymentActionPayload {
  motivo: string;
}

export interface AddPaymentProofPayload {
  url: string;
  key?: string;
  mimeType?: string;
  size?: number;
  descripcion?: string;
  claveIdempotencia: string;
}

export interface ApplyPaymentPayload {
  cuentaPorCobrarId: number;
  monto: string;
  claveIdempotencia: string;
}

export type PaymentPageResponse = PageResult<PaymentListItem>;
export type PaymentEventPageResponse = PageResult<PaymentEvent>;
export type PaymentApplicationPageResponse = PageResult<PaymentApplication>;
export type ReceivableCandidatePageResponse = PageResult<ReceivableCandidate>;
