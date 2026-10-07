import type { PageResult } from "@/features/common/types/pagination.types";

export type TransportRole =
  | "ADMIN"
  | "VENDEDOR"
  | "BODEGA"
  | "CONTABILIDAD"
  | "REPARTIDOR";

export type ShipmentMode = "INTERNO" | "EXTERNO";

export type ShipmentState =
  | "PROGRAMADO"
  | "ASIGNADO"
  | "CARGADO"
  | "EN_RUTA"
  | "ENTREGADO_PARCIAL"
  | "COMPLETADO"
  | "INCIDENCIA"
  | "CANCELADO";

export type ShipmentStopState =
  | "PENDIENTE"
  | "EN_RUTA"
  | "ATENDIDA"
  | "INCIDENCIA"
  | "CANCELADA";

export type VehicleState =
  | "DISPONIBLE"
  | "RESERVADO"
  | "EN_RUTA"
  | "MANTENIMIENTO"
  | "FUERA_SERVICIO"
  | "INACTIVO";

export type DriverState = "DISPONIBLE" | "ASIGNADO" | "EN_RUTA" | "INACTIVO";

export type ShipmentIncidentType =
  | "AVERIA"
  | "ACCIDENTE"
  | "TRAFICO"
  | "BLOQUEO_RUTA"
  | "SEGURIDAD"
  | "DOCUMENTACION"
  | "CLIENTE_NO_DISPONIBLE"
  | "DIRECCION_INCORRECTA"
  | "MERCADERIA"
  | "OTRO";

export type ShipmentIncidentSeverity = "BAJA" | "MEDIA" | "ALTA" | "CRITICA";

export type ShipmentIncidentState = "ABIERTA" | "EN_ATENCION" | "RESUELTA";

export type ShipmentSortField =
  | "creadoEn"
  | "numero"
  | "estado"
  | "salidaProgramadaEn"
  | "salidaEn";

export type SortDirection = "asc" | "desc";

export interface TransportUser {
  id: number;
  nombre: string;
  correo?: string;
  rol: string;
  activo?: boolean;
}

export interface TransportWarehouse {
  id: number;
  codigo: string;
  nombre: string;
  direccion?: string | null;
}

export interface TransportCarrier {
  id: number;
  empresaId: number;
  codigo: string | null;
  tipo: ShipmentMode;
  nombre: string;
  telefono: string | null;
  correo: string | null;
  activo: boolean;
  motivoInactivacion: string | null;
  inactivadaEn: string | null;
  version: number;
  creadoEn: string;
  actualizadoEn: string;
}

export interface TransportVehicle {
  id: number;
  empresaId: number;
  transportistaId: number | null;
  placa: string;
  marca: string | null;
  modelo: string | null;
  capacidadKg: string | number | null;
  estado: VehicleState;
  activo: boolean;
  motivoInactivacion: string | null;
  inactivadaEn: string | null;
  version: number;
  creadoEn: string;
  actualizadoEn: string;
  transportista?: {
    id: number;
    nombre: string;
  } | null;
}

export interface TransportDriver {
  id: number;
  empresaId: number;
  transportistaId: number | null;
  nombre: string;
  telefono: string | null;
  licencia: string | null;
  estado: DriverState;
  activo: boolean;
  motivoInactivacion: string | null;
  inactivadaEn: string | null;
  version: number;
  creadoEn: string;
  actualizadoEn: string;
  transportista?: {
    id: number;
    nombre: string;
  } | null;
}

export interface ShipmentWarning {
  codigo:
    | "SALIDA_ATRASADA"
    | "INCIDENCIA_ABIERTA"
    | "SIN_VEHICULO"
    | "SIN_CONDUCTOR"
    | "SIN_RESPONSABLE";
  nivel: "ADVERTENCIA" | "CRITICO";
  mensaje: string;
}

export interface ShipmentProgress {
  paradas: number;
  paradasAtendidas: number;
  unidadesPlanificadas: number;
  unidadesCargadas: number;
}

export interface ShipmentListItem {
  id: number;
  numero: string;
  modalidad: ShipmentMode;
  estado: ShipmentState;
  salidaProgramadaEn: string | null;
  entregaEstimadaEn: string | null;
  salidaEn: string | null;
  completadoEn: string | null;
  costo: string | null;
  creadoEn: string;
  actualizadoEn: string;
  bodega: TransportWarehouse | null;
  transportista: Pick<TransportCarrier, "id" | "nombre" | "tipo"> | null;
  vehiculo: Pick<TransportVehicle, "id" | "placa" | "marca" | "modelo"> | null;
  conductor: Pick<TransportDriver, "id" | "nombre" | "telefono"> | null;
  responsable: Pick<TransportUser, "id" | "nombre" | "rol"> | null;
  progreso: ShipmentProgress;
  incidenciasAbiertas: number;
  advertencias: ShipmentWarning[];
}

