import type { PageResult } from "@/features/common/types/pagination.types";

export type OrderState =
  | "BORRADOR"
  | "PENDIENTE_VALIDACION"
  | "CONFIRMADO"
  | "EN_PREPARACION"
  | "PARCIALMENTE_DESPACHADO"
  | "DESPACHADO"
  | "PARCIALMENTE_ENTREGADO"
  | "ENTREGADO"
  | "CANCELADO";

export type OrderPaymentCondition =
  | "PREPAGO"
  | "CONTRAENTREGA"
  | "CREDITO"
  | "MIXTO";

export type OrderPaymentState =
  | "PENDIENTE"
  | "PARCIAL"
  | "PAGADO"
  | "REEMBOLSADO"
  | "ANULADO";

export type OrderEventType =
  | "CREADO"
  | "ACTUALIZADO"
  | "VALIDACION_SOLICITADA"
  | "CONFIRMADO"
  | "CREDITO_APROBADO"
  | "CREDITO_RECHAZADO"
  | "RESERVA_CREADA"
  | "RESERVA_LIBERADA"
  | "PREPARACION_INICIADA"
  | "DESPACHO_PARCIAL"
  | "DESPACHADO"
  | "ENTREGA_PARCIAL"
  | "ENTREGADO"
  | "CANCELADO"
  | "OBSERVACION";

export type OrderSortField =
  | "creadoEn"
  | "actualizadoEn"
  | "numero"
  | "estado"
  | "estadoPago"
  | "cliente"
  | "vendedor"
  | "total";

export type SortDirection = "asc" | "desc";

export interface OrderCustomer {
  id: number;
  nombre: string;
  apellido: string | null;
  nombreCompleto: string;
  telefono: string;
  correo: string | null;
  direccion: string;
}

