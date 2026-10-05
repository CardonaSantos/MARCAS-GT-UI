import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";

import type {
  InventoryMovementFilters,
  InventoryMovementPageResponse,
  InventoryOrderDetail,
  InventoryOrderPageResponse,
  InventoryPageResponse,
  InventoryReservation,
  InventoryReservationFilters,
  InventoryReservationPageResponse,
  InventoryStockDetail,
  InventoryListFilters,
  InventorySummary,
  ProductAvailability,
} from "./inventory.types";

export function useInventory(filters: InventoryListFilters) {
  return API.useQuery<InventoryPageResponse>({
    queryKey: marcasQueryKeys.inventario.list(filters),
    endpoint: marcasEndpoints.inventario.root,
    params: { ...filters },
  });
}

export function useInventorySummary(bodegaId?: number) {
  return API.useQuery<InventorySummary>({
    queryKey: marcasQueryKeys.inventario.summary({ bodegaId }),
    endpoint: marcasEndpoints.inventario.summary,
    params: { bodegaId },
  });
}

export function useInventoryStock(id: number) {
  return API.useQuery<InventoryStockDetail>({
    queryKey: marcasQueryKeys.inventario.detail(id),
    endpoint: marcasEndpoints.inventario.stock(id),
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useProductAvailability(productoId: number, enabled = true) {
  return API.useQuery<ProductAvailability>({
    queryKey: marcasQueryKeys.inventario.custom(
      "product",
      productoId,
      "availability",
    ),
    endpoint: marcasEndpoints.inventario.productAvailability(productoId),
    options: {
      enabled: enabled && Number.isInteger(productoId) && productoId > 0,
    },
  });
}

export function useInventoryMovements(
  filters: InventoryMovementFilters,
  enabled = true,
) {
  return API.useQuery<InventoryMovementPageResponse>({
    queryKey: marcasQueryKeys.inventario.custom("movements", filters),
    endpoint: marcasEndpoints.inventario.movements,
    params: { ...filters },
    options: { enabled },
  });
}

export function useInventoryKardex(
  productoId: number,
  filters: Omit<InventoryMovementFilters, "productoId">,
  enabled = true,
) {
  return API.useQuery<InventoryMovementPageResponse>({
    queryKey: marcasQueryKeys.inventario.custom(
      "product",
      productoId,
      "kardex",
      filters,
    ),
    endpoint: marcasEndpoints.inventario.kardex(productoId),
    params: { ...filters },
    options: {
      enabled: enabled && Number.isInteger(productoId) && productoId > 0,
    },
  });
}

export function useInventoryReservations(
  filters: InventoryReservationFilters,
  enabled = true,
) {
  return API.useQuery<InventoryReservationPageResponse>({
    queryKey: marcasQueryKeys.inventario.custom("reservations", filters),
    endpoint: marcasEndpoints.inventario.reservations,
    params: { ...filters },
    options: { enabled },
  });
}

export function useInventoryReservation(id: number, enabled = true) {
  return API.useQuery<InventoryReservation>({
    queryKey: marcasQueryKeys.inventario.custom("reservation", id),
    endpoint: marcasEndpoints.inventario.reservation(id),
    options: {
      enabled: enabled && Number.isInteger(id) && id > 0,
    },
  });
}

export function useInventoryOrderOptions(search: string) {
  const normalized = search.trim();

  return API.useQuery<InventoryOrderPageResponse>({
    queryKey: marcasQueryKeys.pedidos.custom(
      "inventory-reservation-options",
      normalized,
    ),
    endpoint: marcasEndpoints.pedidos.root,
    params: {
      page: 1,
      limit: 30,
      search: normalized || undefined,
      soloAbiertos: true,
      sortBy: "creadoEn",
      sortDir: "desc",
    },
  });
}

export function useInventoryOrderDetail(orderId: number | null) {
  return API.useQuery<InventoryOrderDetail>({
    queryKey: marcasQueryKeys.pedidos.detail(orderId ?? 0),
    endpoint: marcasEndpoints.pedidos.detail(orderId ?? 0),
    options: {
      enabled: Boolean(orderId && orderId > 0),
    },
  });
}
