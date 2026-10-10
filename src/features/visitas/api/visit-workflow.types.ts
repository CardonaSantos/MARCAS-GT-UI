export type VisitReason =
  | "COMPRA_CLIENTE" | "PRESENTACION_PRODUCTOS" | "NEGOCIACION_PRECIOS"
  | "ENTREGA_MUESTRAS" | "PLANIFICACION_PEDIDOS" | "CONSULTA_CLIENTE"
  | "SEGUIMIENTO" | "PROMOCION" | "OTRO";
export type VisitType = "PRESENCIAL" | "VIRTUAL";
export type VisitStatus = "INICIADA" | "FINALIZADA" | "CANCELADA";

export interface VisitCustomer {
  id: number;
  nombre: string;
  apellido: string | null;
  telefono: string;
  correo: string | null;
  direccion: string;
  departamento: { id: number; nombre: string } | null;
  municipio: { id: number; nombre: string } | null;
}
export interface VisitRecord {
  id: number;
  inicio: string;
  fin: string | null;
  usuarioId: number;
  clienteId: number;
  observaciones: string | null;
  motivoVisita: VisitReason | null;
  tipoVisita: VisitType | null;
  estadoVisita: VisitStatus;
  creadoEn: string;
  actualizadoEn: string;
  cliente: VisitCustomer;
  vendedor: { id: number; nombre: string };
}
export interface StartVisitPayload {
  clienteId: number;
  motivoVisita: VisitReason;
  tipoVisita: VisitType;
}
export interface FinishVisitPayload { observaciones: string }
export interface CancelVisitPayload { motivoCancelacion: string }
