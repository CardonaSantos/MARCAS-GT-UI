import type { PageResult } from "@/features/common/types/pagination.types";

export type TransferState =
  | "BORRADOR"
  | "PREPARADA"
  | "EN_TRANSITO"
  | "RECIBIDA_PARCIAL"
  | "RECIBIDA"
  | "CANCELADA";

export type TransferOperationType = "SALIDA" | "RECEPCION";
export type TransferOperationState = "PENDIENTE" | "APLICADA" | "FALLIDA";

export type TransferSortField =
  | "creadoEn"
  | "actualizadoEn"
  | "estado"
  | "bodegaOrigen"
  | "bodegaDestino"
  | "creadoPor";

export type SortDirection = "asc" | "desc";

export interface TransferWarehouseView {
  id: number;
  codigo: string;
  nombre: string;
  esPrincipal: boolean;
}

export interface TransferProductView {
  id: number;
  codigo: string;
  nombre: string;
}

export interface TransferUserView {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

export interface TransferProgressView {
  productos: number;
  unidadesSolicitadas: number;
  unidadesEnviadas: number;
  unidadesRecibidas: number;
  unidadesEnTransito: number;
  unidadesPendientesEnvio: number;
  porcentajeRecepcion: number;
}

export interface TransferListItem {
  id: number;
  estado: TransferState;
  bodegaOrigen: TransferWarehouseView;
  bodegaDestino: TransferWarehouseView;
  creadoPor: TransferUserView;
  progreso: TransferProgressView;
  observaciones: string | null;
  preparadaEn: string | null;
  enviadaEn: string | null;
  recibidaEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface TransferDetailLine {
  id: number;
  producto: TransferProductView;
  cantidadSolicitada: number;
  cantidadEnviada: number;
  cantidadRecibida: number;
  cantidadEnTransito: number;
  cantidadPendienteEnvio: number;
  porcentajeRecepcion: number;
  observaciones: string | null;
  version: number;
}

export interface TransferEvent {
  id: number;
  tipo: string;
  detalle: string | null;
  actor: TransferUserView | null;
  creadoEn: string;
}

export interface TransferOperationLine {
  id: number;
  transferenciaDetalleId: number;
  producto: TransferProductView;
  cantidad: number;
  costoUnitario: string | null;
  subtotal: string | null;
}

export interface TransferOperation {
  id: number;
  transferenciaId: number;
  tipo: TransferOperationType;
  estado: TransferOperationState;
  usuario: TransferUserView;
  claveIdempotencia: string;
  documentoReferencia: string | null;
  observaciones: string | null;
  ocurridaEn: string;
  aplicadaEn: string | null;
  errorAplicacion: string | null;
  version: number;
  detalles: TransferOperationLine[];
  unidades: number;
  costoTotal: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface TransferActions {
  puedeEditar: boolean;
  puedePreparar: boolean;
  puedeEnviar: boolean;
  puedeRecibir: boolean;
  puedeCancelar: boolean;
}

export interface TransferDetail extends TransferListItem {
  version: number;
  motivoCancelacion: string | null;
  canceladaEn: string | null;
  detalles: TransferDetailLine[];
  operaciones: TransferOperation[];
  eventos: TransferEvent[];
  acciones: TransferActions;
}

export interface TransferSummary {
  total: number;
  borradores: number;
  preparadas: number;
  enTransito: number;
  recibidasParcial: number;
  recibidas: number;
  canceladas: number;
  abiertas: number;
  unidadesSolicitadas: number;
  unidadesEnviadas: number;
  unidadesRecibidas: number;
  unidadesEnTransito: number;
  valorEnTransito: string;
  operacionesPendientes: number;
  operacionesFallidas: number;
}

export interface TransferListFilters {
  page: number;
  limit: number;
  search?: string;
  estado?: TransferState;
  bodegaOrigenId?: number;
  bodegaDestinoId?: number;
  creadoPorId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  soloPendientes?: boolean;
  sortBy: TransferSortField;
  sortDir: SortDirection;
}

export interface TransferSummaryFilters {
  bodegaOrigenId?: number;
  bodegaDestinoId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface TransferOperationFilters {
  page: number;
  limit: number;
  transferenciaId?: number;
  bodegaOrigenId?: number;
  bodegaDestinoId?: number;
  usuarioId?: number;
  tipo?: TransferOperationType;
  estado?: TransferOperationState;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface TransferEventFilters {
  page: number;
  limit: number;
}

export interface TransferDraftLine {
  productoId: number | null;
  cantidadSolicitada: string;
  observaciones: string;
}

export interface TransferDraft {
  bodegaOrigenId: number | null;
  bodegaDestinoId: number | null;
  observaciones: string;
  detalles: TransferDraftLine[];
}

export interface CreateTransferPayload {
  bodegaOrigenId: number;
  bodegaDestinoId: number;
  observaciones?: string | null;
  detalles?: Array<{
    productoId: number;
    cantidadSolicitada: number;
    observaciones?: string | null;
  }>;
}

export type UpdateTransferPayload = Partial<CreateTransferPayload>;

export interface TransferReasonPayload {
  motivo: string;
}

export interface TransferOperationBasePayload {
  claveIdempotencia: string;
  documentoReferencia?: string | null;
  observaciones?: string | null;
  ocurridaEn?: string | null;
}

export type RegisterTransferOutboundPayload = TransferOperationBasePayload;

export interface RegisterTransferReceiptPayload
  extends TransferOperationBasePayload {
  detalles: Array<{
    transferenciaDetalleId: number;
    cantidad: number;
  }>;
}

export interface RegisterTransferOperationResult {
  repeated: boolean;
  operationId: number;
  transferenciaId: number;
  estadoOperacion: TransferOperationState;
  estadoTransferencia: TransferState;
}

export interface TransferOperationMutationResponse {
  result: RegisterTransferOperationResult;
  transferencia: TransferDetail;
}

export type TransferPage = PageResult<TransferListItem>;
export type TransferOperationPage = PageResult<TransferOperation>;
export type TransferEventPage = PageResult<TransferEvent>;
