import type { PageResult } from "@/features/common/types/pagination.types";

export type BodegaUserRole =
  | "ADMIN"
  | "VENDEDOR"
  | "BODEGA"
  | "CONTABILIDAD"
  | "REPARTIDOR";

export type BodegaEventType =
  | "CREADA"
  | "ACTUALIZADA"
  | "ACTIVADA"
  | "DESACTIVADA"
  | "RESPONSABLE_ASIGNADO"
  | "RESPONSABLE_REMOVIDO"
  | "ESTABLECIDA_PRINCIPAL";

export type BodegaSortField =
  | "codigo"
  | "nombre"
  | "creadoEn"
  | "actualizadoEn";

export type SortDirection = "asc" | "desc";

export interface BodegaResponsible {
  id: number;
  nombre: string;
  correo: string;
  rol: BodegaUserRole;
  activo: boolean;
}

export interface BodegaOperationalSummary {
  stockReal: number;
  stockReservado: number;
  stockDisponible: number;
  productosConStock: number;
  requisicionesPendientes: number;
  transferenciasPendientes: number;
  despachosPendientes: number;
  enviosPendientes: number;
}

export interface BodegaListItem {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  direccion: string | null;
  telefono: string | null;
  activo: boolean;
  esPrincipal: boolean;
  responsable: BodegaResponsible | null;
  operacion: BodegaOperationalSummary;
  creadoEn: string;
  actualizadoEn: string;
}

export interface BodegaEvent {
  id: number;
  tipo: BodegaEventType;
  detalle: string | null;
  creadoEn: string;
  actor: BodegaResponsible | null;
}

export interface BodegaDetail extends BodegaListItem {
  motivoInactivacion: string | null;
  inactivadaEn: string | null;
  puedeDesactivarse: boolean;
  bloqueosDesactivacion: string[];
  ultimosEventos: BodegaEvent[];
}

export interface BodegaSelectable {
  id: number;
  codigo: string;
  nombre: string;
  esPrincipal: boolean;
}

export interface BodegaOverview {
  total: number;
  activas: number;
  inactivas: number;
  principal: BodegaSelectable | null;
  stockRealTotal: number;
  stockReservadoTotal: number;
  stockDisponibleTotal: number;
}

export interface BodegaListFilters {
  page: number;
  limit: number;
  search?: string;
  activo?: boolean;
  esPrincipal?: boolean;
  responsableId?: number;
  sortBy: BodegaSortField;
  sortDir: SortDirection;
}

export interface BodegaEventFilters {
  page: number;
  limit: number;
}

export interface BodegaSelectFilters {
  search?: string;
  limit?: number;
}

export interface CreateBodegaPayload {
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  esPrincipal?: boolean;
  responsableId?: number | null;
}

export interface UpdateBodegaPayload {
  codigo?: string;
  nombre?: string;
  descripcion?: string | null;
  direccion?: string | null;
  telefono?: string | null;
}

export interface AssignBodegaResponsiblePayload {
  responsableId: number | null;
}

export interface DeactivateBodegaPayload {
  motivo: string;
}

export interface LegacyUserListItem {
  id: number;
  nombre: string;
  correo: string;
  rol: BodegaUserRole;
  activo: boolean;
}

export type BodegaListResponse = PageResult<BodegaListItem>;
export type BodegaEventsResponse = PageResult<BodegaEvent>;
