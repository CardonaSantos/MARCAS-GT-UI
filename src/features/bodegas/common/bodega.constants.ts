import type {
  BodegaEventType,
  BodegaSortField,
  SortDirection,
} from "../api/bodega.types";

export const BODEGA_SORT_FIELDS: readonly BodegaSortField[] = [
  "codigo",
  "nombre",
  "creadoEn",
  "actualizadoEn",
];

export const BODEGA_SORT_DIRECTIONS: readonly SortDirection[] = [
  "asc",
  "desc",
];

export const BODEGA_DETAIL_TABS = [
  "resumen",
  "operacion",
  "actividad",
] as const;

export type BodegaDetailTab = (typeof BODEGA_DETAIL_TABS)[number];

export const BODEGA_EVENT_LABELS: Record<BodegaEventType, string> = {
  CREADA: "Bodega creada",
  ACTUALIZADA: "Información actualizada",
  ACTIVADA: "Bodega activada",
  DESACTIVADA: "Bodega desactivada",
  RESPONSABLE_ASIGNADO: "Responsable asignado",
  RESPONSABLE_REMOVIDO: "Responsable removido",
  ESTABLECIDA_PRINCIPAL: "Establecida como principal",
};
