import type { PageResult } from "@/features/common/types/pagination.types";

export type RequisitionState =
  | "BORRADOR"
  | "SOLICITADA"
  | "APROBADA"
  | "RECHAZADA"
  | "PARCIAL"
  | "COMPLETADA"
  | "CANCELADA";

export type RequisitionReceiptState = "PENDIENTE" | "APLICADA" | "FALLIDA";

export type RequisitionSortField =
  | "creadoEn"
  | "actualizadoEn"
  | "estado"
  | "bodega"
  | "proveedor"
  | "solicitante";

export type SortDirection = "asc" | "desc";

export interface RequisitionProductView {
  id: number;
  codigo: string;
  nombre: string;
}

export interface RequisitionWarehouseView {
  id: number;
  codigo: string;
  nombre: string;
  esPrincipal: boolean;
}

export interface RequisitionProviderView {
  id: number;
  nombre: string;
  telefono: string | null;
  correo: string | null;
}

export interface RequisitionUserView {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

export interface RequisitionProgressView {
  productos: number;
  unidadesSolicitadas: number;
  unidadesRecibidas: number;
  unidadesPendientes: number;
  porcentajeRecepcion: number;
  costoEstimado: string;
}

export interface RequisitionListItem {
  id: number;
  estado: RequisitionState;
  bodega: RequisitionWarehouseView;
  proveedor: RequisitionProviderView | null;
  solicitante: RequisitionUserView;
  progreso: RequisitionProgressView;
  observaciones: string | null;
  solicitadaEn: string | null;
  aprobadaEn: string | null;
  completadaEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface RequisitionDetailLine {
  id: number;
  producto: RequisitionProductView;
  cantidadSolicitada: number;
  cantidadRecibida: number;
  cantidadPendiente: number;
  porcentajeRecepcion: number;
  costoUnitarioEstimado: string | null;
  subtotalEstimado: string | null;
  version: number;
}

export interface RequisitionEvent {
  id: number;
  tipo: string;
  detalle: string | null;
  actor: RequisitionUserView | null;
  creadoEn: string;
}

export interface RequisitionReceiptLine {
  id: number;
  requisicionDetalleId: number;
  producto: RequisitionProductView;
  cantidad: number;
  costoUnitario: string;
  subtotal: string;
}

export interface RequisitionReceipt {
  id: number;
  requisicionId: number;
  estado: RequisitionReceiptState;
  recibidoPor: RequisitionUserView;
  claveIdempotencia: string;
  documentoReferencia: string | null;
  observaciones: string | null;
  recibidoEn: string;
  aplicadaEn: string | null;
  errorAplicacion: string | null;
  detalles: RequisitionReceiptLine[];
  unidades: number;
  costoTotal: string;
  creadoEn: string;
}

export interface RequisitionActions {
  puedeEditar: boolean;
  puedeSolicitar: boolean;
  puedeAprobar: boolean;
  puedeRechazar: boolean;
  puedeRecibir: boolean;
  puedeCancelar: boolean;
}

export interface RequisitionDetail extends RequisitionListItem {
  version: number;
  motivoRechazo: string | null;
  motivoCancelacion: string | null;
  rechazadaEn: string | null;
  canceladaEn: string | null;
  detalles: RequisitionDetailLine[];
  recepciones: RequisitionReceipt[];
  eventos: RequisitionEvent[];
  acciones: RequisitionActions;
}

export interface RequisitionSummary {
  total: number;
  borradores: number;
  solicitadas: number;
  aprobadas: number;
  parciales: number;
  completadas: number;
  rechazadas: number;
  canceladas: number;
  abiertas: number;
  unidadesSolicitadas: number;
  unidadesRecibidas: number;
  unidadesPendientes: number;
  costoEstimadoTotal: string;
  recepcionesPendientes: number;
  recepcionesFallidas: number;
}

export interface RequisitionListFilters {
  page: number;
  limit: number;
  search?: string;
  estado?: RequisitionState;
  bodegaDestinoId?: number;
  proveedorId?: number;
  solicitanteId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  soloPendientesRecepcion?: boolean;
  sortBy: RequisitionSortField;
  sortDir: SortDirection;
}

export interface RequisitionSummaryFilters {
  bodegaDestinoId?: number;
  proveedorId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface RequisitionEventFilters {
  page: number;
  limit: number;
}

export interface RequisitionReceiptFilters {
  page: number;
  limit: number;
  requisicionId?: number;
  bodegaDestinoId?: number;
  proveedorId?: number;
  recibidoPorId?: number;
  estado?: RequisitionReceiptState;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface RequisitionDraftLine {
  productoId: number | null;
  cantidadSolicitada: string;
  costoUnitarioEstimado: string;
}

export interface RequisitionDraft {
  bodegaDestinoId: number | null;
  proveedorId: number | null;
  observaciones: string;
  detalles: RequisitionDraftLine[];
}

export interface CreateRequisitionPayload {
  bodegaDestinoId: number;
  proveedorId?: number | null;
  observaciones?: string | null;
  detalles?: Array<{
    productoId: number;
    cantidadSolicitada: number;
    costoUnitarioEstimado?: string | null;
  }>;
}

export type UpdateRequisitionPayload = Partial<CreateRequisitionPayload>;

export interface RequisitionReasonPayload {
  motivo: string;
}

export interface RegisterRequisitionReceiptPayload {
  claveIdempotencia: string;
  documentoReferencia?: string | null;
  observaciones?: string | null;
  recibidoEn?: string | null;
  detalles: Array<{
    requisicionDetalleId: number;
    cantidad: number;
    costoUnitario: string;
  }>;
}

export interface RegisterRequisitionReceiptResponse {
  result: {
    repeated: boolean;
    receiptId: number;
    requisicionId: number;
    estado: RequisitionReceiptState;
  };
  requisicion: RequisitionDetail;
}

export type RequisitionPage = PageResult<RequisitionListItem>;
export type RequisitionReceiptPage = PageResult<RequisitionReceipt>;
export type RequisitionEventPage = PageResult<RequisitionEvent>;