export interface ShipmentLoad {
  id: number;
  ordenDespachoDetalleId: number;
  producto: {
    id: number;
    codigoProducto: string;
    nombre: string;
  };
  cantidadPlanificada: number;
  cantidadCargada: number;
  pendienteCargar: number;
  version: number;
}

export interface ShipmentStop {
  id: number;
  estado: ShipmentStopState;
  secuencia: number;
  destino: {
    destinatario: string;
    telefono: string | null;
    direccion: string;
    latitud: number | null;
    longitud: number | null;
  };
  cliente: {
    id: number;
    nombre: string;
    apellido: string | null;
    telefono: string;
  };
  ordenDespacho: {
    id: number;
    numero: string;
    estado: string;
    pedido: {
      id: number;
      numero: string;
      vendedor: {
        id: number;
        nombre: string;
      };
    };
  };
  cargas: ShipmentLoad[];
  entrega: {
    id: number;
    estado: string;
    entregadoEn: string | null;
  } | null;
}

export interface ShipmentEvent {
  id: number;
  envioId: number;
  usuarioId: number | null;
  tipo: string;
  estado: ShipmentState;
  descripcion: string | null;
  latitud: string | number | null;
  longitud: string | number | null;
  claveIdempotencia: string | null;
  metadata: unknown;
  creadoEn: string;
  usuario: {
    id: number;
    nombre: string;
    rol: string;
  } | null;
}

export interface ShipmentIncident {
  id: number;
  envioId: number;
  tipo: ShipmentIncidentType;
  severidad: ShipmentIncidentSeverity;
  estado: ShipmentIncidentState;
  descripcion: string;
  reportadaPorId: number | null;
  reportadaEn: string;
  latitud: string | number | null;
  longitud: string | number | null;
  resueltaPorId: number | null;
  resueltaEn: string | null;
  resolucion: string | null;
  version: number;
  creadoEn: string;
  actualizadoEn: string;
  reportadaPor: { id: number; nombre: string } | null;
  resueltaPor: { id: number; nombre: string } | null;
}

export interface ShipmentTrackingSnapshot {
  usuarioId: number;
  sesionId: number | null;
  sesionActiva: boolean;
  ultimoHeartbeatEn: string | null;
  latitud: number | null;
  longitud: number | null;
  precisionM: number | null;
  velocidadMps: number | null;
  bateriaPct: number | null;
  capturadoEn: string | null;
  stale: boolean;
}

export interface ShipmentDetail extends Omit<ShipmentListItem, "incidenciasAbiertas"> {
  empresaId: number;
  bodegaId: number | null;
  transportistaId: number | null;
  vehiculoId: number | null;
  conductorId: number | null;
  responsableId: number | null;
  creadoPorId: number | null;
  asignadoPorId: number | null;
  cargaConfirmadaPorId: number | null;
  iniciadoPorId: number | null;
  completadoPorId: number | null;
  canceladoPorId: number | null;
  asignadoEn: string | null;
  cargaConfirmadaEn: string | null;
  guia: string | null;
  trackingUrl: string | null;
  comprobanteUrl: string | null;
  entregadoTransportistaEn: string | null;
  canceladoEn: string | null;
  motivoCancelacion: string | null;
  observaciones: string | null;
  version: number;
  creadoPor: Pick<TransportUser, "id" | "nombre" | "rol"> | null;
  asignadoPor: Pick<TransportUser, "id" | "nombre" | "rol"> | null;
  cargaConfirmadaPor: Pick<TransportUser, "id" | "nombre" | "rol"> | null;
  iniciadoPor: Pick<TransportUser, "id" | "nombre" | "rol"> | null;
  completadoPor: Pick<TransportUser, "id" | "nombre" | "rol"> | null;
  canceladoPor: Pick<TransportUser, "id" | "nombre" | "rol"> | null;
  paradas: ShipmentStop[];
  eventos: ShipmentEvent[];
  incidencias: ShipmentIncident[];
  trackingActual: ShipmentTrackingSnapshot | null;
  acciones: {
    puedeEditar: boolean;
    puedeAsignar: boolean;
    puedeConfirmarCarga: boolean;
    puedeIniciarRuta: boolean;
    puedeCancelar: boolean;
    puedeReportarIncidencia: boolean;
    puedeAgregarObservacion: boolean;
  };
}

export interface ShipmentCandidate {
  despacho: {
    id: number;
    numero: string;
    estado: string;
    bodega: TransportWarehouse;
    pedido: {
      id: number;
      numero: string;
      vendedor: {
        id: number;
        nombre: string;
      };
    };
    cliente: {
      id: number;
      nombre: string;
      apellido: string | null;
      telefono: string;
      direccion: string;
    };
  };
  lineas: Array<{
    ordenDespachoDetalleId: number;
    producto: {
      id: number;
      codigoProducto: string;
      nombre: string;
    };
    cantidadPreparada: number;
    cantidadDespachada: number;
    cantidadYaPlanificada: number;
    cantidadYaCargada: number;
    cantidadPlanificable: number;
    cantidadCargable: number;
  }>;
}

