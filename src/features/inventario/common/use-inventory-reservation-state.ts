import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { PaginationState } from "@tanstack/react-table";

import {
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/ui/components/app/handlers";
import {
  parseEnumParam,
  parsePositiveIntParam,
  setSearchParam,
} from "@/features/common/navigation/url-state.utils";
import { INVENTORY_RESERVATION_LABELS } from "./inventory.constants";
import type {
  InventoryReservationFilters,
  InventoryReservationState,
} from "../api/inventory.types";

type FilterState = {
  bodegaId: number | null;
  productoId: number | null;
  pedidoDetalleId: number | null;
  estado: InventoryReservationState | null;
};

const RESERVATION_STATES = Object.keys(
  INVENTORY_RESERVATION_LABELS,
) as InventoryReservationState[];

export function useInventoryReservationState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const table = useAppTableHandlers({
    initialPageIndex:
      (parsePositiveIntParam(searchParams.get("page"), 1) ?? 1) - 1,
    initialPageSize:
      parsePositiveIntParam(searchParams.get("limit"), 20) ?? 20,
    initialDensity: "xs",
  });

  const filters = useAppStateHandlers<FilterState>({
    bodegaId: parsePositiveIntParam(searchParams.get("bodegaId")),
    productoId: parsePositiveIntParam(searchParams.get("productoId")),
    pedidoDetalleId: parsePositiveIntParam(
      searchParams.get("pedidoDetalleId"),
    ),
    estado: parseEnumParam(searchParams.get("estado"), RESERVATION_STATES),
  });

  const updateUrl = useCallback(
    (patch: Record<string, string | number | null | undefined>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(patch).forEach(([key, value]) =>
        setSearchParam(next, key, value),
      );
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const setPagination = useCallback(
    (next: PaginationState) => {
      table.setPagination(next);
      updateUrl({
        page: next.pageIndex + 1,
        limit: next.pageSize,
      });
    },
    [table, updateUrl],
  );

  const setFilter = useCallback(
    <TKey extends keyof FilterState>(key: TKey, value: FilterState[TKey]) => {
      filters.setField(key, value);
      table.resetPage();
      updateUrl({ [key]: value as string | number | null, page: 1 });
    },
    [filters, table, updateUrl],
  );

  const resetFilters = useCallback(() => {
    const empty: FilterState = {
      bodegaId: null,
      productoId: null,
      pedidoDetalleId: null,
      estado: null,
    };
    filters.setState(empty);
    table.setPagination((current) => ({ ...current, pageIndex: 0 }));

    const next = new URLSearchParams(searchParams);
    ["page", "bodegaId", "productoId", "pedidoDetalleId", "estado"].forEach(
      (key) => next.delete(key),
    );
    setSearchParams(next, { replace: true });
  }, [filters, searchParams, setSearchParams, table]);

  useEffect(() => {
    const page =
      parsePositiveIntParam(searchParams.get("page"), 1) ?? 1;
    const limit =
      parsePositiveIntParam(searchParams.get("limit"), 20) ?? 20;

    table.setPagination((current) =>
      current.pageIndex === page - 1 && current.pageSize === limit
        ? current
        : { pageIndex: page - 1, pageSize: limit },
    );

    filters.setState({
      bodegaId: parsePositiveIntParam(searchParams.get("bodegaId")),
      productoId: parsePositiveIntParam(searchParams.get("productoId")),
      pedidoDetalleId: parsePositiveIntParam(
        searchParams.get("pedidoDetalleId"),
      ),
      estado: parseEnumParam(searchParams.get("estado"), RESERVATION_STATES),
    });
  }, [searchParams]);

  const queryFilters = useMemo<InventoryReservationFilters>(
    () => ({
      page: table.pagination.pageIndex + 1,
      limit: table.pagination.pageSize,
      bodegaId: filters.state.bodegaId ?? undefined,
      productoId: filters.state.productoId ?? undefined,
      pedidoDetalleId: filters.state.pedidoDetalleId ?? undefined,
      estado: filters.state.estado ?? undefined,
    }),
    [filters.state, table.pagination.pageIndex, table.pagination.pageSize],
  );

  return {
    table,
    filters: filters.state,
    queryFilters,
    setPagination,
    setBodegaId: (value: number | null) => setFilter("bodegaId", value),
    setProductoId: (value: number | null) => setFilter("productoId", value),
    setPedidoDetalleId: (value: number | null) =>
      setFilter("pedidoDetalleId", value),
    setEstado: (value: InventoryReservationState | null) =>
      setFilter("estado", value),
    resetFilters,
  };
}
