export type ProspectStatus = "EN_PROSPECTO" | "FINALIZADO" | "CERRADO";
export interface ProspectRecord {
  id: number;
  usuarioId: number;
  nombreCompleto: string | null;
  apellido: string | null;
  empresaTienda: string | null;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  departamentoId: number | null;
  municipioId: number | null;
  tipoCliente: string | null;
  categoriasInteres: string[];
  volumenCompra: string | null;
  presupuestoMensual: string | null;
  preferenciaContacto: string | null;
  comentarios: string | null;
  estado: ProspectStatus;
  inicio: string;
  fin: string | null;
  departamento: { id: number; nombre: string } | null;
  municipio: { id: number; nombre: string; departamentoId: number } | null;
  ubicacion: { id: number; latitud: number; longitud: number } | null;
  vendedor: { id: number; nombre: string };
}
export interface StartProspectPayload {
  nombreCompleto?: string;
  apellido?: string;
  empresaTienda?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  departamentoId: number;
  municipioId: number;
}
export interface FinishProspectPayload extends StartProspectPayload {
  tipoCliente: string;
  categoriasInteres: string[];
  volumenCompra?: string;
  presupuestoMensual?: string;
  preferenciaContacto?: string;
  comentarios?: string;
  latitud?: number;
  longitud?: number;
}
export interface CancelProspectPayload { motivo: string }
