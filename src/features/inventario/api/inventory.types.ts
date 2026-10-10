import type { PageResult } from "@/features/common/types/pagination.types";

export type InventoryUserRole =
  | "ADMIN"
  | "BODEGA"
  | "CONTABILIDAD"
  | "VENDEDOR"
  | "REPARTIDOR";

export type InventoryMovementType =
  | "MIGRACION_INICIAL"
  | "ENTRADA_RECEPCION"
  | "SALIDA_DESPACHO"
  | "RESERVA"
  | "LIBERACION_RESERVA"
  | "AJUSTE_ENTRADA"
  | "AJUSTE_SALIDA"
  | "TRANSFERENCIA_SALIDA"
  | "TRANSFERENCIA_ENTRADA"
  | "DEVOLUCION";

export type InventoryReservationState =
  | "ACTIVA"
  | "PARCIAL"
  | "APLICADA"
  | "LIBERADA"
  | "CANCELADA"
  | "FINALIZADA_MIXTA";

export type InventorySortField =
  | "producto"
  | "codigoProducto"
  | "bodega"
  | "cantidadReal"
  | "cantidadReservada"
  | "cantidadDisponible"
  | "costoPromedio"
  | "actualizadoEn";

export type SortDirection = "asc" | "desc";

export interface InventoryReference {
  type: string;
  id: number;
}

export interface InventoryProduct {
  id: number;
  codigo: string;
  nombre: string;
}

export interface InventoryBodega {
  id: number;
  codigo: string;
  nombre: string;
  esPrincipal: boolean;
}

export interface InventoryActor {
  id: number;
  nombre: string;
  correo: string;
  rol: InventoryUserRole;
  activo: boolean;
}

export interface InventoryStockListItem {
  id: number;
  producto: InventoryProduct;
  bodega: InventoryBodega;
  cantidadReal: number;
  cantidadReservada: number;
  cantidadDisponible: number;
  costoPromedio: string;
  valorInventario: string;
  version: number;
  creadoEn: string;
  actualizadoEn: string;
}

export interface InventoryMovement {
  id: number;
  tipo: InventoryMovementType;
  cantidad: number;
  costoUnitario: string | null;
  costoPromedioAntes: string;
  costoPromedioDespues: string;
  cantidadRealAntes: number;
  cantidadRealDespues: number;
  reservadaAntes: number;
  reservadaDespues: number;
  referencia: InventoryReference | null;
  claveIdempotencia: string | null;
  observaciones: string | null;
  actor: InventoryActor | null;
  creadoEn: string;
}

export interface InventoryReservation {
  id: number;
  pedidoDetalleId: number;
  pedidoId: number;
  producto: InventoryProduct;
  bodega: InventoryBodega;
  cantidadOriginal: number;
  cantidadPendiente: number;
  cantidadAplicada: number;
  cantidadLiberada: number;
  estado: InventoryReservationState;
  aplicadaEn: string | null;
  liberadaEn: string | null;
  cerradaEn: string | null;
  canceladaEn: string | null;
  version: number;
  creadoEn: string;
  actualizadoEn: string;
}

export interface InventoryStockDetail extends InventoryStockListItem {
  reservasActivas: InventoryReservation[];
  ultimosMovimientos: InventoryMovement[];
}

export interface ProductAvailability {
  producto: InventoryProduct;
  totales: {
    real: number;
    reservado: number;
    disponible: number;
  };
  bodegas: Array<{
    stockId: number;
    bodegaId: number;
    codigo: string;
    nombre: string;
    esPrincipal: boolean;
    real: number;
    reservado: number;
    disponible: number;
  }>;
}

export interface InventorySummary {
  totalRegistros: number;
  productosConExistencia: number;
  productosAgotados: number;
  cantidadRealTotal: number;
  cantidadReservadaTotal: number;
  cantidadDisponibleTotal: number;
  valorInventario: string;
}

export interface InventoryMutationMovementResult {
  tipo: InventoryMovementType;
  cantidad: number;
  costoUnitario: string | null;
  costoPromedioAntes: string;
  costoPromedioDespues: string;
  cantidadRealAntes: number;
  cantidadRealDespues: number;
  reservadaAntes: number;
  reservadaDespues: number;
}

export interface InventoryMutationResult {
  repeated: boolean;
  stockId: number;
  movimientoId: number;
  reservaId?: number | null;
  movimiento?: InventoryMutationMovementResult;
  snapshot: {
    cantidadReal: number;
    cantidadReservada: number;
    cantidadDisponible: number;
    costoPromedio: string;
  };
}

export interface InventoryListFilters {
  page: number;
  limit: number;
  search?: string;
  bodegaId?: number;
  productoId?: number;
  conExistencia?: boolean;
  conReservas?: boolean;
  sortBy: InventorySortField;
  sortDir: SortDirection;
}

export interface InventoryMovementFilters {
  page: number;
  limit: number;
  bodegaId?: number;
  productoId?: number;
  tipo?: InventoryMovementType;
  referenciaTipo?: string;
  referenciaId?: number;
  creadoPorId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface InventoryReservationFilters {
  page: number;
  limit: number;
  bodegaId?: number;
  productoId?: number;
  pedidoDetalleId?: number;
  estado?: InventoryReservationState;
}

export interface InventorySummaryFilters {
  bodegaId?: number;
}

export interface RegisterInventoryEntryPayload {
  bodegaId: number;
  productoId: number;
  cantidad: number;
  costoUnitario: string;
  proveedorId?: number | null;
  referenciaTipo?: string;
  referenciaId?: number;
  observaciones?: string | null;
  claveIdempotencia?: string | null;
}

export interface AdjustInventoryPayload {
  bodegaId: number;
  productoId: number;
  tipo: "ENTRADA" | "SALIDA";
  cantidad: number;
  costoUnitario?: string | null;
  motivo: string;
  claveIdempotencia?: string | null;
}

export interface RegisterInventoryReturnPayload {
  bodegaId: number;
  productoId: number;
  cantidad: number;
  costoUnitario?: string | null;
  referenciaTipo?: string;
  referenciaId?: number;
  observaciones?: string | null;
  claveIdempotencia?: string | null;
}

export interface ReserveInventoryPayload {
  pedidoDetalleId: number;
  bodegaId: number;
  cantidad: number;
  claveIdempotencia?: string | null;
}

export interface ReservationMutationPayload {
  cantidad: number;
  referenciaTipo?: string;
  referenciaId?: number;
  observaciones?: string | null;
  claveIdempotencia?: string | null;
}

export interface CancelReservationPayload {
  motivo: string;
  referenciaTipo?: string;
  referenciaId?: number;
  claveIdempotencia?: string | null;
}

export type InventoryPageResponse = PageResult<InventoryStockListItem>;
export type InventoryMovementPageResponse = PageResult<InventoryMovement>;
export type InventoryReservationPageResponse = PageResult<InventoryReservation>;

export interface InventoryOrderOption {
  id: number;
  numero: string;
  estado: string;
  cliente: {
    id: number;
    nombreCompleto: string;
  };
  progreso: {
    unidadesPendientesReserva: number;
  };
}

export interface InventoryOrderDetailLine {
  id: number;
  producto: InventoryProduct;
  cantidadSolicitada: number;
  cantidadReservada: number;
  cantidadDespachada: number;
  cantidadPendienteReserva: number;
}

export interface InventoryOrderDetail extends InventoryOrderOption {
  detalles: InventoryOrderDetailLine[];
}

export type InventoryOrderPageResponse = PageResult<InventoryOrderOption>;
