import type { PageResult } from "@/features/common/types/pagination.types";

export type DeliveryState =
  | "PENDIENTE"
  | "EN_RUTA"
  | "PARCIAL"
  | "ENTREGADA"
  | "RECHAZADA"
  | "NO_ENTREGADA"
  | "CANCELADA";

export type DeliveryFailureReason =
  | "CLIENTE_AUSENTE"
  | "DIRECCION_INCORRECTA"
  | "LOCAL_CERRADO"
  | "REPROGRAMADA"
  | "RECHAZO_CLIENTE"
  | "PROBLEMA_ACCESO"
  | "DOCUMENTACION"
  | "MERCADERIA_DANADA"
  | "OTRO";

export type DeliveryEvidenceType = "FIRMA" | "FOTO" | "DOCUMENTO" | "OTRO";

export type DeliveryEventType =
  | "CREADA"
  | "INICIADA"
  | "ENTREGA_PARCIAL"
  | "ENTREGADA"
  | "RECHAZADA"
  | "NO_ENTREGADA"
  | "CANCELADA"
  | "EVIDENCIA_AGREGADA"
  | "OBSERVACION";

export type DeliverySortField =
  | "creadoEn"
  | "actualizadoEn"
  | "estado"
  | "iniciadaEn"
  | "finalizadaEn";

export type SortDirection = "asc" | "desc";

export interface DeliveryUser {
  id: number;
  nombre: string;
  correo?: string;
  rol: string;
}

export interface DeliveryProduct {
  id: number;
  codigo: string;
  nombre: string;
}

export interface DeliveryEvidence {
  id: number;
  entregaId: number;
  tipo: DeliveryEvidenceType;
  url: string;
  key: string | null;
  mimeType: string | null;
  size: number | null;
  descripcion: string | null;
  claveIdempotencia: string | null;
  creadoEn: string;
  actualizadoEn?: string;
}

export interface DeliveryEvent {
  id: number;
  entregaId: number;
  usuarioId: number | null;
  tipo: DeliveryEventType | string;
  estado: DeliveryState;
  detalle: string | null;
  referenciaTipo: string | null;
  referenciaId: number | null;
  claveIdempotencia: string | null;
  metadata: unknown;
  creadoEn: string;
  usuario: DeliveryUser | null;
}

export interface DeliveryLine {
  id: number;
  producto: DeliveryProduct;
  pedidoDetalleId: number;
  ordenDespachoDetalleId: number;
  solicitado: number;
  despachadoAcumulado: number;
  entregadoAcumulado: number;
  cargadoIntento: number;
  entregadoIntento: number;
  rechazadoIntento: number;
  motivoRechazo: string | null;
  pendientePedido: number;
}