export interface OrderUser {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

export interface OrderProduct {
  id: number;
  codigo: string;
  nombre: string;
}

export interface OrderVisit {
  id: number;
  inicio: string;
  fin: string | null;
  estado: string;
}

export interface OrderProgress {
  productos: number;
  unidadesSolicitadas: number;
  unidadesReservadas: number;
  unidadesDespachadas: number;
  unidadesEntregadas: number;
  unidadesPendientesReserva: number;
  unidadesPendientesDespacho: number;
  unidadesPendientesEntrega: number;
  porcentajeReservado: number;
  porcentajeDespachado: number;
  porcentajeEntregado: number;
}

export interface OrderActions {
  puedeEditar: boolean;
  puedeSolicitarValidacion: boolean;
  puedeConfirmar: boolean;
  puedeCancelar: boolean;
  requiereCredito: boolean;
}

export interface OrderListItem {
  id: number;
  numero: string;
  estado: OrderState;
  condicionPago: OrderPaymentCondition;
  estadoPago: OrderPaymentState;
  cliente: OrderCustomer;
  vendedor: OrderUser;
  visita: OrderVisit | null;
  progreso: OrderProgress;
  subtotal: string;
  descuentoTotal: string;
  total: string;
  moneda: string;
  credito: {
    solicitudId: number;
    estado: string;
    montoSolicitado: string;
  } | null;
  despacho: {
    ordenId: number;
    estado: string;
    bodega: {
      id: number;
      codigo: string;
      nombre: string;
    };
    preparadoPor: OrderUser | null;
    preparadoEn: string | null;
    despachadoEn: string | null;
  } | null;
  entrega: {
    id: number;
    estado: string;
    entregadoEn: string | null;
  } | null;
  pagos: {
    cantidad: number;
    montoRegistrado: string;
    montoVerificado: string;
    montoPendienteEstimado: string;
  };
  factura: {
    id: number;
    estado: string;
    serie: string | null;
    numero: string | null;
    total: string;
    emitidaEn: string | null;
  } | null;
  observaciones: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface OrderDetailLine {
  id: number;
  producto: OrderProduct;
  cantidadSolicitada: number;
  cantidadReservada: number;
  cantidadDespachada: number;
  cantidadEntregada: number;
  cantidadPendienteReserva: number;
  cantidadPendienteDespacho: number;
  cantidadPendienteEntrega: number;
  porcentajeReservado: number;
  porcentajeDespachado: number;
  porcentajeEntregado: number;
  precioUnitario: string;
  descuento: string;
  subtotal: string;
  observaciones: string | null;
  version: number;
}

export interface OrderEvent {
  id: number;
  tipo: OrderEventType;
  detalle: string | null;
  actor: OrderUser | null;
  referencia: {
    tipo: string;
    id: number;
  } | null;
  creadoEn: string;
}

export interface OrderDetail extends OrderListItem {
  validacionSolicitadaEn: string | null;
  confirmadoEn: string | null;
  canceladoEn: string | null;
  motivoCancelacion: string | null;
  version: number;
  detalles: OrderDetailLine[];
  solicitudesCredito: Array<{
    id: number;
    estado: string;
    montoSolicitado: string;
    plazoDias: number;
    anticipoPropuesto: string;
    solicitadaEn: string;
    resueltaEn: string | null;
  }>;
  despachos: Array<{
    id: number;
    estado: string;
    bodega: {
      id: number;
      codigo: string;
      nombre: string;
    };
    preparadoPor: OrderUser | null;
    programadoEn: string | null;
    preparadoEn: string | null;
    despachadoEn: string | null;
    creadoEn: string;
  }>;
  entregas: Array<{
    id: number;
    estado: string;
    registradoPor: OrderUser | null;
    entregadoEn: string | null;
    creadoEn: string;
  }>;
  pagosDetalle: Array<{
    id: number;
    metodo: string;
    estado: string;
    monto: string;
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
  ultimosEventos: OrderEvent[];
  acciones: OrderActions;
}

export interface OrderSummary {
  totalPedidos: number;
  montos: {
    subtotal: string;
    descuentoTotal: string;
    total: string;
    pagadoVerificado: string;
    pendienteEstimado: string;
  };
  unidades: {
    solicitadas: number;
    reservadas: number;
    despachadas: number;
    entregadas: number;
  };
  porEstado: Record<OrderState, number>;
  porEstadoPago: Record<OrderPaymentState, number>;
  porCondicionPago: Record<OrderPaymentCondition, number>;
  topVendedores: Array<{
    vendedor: OrderUser;
    pedidos: number;
    monto: string;
  }>;
  topProductos: Array<{
    producto: OrderProduct;
    unidadesSolicitadas: number;
    montoNeto: string;
  }>;
}

export interface OrderListFilters {
  page: number;
  limit: number;
  search?: string;
  estado?: OrderState;
  estadoPago?: OrderPaymentState;
  condicionPago?: OrderPaymentCondition;
  clienteId?: number;
  vendedorId?: number;
  visitaId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  soloAbiertos?: boolean;
  sortBy: OrderSortField;
  sortDir: SortDirection;
}

export interface OrderSummaryFilters {
  estado?: OrderState;
  estadoPago?: OrderPaymentState;
  condicionPago?: OrderPaymentCondition;
  clienteId?: number;
  vendedorId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface OrderEventFilters {
  page: number;
  limit: number;
  tipo?: Exclude<OrderEventType, "CREDITO_APROBADO" | "CREDITO_RECHAZADO">;
  usuarioId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface OrderLinePayload {
  productoId: number;
  cantidadSolicitada: number;
  descuento?: string;
  observaciones?: string | null;
}

export interface CreateOrderPayload {
  clienteId: number;
  vendedorId?: number;
  visitaId?: number | null;
  condicionPago: OrderPaymentCondition;
  observaciones?: string | null;
  detalles?: OrderLinePayload[];
}

export type UpdateOrderPayload = Partial<CreateOrderPayload>;

export interface CancelOrderPayload {
  motivo: string;
}

export type OrderPageResponse = PageResult<OrderListItem>;
export type OrderEventPageResponse = PageResult<OrderEvent>;
