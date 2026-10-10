export type CustomerDirectorySort =
  | "nombre" | "apellido" | "tipoCliente" | "correo" | "telefono" | "creadoEn" | "actualizadoEn";
export interface CustomerDirectoryFilters {
  page: number;
  limit: number;
  search?: string;
  departamentoId?: number;
  municipioId?: number;
  tipoCliente?: string;
  volumenCompra?: string;
  presupuestoMensual?: string;
  intereses?: string;
  sortBy: CustomerDirectorySort;
  sortDir: "asc" | "desc";
}
export interface CustomerDirectoryItem {
  id: number;
  nombre: string;
  apellido: string | null;
  correo: string | null;
  telefono: string;
  direccion: string;
  tipoCliente: string | null;
  categoriasInteres: string[];
  volumenCompra: string | null;
  presupuestoMensual: string | null;
  preferenciaContacto: string | null;
  departamento: { id: number; nombre: string } | null;
  municipio: { id: number; nombre: string; departamentoId: number } | null;
  departamentoId: number | null;
  municipioId: number | null;
  ubicacion: { latitud: number; longitud: number } | null;
  actividad: { ventas: number; pedidos: number; visitas: number; solicitudesCredito: number; entregas: number };
  creadoEn: string;
  actualizadoEn: string;
}
export interface CustomerDirectoryDetail extends CustomerDirectoryItem {
  comentarios: string | null;
  perfilFiscal: {
    tipoIdentificacion: string;
    identificacion: string;
    nombreFiscal: string;
    correoFiscal: string | null;
  } | null;
}
export interface CustomerDirectoryPage {
  data: CustomerDirectoryItem[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
