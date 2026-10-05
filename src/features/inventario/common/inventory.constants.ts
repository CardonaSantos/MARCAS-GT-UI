import type {
  InventoryMovementType,
  InventoryReservationState,
  InventorySortField,
} from "../api/inventory.types";

export const INVENTORY_SORT_FIELDS: readonly InventorySortField[] = [
  "producto",
  "codigoProducto",
  "bodega",
  "cantidadReal",
  "cantidadReservada",
  "cantidadDisponible",
  "costoPromedio",
  "actualizadoEn",
];

export const INVENTORY_MOVEMENT_LABELS: Record<InventoryMovementType, string> = {
  MIGRACION_INICIAL: "Migración inicial",
  ENTRADA_RECEPCION: "Entrada / recepción",
  SALIDA_DESPACHO: "Salida / despacho",
  RESERVA: "Reserva",
  LIBERACION_RESERVA: "Liberación de reserva",
  AJUSTE_ENTRADA: "Ajuste de entrada",
  AJUSTE_SALIDA: "Ajuste de salida",
  TRANSFERENCIA_SALIDA: "Transferencia de salida",
  TRANSFERENCIA_ENTRADA: "Transferencia de entrada",
  DEVOLUCION: "Devolución",
};

export const INVENTORY_RESERVATION_LABELS: Record<
  InventoryReservationState,
  string
> = {
  ACTIVA: "Activa",
  PARCIAL: "Parcial",
  APLICADA: "Aplicada",
  LIBERADA: "Liberada",
  CANCELADA: "Cancelada",
  FINALIZADA_MIXTA: "Finalizada mixta",
};

export const INVENTORY_RESERVATION_TONES: Record<
  InventoryReservationState,
  "success" | "warning" | "danger" | "neutral" | "primary"
> = {
  ACTIVA: "success",
  PARCIAL: "warning",
  APLICADA: "primary",
  LIBERADA: "neutral",
  CANCELADA: "danger",
  FINALIZADA_MIXTA: "neutral",
};

export const INVENTORY_STOCK_DETAIL_TABS = [
  "resumen",
  "reservas",
  "movimientos",
] as const;

export type InventoryStockDetailTab =
  (typeof INVENTORY_STOCK_DETAIL_TABS)[number];

export const INVENTORY_PRODUCT_TABS = [
  "disponibilidad",
  "kardex",
] as const;

export type InventoryProductTab = (typeof INVENTORY_PRODUCT_TABS)[number];

export const INVENTORY_MANAGEMENT_ROLES = ["ADMIN", "BODEGA"] as const;

export const INVENTORY_FULL_READ_ROLES = [
  "ADMIN",
  "BODEGA",
  "CONTABILIDAD",
] as const;

export const INVENTORY_AVAILABILITY_ROLES = [
  "ADMIN",
  "BODEGA",
  "CONTABILIDAD",
  "VENDEDOR",
] as const;
