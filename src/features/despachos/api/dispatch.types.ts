import type { PageResult } from "@/features/common/types/pagination.types";

export type DispatchState =
  | "PENDIENTE"
  | "PREPARANDO"
  | "PREPARADA"
  | "PARCIALMENTE_DESPACHADA"
  | "DESPACHADA"
  | "CANCELADA";

export type DispatchOperationType =
  | "RESERVA_PREPARACION"
  | "SALIDA_DESPACHO"
  | "LIBERACION_RESERVA";

export type DispatchOperationState =
  | "PENDIENTE"
  | "APLICANDO"
  | "APLICADA"
  | "FALLIDA";

export type DispatchEventType =
  | "CREADA"
  | "ACTUALIZADA"
  | "PREPARACION_INICIADA"
  | "PREPARACION_AJUSTADA"
  | "PREPARADA"
  | "DESPACHO_PARCIAL"
  | "DESPACHADA"
  | "CANCELADA"
  | "OPERACION_FALLIDA"
  | "OPERACION_REINTENTADA"
  | "OBSERVACION";

export type DispatchSortField =
  | "creadoEn"
  | "actualizadoEn"
  | "numero"
  | "estado"
  | "programadoEn"
  | "pedido"
  | "cliente"
  | "bodega"
  | "preparadoEn"
  | "despachadoEn";

export type SortDirection = "asc" | "desc";