export interface ShipmentSummary {
  total: number;
  porEstado: Partial<Record<ShipmentState, number>>;
  abiertas: number;
  unidades: {
    planificadas: number;
    cargadas: number;
  };
  incidenciasAbiertas: number;
  costoExterno: string;
}

export interface TransportOperationalReport {
  totalEnvios: number;
  modalidad: {
    internos: number;
    externos: number;
  };
  puntualidadSalida: {
    evaluados: number;
    aTiempo: number;
    tarde: number;
    porcentajeATiempo: number;
  };
  tiemposPromedioHoras: {
    creacionAAsignacion: number | null;
    asignacionACarga: number | null;
    cargaASalida: number | null;
    duracionRuta: number | null;
  };
  incidencias: {
    total: number;
    abiertas: number;
  };
  costoExterno: string;
}

export interface ShipmentListFilters {
  page: number;
  limit: number;
  search?: string;
  estado?: ShipmentState;
  modalidad?: ShipmentMode;
  bodegaId?: number;
  transportistaId?: number;
  vehiculoId?: number;
  conductorId?: number;
  responsableId?: number;
  clienteId?: number;
  conIncidencia?: boolean;
  soloAtrasados?: boolean;
  fechaDesde?: string;
  fechaHasta?: string;
  sortBy: ShipmentSortField;
  sortDir: SortDirection;
}

export interface ShipmentCandidateFilters {
  page: number;
  limit: number;
  search?: string;
  bodegaId?: number;
  clienteId?: number;
}

export interface TransportRangeFilters {
  bodegaId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface ShipmentHistoryFilters {
  page: number;
  limit: number;
}

export interface ShipmentIncidentFilters extends ShipmentHistoryFilters {
  estado?: ShipmentIncidentState;
}

export interface TransportCatalogFilters {
  search?: string;
  tipo?: ShipmentMode;
  estado?: VehicleState | DriverState;
}

export interface ShipmentPlanningStop {
  ordenDespachoId: number;
  secuencia: number;
  cargas: Array<{
    ordenDespachoDetalleId: number;
    cantidadPlanificada: number;
  }>;
}

export interface CreateShipmentPayload {
  bodegaId: number;
  modalidad: ShipmentMode;
  salidaProgramadaEn?: string | null;
  entregaEstimadaEn?: string | null;
  guia?: string | null;
  costo?: number;
  trackingUrl?: string | null;
  comprobanteUrl?: string | null;
  observaciones?: string | null;
  paradas: ShipmentPlanningStop[];
}

export interface AssignShipmentPayload {
  transportistaId?: number;
  vehiculoId?: number;
  conductorId?: number;
  responsableId?: number;
  claveIdempotencia: string;
}

export interface ConfirmShipmentLoadPayload {
  claveIdempotencia: string;
  lineas: Array<{
    cargaDetalleId: number;
    cantidadCargada: number;
  }>;
}

export interface StartShipmentRoutePayload {
  claveIdempotencia: string;
  latitud?: number;
  longitud?: number;
}

export interface CancelShipmentPayload {
  motivo: string;
  claveIdempotencia: string;
}

export interface ShipmentObservationPayload {
  detalle: string;
  claveIdempotencia?: string;
}

export interface ReportShipmentIncidentPayload {
  tipo: ShipmentIncidentType;
  severidad: ShipmentIncidentSeverity;
  descripcion: string;
  latitud?: number;
  longitud?: number;
  claveIdempotencia: string;
}

export interface ResolveShipmentIncidentPayload {
  resolucion: string;
  claveIdempotencia: string;
}

export interface CreateCarrierPayload {
  codigo?: string | null;
  tipo: ShipmentMode;
  nombre: string;
  telefono?: string | null;
  correo?: string | null;
}

export interface CreateVehiclePayload {
  transportistaId?: number;
  placa: string;
  marca?: string | null;
  modelo?: string | null;
  capacidadKg?: number;
}

export interface CreateDriverPayload {
  transportistaId?: number;
  nombre: string;
  telefono?: string | null;
  licencia?: string | null;
}

export interface DeactivateTransportResourcePayload {
  motivo: string;
}

export type ShipmentPageResponse = PageResult<ShipmentListItem>;
export type ShipmentCandidatePageResponse = PageResult<ShipmentCandidate>;
export type ShipmentEventPageResponse = PageResult<ShipmentEvent>;
export type ShipmentIncidentPageResponse = PageResult<ShipmentIncident>;
