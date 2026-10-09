import type { VisitReason, VisitStatus, VisitType } from "./visit-workflow.types";

export type VisitHistorySort =
  | "inicio" | "fin" | "creadoEn" | "actualizadoEn"
  | "estadoVisita" | "tipoVisita" | "motivoVisita";

export interface VisitHistoryFilters {
  page: number; limit: number;
  search?: string;
  estadoVisita?: VisitStatus;
  tipoVisita?: VisitType;
  motivoVisita?: VisitReason;
  clienteId?: number;
  vendedorId?: number;
  departamentoId?: number;
  municipioId?: number;
  desde?: string; hasta?: string;
  sortBy: VisitHistorySort; sortDir: "asc" | "desc";
}

export interface VisitHistoryRow {
  id: number;
  inicio: string; fin: string | null; creadoEn: string; actualizadoEn: string;
  usuarioId: number; clienteId: number;
  estadoVisita: VisitStatus; motivoVisita: VisitReason | null;
  tipoVisita: VisitType | null; observaciones: string | null;
  duracionMinutos: number | null;
  cliente: {
    id: number; nombre: string; apellido: string | null;
    telefono: string; direccion: string;
    departamentoId: number | null; municipioId: number | null;
  };
  vendedor: { id: number; nombre: string };
  _count: { ventas: number; pedidos: number };
}
export interface VisitHistoryPage {
  data: VisitHistoryRow[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface VisitHistoryDetail extends Omit<VisitHistoryRow, "cliente" | "vendedor"> {
  cliente: VisitHistoryRow["cliente"] & {
    correo: string | null; tipoCliente: string | null;
    presupuestoMensual: string | null; preferenciaContacto: string | null;
    categoriasInteres: string[]; comentarios: string | null;
    departamento: { id: number; nombre: string } | null;
    municipio: { id: number; nombre: string; departamentoId: number } | null;
    ubicacion: { latitud: number; longitud: number } | null;
  };
  vendedor: VisitHistoryRow["vendedor"] & { correo: string; rol: string };
  ventas: Array<{
    id: number; monto: number; montoConDescuento: number; descuento: number | null;
    metodoPago: string; referenciaPago: string | null; timestamp: string;
  }>;
  pedidos: Array<{
    id: number; numero: string | null; total: string;
    estado: string; estadoPago: string; creadoEn: string;
  }>;
}
