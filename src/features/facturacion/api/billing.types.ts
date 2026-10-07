import type { PageResult } from "@/features/common/types/pagination.types";

export type InvoiceState =
  | "BORRADOR"
  | "LISTA_EMISION"
  | "EMITIDA"
  | "DESCARTADA"
  | "ANULADA";

export type FiscalDocumentState =
  | "BORRADOR"
  | "PREPARADO"
  | "EN_PROCESO"
  | "CERTIFICACION_INCIERTA"
  | "CERTIFICADO"
  | "RECHAZADO"
  | "CONTINGENCIA"
  | "ANULACION_PENDIENTE"
  | "ANULADO";

export type FelOperationState =
  | "PENDIENTE"
  | "EJECUTANDO"
  | "REINTENTABLE"
  | "INCIERTA"
  | "EXITOSA"
  | "RECHAZADA"
  | "FALLIDA"
  | "CANCELADA";

export type FiscalEnvironment = "PRUEBAS" | "PRODUCCION";
export type FiscalIdentityType = "NIT" | "CUI" | "CF" | "PASAPORTE" | "OTRO";
export type FiscalItemType = "BIEN" | "SERVICIO";
export type PaymentCondition = "PREPAGO" | "CONTRAENTREGA" | "CREDITO" | "MIXTO";
export type ReceivableState = "PENDIENTE" | "PARCIAL" | "PAGADA" | "VENCIDA" | "ANULADA";
export type InvoiceSortField = "creadoEn" | "actualizadoEn" | "estado" | "total" | "emitidaEn";
export type SortDirection = "asc" | "desc";