export interface DispatchUser {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

export interface DispatchWarehouse {
  id: number;
  codigo: string;
  nombre: string;
  esPrincipal: boolean;
}

export interface DispatchCustomer {
  id: number;
  nombre: string;
  apellido: string | null;
  nombreCompleto: string;
  telefono: string;
  correo: string | null;
  direccion: string;
}

export interface DispatchProduct {
  id: number;
  codigo: string;
  nombre: string;
}

export interface DispatchProgress {
  productos: number;
  unidadesProgramadas: number;
  unidadesPreparadas: number;
  unidadesDespachadas: number;
  unidadesPendientesPreparacion: number;
  unidadesPendientesDespacho: number;
  porcentajePreparacion: number;
  porcentajeDespacho: number;
}

export interface DispatchTiming {
  creadoEn: string;
  programadoEn: string | null;
  preparacionIniciadaEn: string | null;
  preparadoEn: string | null;
  despachadoEn: string | null;
  canceladoEn: string | null;
  actualizadoEn: string;
  atrasado: boolean;
  horasAtraso: number;
  horasEsperaPreparacion: number | null;
  horasPreparacion: number | null;
  horasEsperaSalida: number | null;
  horasCicloTotal: number | null;
  horasDesdeActualizacion: number;
}

export interface DispatchListItem {
  id: number;
  numero: string;
  estado: DispatchState;
  pedido: {
    id: number;
    numero: string;
    estado: string;
    condicionPago: string;
    estadoPago: string;
    total: string;
    vendedor: DispatchUser;
  };
  cliente: DispatchCustomer;
  bodega: DispatchWarehouse;
  creadoPor: DispatchUser | null;
  preparadoPor: DispatchUser | null;
  despachadoPor: DispatchUser | null;
  progreso: DispatchProgress;
  tiempos: DispatchTiming;
  operaciones: {
    total: number;
    pendientes: number;
    aplicando: number;
    fallidas: number;
    ultimaOperacion: {
      id: number;
      tipo: DispatchOperationType;
      estado: DispatchOperationState;
      ocurridaEn: string;
    } | null;
  };
  observaciones: string | null;
  ultimaActividad: {
    tipo: DispatchEventType;
    actor: DispatchUser | null;
    creadoEn: string;
  } | null;
}

export interface DispatchEvent {
  id: number;
  tipo: DispatchEventType;
  detalle: string | null;
  actor: DispatchUser | null;
  referencia: { tipo: string; id: number } | null;
  metadata: unknown;
  creadoEn: string;
}

export interface DispatchOperation {
  id: number;
  ordenDespachoId: number;
  numeroDespacho: string;
  tipo: DispatchOperationType;
  estado: DispatchOperationState;
  usuario: DispatchUser;
  claveIdempotencia: string;
  observaciones: string | null;
  ocurridaEn: string;
  iniciadaEn: string | null;
  ultimoIntentoEn: string | null;
  aplicadaEn: string | null;
  fallidaEn: string | null;
  intentos: number;
  errorAplicacion: string | null;
  version: number;
  detalles: Array<{
    id: number;
    ordenDespachoDetalleId: number;
    producto: DispatchProduct;
    cantidad: number;
    estado: string;
    reservaInventarioId: number | null;
    movimientoInventarioId: number | null;
    claveIdempotencia: string;
    aplicadaEn: string | null;
    errorAplicacion: string | null;
    actualizadoEn: string;
  }>;
  unidades: number;
  creadoEn: string;
  actualizadoEn: string;
}

export interface DispatchDetail extends DispatchListItem {
  version: number;
  motivoCancelacion: string | null;
  canceladoPor: DispatchUser | null;
  detalles: Array<{
    id: number;
    pedidoDetalleId: number;
    producto: DispatchProduct;
    pedido: {
      cantidadSolicitada: number;
      cantidadReservada: number;
      cantidadDespachada: number;
      cantidadEntregada: number;
    };
    despacho: {
      cantidadProgramada: number;
      cantidadPreparada: number;
      cantidadDespachada: number;
      pendientePreparar: number;
      pendienteDespachar: number;
      porcentajePreparacion: number;
      porcentajeDespacho: number;
    };
    inventario: {
      stockId: number | null;
      real: number;
      reservado: number;
      disponible: number;
      reserva: {
        id: number;
        estado: string;
        cantidadOriginal: number;
        cantidadPendiente: number;
        cantidadAplicada: number;
        cantidadLiberada: number;
      } | null;
    };
    observaciones: string | null;
    version: number;
    creadoEn: string;
    actualizadoEn: string;
  }>;
  operacionesRecientes: DispatchOperation[];
  eventosRecientes: DispatchEvent[];
  envios: Array<{
    id: number;
    estado: string;
    guia: string | null;
    salidaEn: string | null;
    completadoEn: string | null;
    creadoEn: string;
  }>;
  entregas: Array<{
    id: number;
    estado: string;
    receptorNombre: string | null;
    entregadoEn: string | null;
    creadoEn: string;
  }>;
  acciones: {
    puedeEditar: boolean;
    puedeIniciarPreparacion: boolean;
    puedeActualizarPreparacion: boolean;
    puedeFinalizarPreparacion: boolean;
    puedeDespachar: boolean;
    puedeCancelar: boolean;
    puedeAgregarObservacion: boolean;
  };
  advertencias: Array<{
    codigo: string;
    nivel: "INFO" | "ADVERTENCIA" | "CRITICO";
    mensaje: string;
  }>;
}

export interface DispatchSummary {
  totalOrdenes: number;
  porEstado: Record<DispatchState, number>;
  abiertas: number;
  atrasadas: number;
  unidades: {
    programadas: number;
    preparadas: number;
    despachadas: number;
    pendientesPreparacion: number;
    pendientesDespacho: number;
  };
  porcentajes: {
    preparacion: number;
    despacho: number;
  };
  tiemposPromedioHoras: {
    esperaPreparacion: number | null;
    preparacion: number | null;
    esperaSalida: number | null;
    cicloCompleto: number | null;
  };
  operaciones: {
    total: number;
    pendientes: number;
    aplicando: number;
    aplicadas: number;
    fallidas: number;
  };
  hoy: {
    programadas: number;
    creadas: number;
    preparadas: number;
    despachadas: number;
    atrasadas: number;
    preparandoAhora: number;
    preparadasEsperandoSalida: number;
  };
  topBodegas: Array<{
    bodega: DispatchWarehouse;
    ordenes: number;
    unidadesDespachadas: number;
  }>;
  topOperadores: Array<{
    usuario: DispatchUser;
    operacionesAplicadas: number;
    unidadesProcesadas: number;
  }>;
}

export interface DispatchCandidate {
  pedido: {
    id: number;
    numero: string;
    estado: string;
    condicionPago: string;
    estadoPago: string;
    total: string;
    vendedor: DispatchUser;
    confirmadoEn: string | null;
    creadoEn: string;
  };
  cliente: DispatchCustomer;
  lineas: Array<{
    pedidoDetalleId: number;
    producto: DispatchProduct;
    cantidadSolicitada: number;
    cantidadReservada: number;
    cantidadDespachada: number;
    cantidadEntregada: number;
    cantidadProgramadaActiva: number;
    cantidadPendientePlanificar: number;
    disponibilidadBodega: {
      bodegaId: number;
      stockId: number | null;
      real: number;
      reservado: number;
      disponible: number;
      suficienteParaPendiente: boolean;
    } | null;
  }>;
  totales: {
    unidadesSolicitadas: number;
    unidadesDespachadas: number;
    unidadesProgramadasActivas: number;
    unidadesPendientesPlanificar: number;
  };
}

export interface DispatchOperationalReport {
  rango: {
    desde: string;
    hasta: string;
    dias: number;
  };
  puntualidad: {
    despachadas: number;
    aTiempo: number;
    tarde: number;
    sinProgramacion: number;
    porcentajeATiempo: number;
  };
  colaAbierta: {
    total: number;
    menos4h: number;
    de4a8h: number;
    de8a24h: number;
    de24a48h: number;
    mas48h: number;
  };
  confiabilidadOperaciones: {
    total: number;
    aplicadas: number;
    fallidas: number;
    conReintentos: number;
    tasaFallo: number;
    porcentajeConReintento: number;
    intentosPromedio: number;
  };
  tendenciaDiaria: Array<{
    fecha: string;
    creadas: number;
    preparadas: number;
    despachadas: number;
    unidadesDespachadas: number;
    fallosOperacion: number;
  }>;
  bodegas: Array<{
    bodega: DispatchWarehouse;
    ordenes: number;
    despachadas: number;
    unidadesDespachadas: number;
    porcentajeATiempo: number;
    horasPromedioPreparacion: number | null;
    horasPromedioCiclo: number | null;
  }>;
}

export interface DispatchListFilters {
  page: number;
  limit: number;
  search?: string;
  estado?: DispatchState;
  bodegaId?: number;
  pedidoId?: number;
  clienteId?: number;
  vendedorId?: number;
  creadoPorId?: number;
  preparadoPorId?: number;
  despachadoPorId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  programadoDesde?: string;
  programadoHasta?: string;
  soloPendientes?: boolean;
  soloAtrasados?: boolean;
  conPendientePreparacion?: boolean;
  conPendienteDespacho?: boolean;
  sortBy: DispatchSortField;
  sortDir: SortDirection;
}

export interface DispatchSummaryFilters {
  bodegaId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface DispatchCandidateFilters {
  page: number;
  limit: number;
  search?: string;
  bodegaId?: number;
  clienteId?: number;
  vendedorId?: number;
}

export interface DispatchEventFilters {
  page: number;
  limit: number;
  tipo?: DispatchEventType;
  usuarioId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface DispatchOperationFilters {
  page: number;
  limit: number;
  dispatchId?: number;
  tipo?: DispatchOperationType;
  estado?: DispatchOperationState;
  usuarioId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface DispatchOperationalReportFilters {
  bodegaId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface CreateDispatchPayload {
  pedidoId: number;
  bodegaId: number;
  programadoEn?: string | null;
  observaciones?: string | null;
  detalles: Array<{
    pedidoDetalleId: number;
    cantidadProgramada: number;
    observaciones?: string | null;
  }>;
}

export interface UpdateDispatchPayload {
  bodegaId?: number;
  programadoEn?: string | null;
  observaciones?: string | null;
  detalles?: CreateDispatchPayload["detalles"];
}

export interface StartDispatchPreparationPayload {
  claveIdempotencia: string;
  observaciones?: string | null;
  ocurridaEn?: string | null;
}

export interface UpdateDispatchPreparationPayload {
  detalles: Array<{
    detalleId: number;
    cantidadPreparada: number;
    observaciones?: string | null;
  }>;
}

export interface RegisterDispatchOutputPayload {
  claveIdempotencia: string;
  observaciones?: string | null;
  ocurridaEn?: string | null;
  detalles: Array<{
    detalleId: number;
    cantidad: number;
  }>;
}

export interface CancelDispatchPayload {
  motivo: string;
  claveIdempotencia: string;
  ocurridaEn?: string | null;
}

export interface DispatchObservationPayload {
  detalle: string;
}

export interface DispatchOperationResult {
  operationId: number | null;
  dispatchId: number;
  repeated: boolean;
  status: DispatchOperationState;
}

export interface DispatchOperationMutationResponse {
  result: DispatchOperationResult;
  despacho: DispatchDetail;
}

export type DispatchPageResponse = PageResult<DispatchListItem>;
export type DispatchCandidatePageResponse = PageResult<DispatchCandidate>;
export type DispatchEventPageResponse = PageResult<DispatchEvent>;
export type DispatchOperationPageResponse = PageResult<DispatchOperation>;