export interface DeliveryTrackingSnapshot {
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

export interface DeliveryView {
  id: number;
  estado: DeliveryState;
  version: number;
  pedido: {
    id: number;
    numero: string;
    estado: string;
    condicionPago: string;
    estadoPago: string;
    total: string;
    vendedor: DeliveryUser | null;
  };
  cliente: {
    id: number;
    nombre: string;
    apellido: string | null;
    nombreCompleto: string;
    telefono: string;
    correo: string | null;
    direccion: string;
  };
  despacho: {
    id: number;
    numero: string;
    estado: string;
    bodega: {
      id: number;
      codigo: string;
      nombre: string;
      direccion?: string | null;
    } | null;
  };
  transporte: {
    envioDespachoId: number;
    secuencia: number;
    paradaEstado: string;
    destino: {
      destinatario: string;
      telefono: string | null;
      direccion: string;
      latitud: number | null;
      longitud: number | null;
    };
    envio: {
      id: number;
      numero: string;
      estado: string;
      modalidad: "INTERNO" | "EXTERNO";
      salidaProgramadaEn: string | null;
      entregaEstimadaEn: string | null;
      salidaEn: string | null;
    };
    transportista: { id: number; nombre: string } | null;
    vehiculo: { id: number; placa: string; marca?: string | null; modelo?: string | null } | null;
    conductor: { id: number; nombre: string; telefono?: string | null } | null;
    responsable: DeliveryUser | null;
  } | null;
  registradoPor: DeliveryUser | null;
  receptor: {
    nombre: string | null;
    documento: string | null;
  };
  resultado: {
    unidadesCargadas: number;
    unidadesEntregadas: number;
    unidadesRechazadas: number;
    unidadesSinResolver: number;
    porcentajeAceptacion: number;
  };
  ubicacion: {
    entrega: { latitud: number; longitud: number } | null;
    destino: { latitud: number; longitud: number } | null;
    distanciaDestinoMetros: number | null;
    dentroRadioEsperado: boolean | null;
  };
  evidencias: {
    total: number;
    tieneFirma: boolean;
    fotos: number;
    documentos: number;
    items: DeliveryEvidence[];
  };
  tiempos: {
    creadoEn: string;
    iniciadaEn: string | null;
    entregadoEn: string | null;
    finalizadaEn: string | null;
    actualizadoEn: string;
    duracionHoras: number | null;
  };
  motivoNoEntrega: DeliveryFailureReason | null;
  detalleNoEntrega: string | null;
  observaciones: string | null;
  factura: Record<string, unknown> | null;
  facturas: Array<Record<string, unknown>>;
  detalles: DeliveryLine[];
  eventosRecientes: DeliveryEvent[];
  acciones: {
    puedeIniciar: boolean;
    puedeEditarResultado: boolean;
    puedeAgregarEvidencia: boolean;
    puedeEliminarEvidencia: boolean;
    puedeFinalizar: boolean;
    puedeAgregarObservacion: boolean;
  };
  advertencias: Array<{
    codigo:
      | "SIN_EVIDENCIA"
      | "SIN_FIRMA"
      | "SIN_GPS"
      | "FUERA_RADIO_DESTINO"
      | "CONTRAENTREGA_PENDIENTE_COBRO"
      | "ENTREGA_SIN_FACTURAR";
    nivel: "INFO" | "ADVERTENCIA" | "CRITICO";
    mensaje: string;
  }>;
  trackingActual: DeliveryTrackingSnapshot | null;
}

export interface DeliveryCandidate {
  envioDespachoId: number;
  secuencia: number;
  paradaEstado: string;
  envio: {
    id: number;
    numero: string;
    estado: string;
    modalidad: "INTERNO" | "EXTERNO";
    salidaProgramadaEn: string | null;
    entregaEstimadaEn: string | null;
    salidaEn: string | null;
    responsable: DeliveryUser | null;
    transportista: { id: number; nombre: string } | null;
    vehiculo: { id: number; placa: string; marca?: string | null; modelo?: string | null } | null;
    conductor: { id: number; nombre: string; telefono?: string | null } | null;
  };
  cliente: {
    id: number;
    nombre: string;
    apellido: string | null;
    telefono: string;
    direccion: string;
  };
  pedido: {
    id: number;
    numero: string;
    estado: string;
    vendedor: DeliveryUser | null;
  };
  despacho: {
    id: number;
    numero: string;
    bodega: {
      id: number;
      codigo: string;
      nombre: string;
    } | null;
  };
  destino: {
    destinatario: string;
    telefono: string | null;
    direccion: string;
    latitud: number | null;
    longitud: number | null;
  };
  carga: Array<{
    id: number;
    producto: {
      id: number;
      codigo: string;
      nombre: string;
    };
    cantidadPlanificada: number;
    cantidadCargada: number;
  }>;
  unidadesCargadas: number;
  entregaActual: {
    id: number;
    estado: DeliveryState;
  } | null;
}

export interface DeliveryListFilters {
  page: number;
  limit: number;
  search?: string;
  estado?: DeliveryState;
  pedidoId?: number;
  ordenDespachoId?: number;
  envioDespachoId?: number;
  clienteId?: number;
  registradoPorId?: number;
  motivoNoEntrega?: DeliveryFailureReason;
  soloPendientes?: boolean;
  soloSinFactura?: boolean;
  fechaDesde?: string;
  fechaHasta?: string;
  sortBy: DeliverySortField;
  sortDir: SortDirection;
}

export interface DeliveryCandidateFilters {
  page: number;
  limit: number;
  clienteId?: number;
}

export interface DeliveryRangeFilters {
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface DeliveryEventFilters {
  page: number;
  limit: number;
  tipo?: string;
  usuarioId?: number;
}

export interface DeliverySummary {
  total: number;
  porEstado: Partial<Record<DeliveryState, number>>;
  activas: number;
  finalizadas: number;
  efectividad: {
    completas: number;
    parciales: number;
    rechazadas: number;
    noEntregadas: number;
    porcentajeExito: number;
  };
  unidades: {
    cargadas: number;
    entregadas: number;
    rechazadas: number;
    pendientes: number;
    porcentajeAceptacion: number;
  };
  evidencia: {
    conFirma: number;
    conGps: number;
    coberturaFirma: number;
    coberturaGps: number;
  };
  tiempos: {
    promedioEntregaHoras: number | null;
  };
  facturacion: {
    listasParaFacturar: number;
    facturadas: number;
  };
}

export interface DeliveryOperationalReport {
  rango: {
    desde: string;
    hasta: string;
    dias: number;
  };
  efectividad: {
    intentos: number;
    completas: number;
    parciales: number;
    rechazadas: number;
    noEntregadas: number;
    tasaExito: number;
  };
  motivosNoEntrega: Array<{
    motivo: DeliveryFailureReason;
    cantidad: number;
  }>;
  tendenciaDiaria: Array<{
    fecha: string;
    intentos: number;
    completas: number;
    parciales: number;
    fallidas: number;
    unidadesEntregadas: number;
  }>;
  puntualidad: {
    evaluadas: number;
    aTiempo: number;
    tarde: number;
    sinEstimacion: number;
  };
  evidencia: {
    conFirma: number;
    conFoto: number;
    conGps: number;
    sinEvidencia: number;
  };
  repartidores: Array<{
    usuario: DeliveryUser;
    intentos: number;
    exitosas: number;
    tasaExito: number;
    unidadesEntregadas: number;
    horasPromedio: number | null;
    fueraRadio: number;
  }>;
}

export interface CreateDeliveryPayload {
  envioDespachoId: number;
  claveIdempotencia: string;
}

export interface StartDeliveryPayload {
  claveIdempotencia: string;
  latitud?: number;
  longitud?: number;
}

export interface UpdateDeliveryResultPayload {
  receptorNombre?: string;
  receptorDocumento?: string;
  latitud?: number;
  longitud?: number;
  observaciones?: string;
  detalles: Array<{
    detalleId: number;
    cantidadEntregada: number;
    cantidadRechazada: number;
    motivoRechazo?: string;
  }>;
}

export interface AddDeliveryEvidencePayload {
  tipo: DeliveryEvidenceType;
  url?: string;
  contenido?: string;
  key?: string;
  mimeType?: string;
  size?: number;
  descripcion?: string;
  claveIdempotencia: string;
}

export interface FinalizeDeliveryPayload {
  resultado: "ENTREGADA" | "PARCIAL" | "RECHAZADA" | "NO_ENTREGADA";
  receptorNombre?: string;
  receptorDocumento?: string;
  latitud?: number;
  longitud?: number;
  motivoNoEntrega?: DeliveryFailureReason;
  detalleNoEntrega?: string;
  observaciones?: string;
  claveIdempotencia: string;
}

export interface DeliveryObservationPayload {
  detalle: string;
  claveIdempotencia: string;
}

export type DeliveryPageResponse = PageResult<DeliveryView>;
export type DeliveryCandidatePageResponse = PageResult<DeliveryCandidate>;
export type DeliveryEventPageResponse = PageResult<DeliveryEvent>;
