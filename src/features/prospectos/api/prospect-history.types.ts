export type ProspectHistorySort =
  | "creadoEn" | "actualizadoEn" | "inicio" | "fin"
  | "nombreCompleto" | "empresaTienda" | "estado";
export type ProspectState = "EN_PROSPECTO" | "FINALIZADO" | "CERRADO";

export interface ProspectHistoryFilters {
  page: number;
  limit: number;
  search?: string;
  estado?: ProspectState;
  tipoCliente?: string;
  departamentoId?: number;
  municipioId?: number;
  vendedorId?: number;
  convertido?: "true" | "false";
  desde?: string;
  hasta?: string;
  sortBy: ProspectHistorySort;
  sortDir: "asc" | "desc";
}
export interface ProspectHistoryRow {
  id: number;
  nombreCompleto: string | null;
  apellido: string | null;
  empresaTienda: string | null;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  usuarioId: number;
  clienteId: number | null;
  estado: ProspectState;
  tipoCliente: string | null;
  inicio: string;
  fin: string | null;
  creadoEn: string;
  actualizadoEn: string;
  departamentoId: number | null;
  municipioId: number | null;
  vendedor: { id: number; nombre: string };
  departamento: { id: number; nombre: string } | null;
  municipio: { id: number; nombre: string; departamentoId: number } | null;
  duracionMinutos: number | null;
}
export interface ProspectHistoryDetail extends ProspectHistoryRow {
  categoriasInteres: string[];
  volumenCompra: string | null;
  presupuestoMensual: string | null;
  preferenciaContacto: string | null;
  comentarios: string | null;
  ubicacion: {
    id: number; latitud: number; longitud: number; creadoEn: string;
  } | null;
}
export interface ProspectHistoryPage {
  data: ProspectHistoryRow[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
export interface ConvertProspectResult {
  prospectoId: number;
  clienteId: number;
  cliente: { id: number; nombre: string; apellido: string | null };
}
