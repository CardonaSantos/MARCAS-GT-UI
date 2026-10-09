export type ReceiptKind = "SALIDA_DESPACHO" | "ENTREGA";
export type ReceiptFormat = "A4" | "THERMAL_80MM";
export type ReceiptAction = "IMPRESION_SOLICITADA" | "DESCARGA_SOLICITADA" | "COMPARTICION_PREPARADA";

export interface ReceiptPerson {
  id: number;
  nombre: string;
}
export interface ReceiptCompany {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  pbx: string | null;
  email: string;
  website: string | null;
}
export interface ReceiptCustomer {
  id: number;
  nombre: string;
  apellido: string | null;
  nombreCompleto: string;
  telefono: string;
  correo: string | null;
  direccion: string;
}
export interface ReceiptProduct {
  id: number;
  codigo: string;
  nombre: string;
}
export interface ReceiptWarehouse {
  id: number;
  codigo: string;
  nombre: string;
  direccion?: string | null;
}
export interface DispatchReceiptSnapshot {
  esquema: string;
  clase: "NOTA_SALIDA_BODEGA";
  advertencia: string;
  empresa: ReceiptCompany;
  documento: {
    despachoId: number; operacionId: number;
    numeroDespacho: string | null; pedidoId: number;
    numeroPedido: string | null; estadoOperacion: string;
  };
  cliente: ReceiptCustomer;
  bodega: ReceiptWarehouse;
  operadores: { registradoPor: ReceiptPerson; preparadoPor: ReceiptPerson | null;
    creadoPor: ReceiptPerson | null; vendedor: ReceiptPerson };
  fechas: { programadoEn: string | null; preparadaEn: string | null;
    salidaRegistradaEn: string; salidaConfirmadaEn: string };
  transporte: Array<{
    paradaId: number;
    destino: { destinatario: string; direccion: string; telefono: string | null };
    envio: { id: number; numero: string; guia: string | null; estado: string };
    transportista: string | null; conductor: string | null;
    vehiculo: { placa: string; marca: string | null; modelo: string | null } | null;
    responsable: ReceiptPerson | null;
  }>;
  lineas: Array<{
    operacionDetalleId: number; despachoDetalleId: number; movimientoInventarioId: number;
    producto: ReceiptProduct; cantidad: number; observaciones: string | null;
  }>;
  resumen: { productos: number; unidadesSalidas: number };
  observaciones: string | null;
}
export interface DeliveryReceiptSnapshot {
  esquema: string;
  clase: "CONSTANCIA_ENTREGA" | "CONSTANCIA_INTENTO_ENTREGA";
  advertencia: string;
  empresa: ReceiptCompany;
  documento: {
    entregaId: number; estado: string; despachoId: number; numeroDespacho: string | null;
    pedidoId: number; numeroPedido: string | null;
  };
  cliente: ReceiptCustomer;
  destino: { destinatario: string; telefono: string | null; direccion: string;
    latitud: string | null; longitud: string | null } | null;
  bodegaOrigen: ReceiptWarehouse;
  operadores: { registradoPor: ReceiptPerson | null; vendedor: ReceiptPerson | null;
    finalizadoPor: ReceiptPerson | null; responsableEntrega: ReceiptPerson | null };
  transporte: { envioId: number; numero: string; guia: string | null;
    transportista: string | null; conductor: string | null;
    vehiculo: { placa: string; marca: string | null; modelo: string | null } | null } | null;
  receptor: { nombre: string | null; documento: string | null };
  fechas: { iniciadaEn: string | null; entregadoEn: string | null; finalizadaEn: string };
  ubicacionCierre: { latitud: string; longitud: string } | null;
  lineas: Array<{
    entregaDetalleId: number; producto: ReceiptProduct; solicitadoPedido: number;
    cargadoIntento: number | null; cantidadAceptada: number; cantidadRechazada: number;
    cantidadEntregadaAcumulada: number; motivoRechazo: string | null;
  }>;
  resumen: { unidadesCargadas: number | null; unidadesAceptadas: number;
    unidadesRechazadas: number; unidadesNoResueltas: number | null };
  evidencias: Array<{ id: number; tipo: string; key: string | null;
    url: string; descripcion: string | null; creadoEn: string }>;
  motivoNoEntrega: string | null;
  detalleNoEntrega: string | null;
  observaciones: string | null;
}
export interface ReceiptRecord {
  id: number; numero: string; tipo: ReceiptKind; referenciaId: number; empresaId: number;
  version: number; snapshot: DispatchReceiptSnapshot | DeliveryReceiptSnapshot;
  huellaSha256: string; emitidoPorId: number; emitidoEn: string;
}
export interface ReceiptPreview {
  emitido: boolean;
  comprobante: ReceiptRecord | null;
  numeroPrevisto?: string;
  snapshot: DispatchReceiptSnapshot | DeliveryReceiptSnapshot;
}
export interface ReceiptActionResponse { id: number; repeated: boolean; }