export interface BillingUser {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

export interface FiscalCustomerProfile {
  clienteId: number;
  tipoIdentificacion: FiscalIdentityType;
  identificacion: string;
  nombreFiscal: string;
  correoFiscal: string | null;
  direccion: string | null;
  codigoPostal: string | null;
  municipio: string | null;
  departamento: string | null;
  pais: string;
}

export interface FiscalProductProfile {
  productoId: number;
  bienOServicio: FiscalItemType;
  unidadMedida: string;
  descripcionFiscal: string | null;
  nombreCortoImpuesto: string | null;
  codigoUnidadGravable: number | null;
  activo: boolean;
}

export interface InvoiceListItem {
  id: number;
  estado: InvoiceState;
  numero: string | null;
  serie: string | null;
  moneda: string;
  subtotal: string;
  descuentoTotal: string;
  impuestoTotal: string;
  total: string;
  condicionPago: PaymentCondition | null;
  cliente: {
    id: number;
    nombreCompleto: string;
    fiscalReady: boolean;
  };
  pedido: {
    id: number;
    numero: string;
    vendedor: BillingUser | null;
  } | null;
  entregas: Array<{
    id: number;
    estado: string;
    finalizadaEn: string | null;
  }>;
  fiscal: {
    id: number;
    estado: FiscalDocumentState;
    tipoDte: string;
    serieInterna: string;
    numeroInterno: number;
    uuid: string | null;
    serieFel: string | null;
    numeroFel: string | null;
    establecimiento: Record<string, unknown>;
    proveedor: Record<string, unknown> | null;
  } | null;
  cuentaPorCobrar: {
    id: number;
    estado: ReceivableState;
    montoOriginal: string;
    saldoPendiente: string;
    fechaVencimiento: string;
  } | null;
  counts: {
    detalles: number;
    eventos: number;
  };
  emitidaEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface BillingCandidate {
  entrega: {
    id: number;
    estado: string;
    entregadoEn: string | null;
    finalizadaEn: string | null;
  };
  pedido: {
    id: number;
    numero: string;
    condicionPago: PaymentCondition;
    moneda: string;
    vendedor: BillingUser | null;
  };
  cliente: {
    id: number;
    nombreCompleto: string;
    telefono: string;
    correo: string | null;
    fiscalReady: boolean;
    fiscal: FiscalCustomerProfile | null;
  };
  lineas: Array<{
    entregaDetalleId: number;
    pedidoDetalleId: number;
    producto: {
      id: number;
      codigo: string;
      nombre: string;
    };
    entregada: number;
    facturada: number;
    disponibleFacturar: number;
    precioUnitario: string;
    descuentoPedido: string;
    fiscalReady: boolean;
    fiscal: FiscalProductProfile | null;
  }>;
  unidadesDisponibles: number;
  facturable: boolean;
  fiscalReady: boolean;
  advertencias: Array<{
    codigo: string;
    nivel: "INFO" | "ADVERTENCIA" | "CRITICO";
    mensaje: string;
    productoIds?: number[];
  }>;
}

export interface InvoiceDetail {
  id: number;
  estado: InvoiceState;
  version: number;
  numero: string | null;
  serie: string | null;
  condicionPago: PaymentCondition | null;
  moneda: string;
  totales: {
    subtotal: string;
    descuento: string;
    impuestos: string;
    total: string;
  };
  cliente: {
    id: number;
    nombre: string;
    apellido: string | null;
    nombreCompleto: string;
    telefono: string;
    correo: string | null;
    direccion: string;
    fiscal: FiscalCustomerProfile | null;
  };
  pedido: {
    id: number;
    numero: string;
    estado: string;
    condicionPago: PaymentCondition;
    estadoPago: string;
    vendedor: BillingUser | null;
  } | null;
  creadoPor: BillingUser | null;
  entregas: Array<{
    id: number;
    estado: string;
    finalizadaEn?: string | null;
  }>;
  detalles: InvoiceDetailLine[];
  fiscal: InvoiceFiscalDocument | null;
  cuentaPorCobrar: ReceivableView | null;
  eventosRecientes: InvoiceEvent[];
  advertencias: Array<{
    codigo: string;
    nivel: "INFO" | "ADVERTENCIA" | "CRITICO";
    mensaje: string;
  }>;
  acciones: {
    puedeEditar: boolean;
    puedeDescartar: boolean;
    puedePreparar: boolean;
    puedeEmitir: boolean;
    puedeReintentar: boolean;
    puedeReconciliar: boolean;
    puedeAnular: boolean;
  };
  fechas: {
    creadoEn: string;
    actualizadoEn: string;
    emitidaEn: string | null;
    descartadaEn: string | null;
    anuladaEn: string | null;
  };
}

export interface InvoiceDetailLine {
  id: number;
  producto: {
    id: number;
    codigoProducto?: string;
    nombre?: string;
  };
  pedidoDetalleId: number | null;
  entregaDetalleId: number | null;
  descripcion: string;
  bienOServicio: FiscalItemType;
  unidadMedida: string;
  cantidad: number;
  precioUnitario: string;
  precioBruto: string;
  descuento: string;
  impuestoTotal: string;
  totalLinea: string;
  impuestos: Array<{
    id: number;
    nombreCorto: string;
    codigoUnidadGravable: number | null;
    tasa: string | null;
    montoGravable: string;
    montoImpuesto: string;
  }>;
}

export interface InvoiceFiscalDocument {
  id: number;
  estado: FiscalDocumentState;
  entorno: FiscalEnvironment;
  tipoDte: string;
  serieInterna: string;
  numeroInterno: number;
  uuid: string | null;
  serieFel: string | null;
  numeroFel: string | null;
  fechaHoraEmision: string;
  fechaCertificacion: string | null;
  payloadHash: string;
  establecimiento: Record<string, unknown>;
  proveedor: {
    id: number;
    entorno: FiscalEnvironment;
    nombre: string;
    codigo: string;
  } | null;
  operacionActual: FelOperation | null;
  artefactos: Array<Record<string, unknown>>;
}

export interface InvoiceEvent {
  id: number;
  facturaId: number;
  usuarioId: number | null;
  tipo: string;
  estado: InvoiceState;
  detalle: string | null;
  referenciaTipo: string | null;
  referenciaId: number | null;
  claveIdempotencia: string | null;
  metadata: unknown;
  creadoEn: string;
  usuario: BillingUser | null;
}

export interface FelOperation {
  id: number;
  documentoFiscalId: number;
  proveedorFelConfigId: number;
  tipo: string;
  estado: FelOperationState;
  claveIdempotencia: string;
  intentos: number;
  maxIntentos: number;
  disponibleEn: string | null;
  ultimoCodigoError: string | null;
  ultimoMensajeError: string | null;
  iniciadaEn: string | null;
  finalizadaEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
  proveedorConfig?: {
    proveedorFel?: {
      codigo: string;
      nombre: string;
    };
  };
  intentosHttp?: Array<{
    id: number;
    numeroIntento: number;
    httpStatus: number | null;
    duracionMs: number | null;
    codigoProveedor: string | null;
    mensajeProveedor: string | null;
    errorTipo: string | null;
    iniciadoEn: string;
    finalizadoEn: string | null;
  }>;
}

export interface BillingSummary {
  total: number;
  porEstado: Partial<Record<InvoiceState, number>>;
  montos: {
    facturado: string;
    impuestos: string;
    descuentos: string;
  };
  fel: {
    pendientes: number;
    inciertas: number;
    rechazadas: number;
  };
  cartera: {
    cuentas: number;
    montoOriginal: string;
    saldoPendiente: string;
  };
}

export interface BillingOperationalReport {
  rango: { desde: string; hasta: string };
  facturas: Array<{ estado: InvoiceState; cantidad: number; monto: string }>;
  documentosFiscales: Array<{ estado: FiscalDocumentState; cantidad: number }>;
  operacionesFel: Array<{ estado: FelOperationState; cantidad: number; intentosPromedio: number }>;
  integracionExterna: {
    habilitada: boolean;
    mensaje: string;
  };
}

export interface ReceivableView {
  id: number;
  estado: ReceivableState;
  moneda: string;
  montoOriginal: string;
  saldoPendiente: string;
  fechaEmision: string;
  fechaVencimiento: string;
  diasVencida: number;
  cliente: {
    id: number;
    nombreCompleto: string;
  };
  pedido: Record<string, unknown> | null;
  factura: {
    id: number;
    estado: InvoiceState;
    numero: string | null;
    serie: string | null;
    total: string;
    documentoFiscal?: {
      uuid: string | null;
      serieFel: string | null;
      numeroFel: string | null;
    } | null;
  } | null;
  aplicaciones: Array<{
    id: number;
    monto: string;
    creadoEn: string;
    pago: Record<string, unknown>;
  }>;
}

export interface ReceivableSummary {
  cuentas: number;
  montoOriginal: string;
  saldoPendiente: string;
  aging: {
    vigente: string;
    d1_30: string;
    d31_60: string;
    d61_90: string;
    d90_plus: string;
  };
}

export interface InvoiceListFilters {
  page: number;
  limit: number;
  search?: string;
  estado?: InvoiceState;
  estadoFiscal?: FiscalDocumentState;
  clienteId?: number;
  vendedorId?: number;
  condicionPago?: PaymentCondition;
  fechaDesde?: string;
  fechaHasta?: string;
  soloPendientesFel?: boolean;
  soloErroresFel?: boolean;
  soloInciertas?: boolean;
  sortBy: InvoiceSortField;
  sortDir: SortDirection;
}

export interface CandidateFilters {
  page: number;
  limit: number;
  search?: string;
  clienteId?: number;
  pedidoId?: number;
}

export interface BillingRangeFilters {
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface ReceivableFilters {
  page: number;
  limit: number;
  search?: string;
  estado?: ReceivableState;
  clienteId?: number;
  soloVencidas?: boolean;
}

export interface CreateInvoicePayload {
  entregaIds: number[];
  lineas: Array<{ entregaDetalleId: number; cantidad: number }>;
  claveIdempotencia: string;
}

export interface PrepareInvoicePayload {
  tipoDte: string;
  entorno: FiscalEnvironment;
  establecimientoId?: number;
  serieInterna?: string;
  versionEsquema?: string;
}

export interface PrepareInvoiceResponse {
  documentoFiscal: InvoiceFiscalDocument;
  factura: InvoiceDetail;
  integracionFel: {
    habilitada: false;
    proveedorPreferido: string;
    mensaje: string;
  };
}

export interface DiscardInvoicePayload {
  motivo: string;
  claveIdempotencia: string;
}

export interface CompanyFiscalProfilePayload {
  empresaId: number;
  nit: string;
  razonSocial: string;
  afiliacionIva: string;
  correoFiscal?: string;
  direccion: string;
  codigoPostal?: string;
  municipio: string;
  departamento: string;
  pais?: string;
  preciosIncluyenImpuestos: boolean;
  tasaIvaDefault?: string;
}

export interface EstablishmentFiscalPayload {
  empresaId: number;
  codigoSat: number;
  nombreComercial: string;
  correo?: string;
  direccion: string;
  codigoPostal?: string;
  municipio: string;
  departamento: string;
  pais?: string;
  esPrincipal?: boolean;
}

export interface CustomerFiscalProfilePayload {
  tipoIdentificacion: FiscalIdentityType;
  identificacion: string;
  nombreFiscal: string;
  correoFiscal?: string;
  direccion?: string;
  codigoPostal?: string;
  municipio?: string;
  departamento?: string;
  pais?: string;
}

export interface ProductFiscalProfilePayload {
  bienOServicio: FiscalItemType;
  unidadMedida: string;
  descripcionFiscal?: string;
  nombreCortoImpuesto?: string;
  codigoUnidadGravable?: number;
  activo?: boolean;
}

export type InvoicePageResponse = PageResult<InvoiceListItem>;
export type BillingCandidatePageResponse = PageResult<BillingCandidate>;
export type InvoiceEventPageResponse = PageResult<InvoiceEvent>;
export type FelOperationPageResponse = PageResult<FelOperation>;
export type ReceivablePageResponse = PageResult<ReceivableView>;
