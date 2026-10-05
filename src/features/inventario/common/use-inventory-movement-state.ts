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
import { INVENTORY_MOVEMENT_LABELS } from "./inventory.constants";
import type {
  InventoryMovementFilters,
  InventoryMovementType,
} from "../api/inventory.types";

type FilterState = {
  bodegaId: number | null;
  productoId: number | null;
  tipo: InventoryMovementType | null;
  referenciaTipo: string;
  referenciaId: number | null;
  creadoPorId: number | null;
  fechaDesde: string;
  fechaHasta: string;
};

const MOVEMENT_TYPES = Object.keys(
  INVENTORY_MOVEMENT_LABELS,
) as InventoryMovementType[];

export function useInventoryMovementState() {
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
    tipo: parseEnumParam(searchParams.get("tipo"), MOVEMENT_TYPES),
    referenciaTipo: searchParams.get("referenciaTipo") ?? "",
    referenciaId: parsePositiveIntParam(searchParams.get("referenciaId")),
    creadoPorId: parsePositiveIntParam(searchParams.get("creadoPorId")),
    fechaDesde: searchParams.get("fechaDesde") ?? "",
    fechaHasta: searchParams.get("fechaHasta") ?? "",
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
      tipo: null,
      referenciaTipo: "",
      referenciaId: null,
      creadoPorId: null,
      fechaDesde: "",
      fechaHasta: "",
    };
    filters.setState(empty);
    table.setPagination((current) => ({ ...current, pageIndex: 0 }));

    const next = new URLSearchParams(searchParams);
    [
      "page",
      "bodegaId",
      "productoId",
      "tipo",
      "referenciaTipo",
      "referenciaId",
      "creadoPorId",
      "fechaDesde",
      "fechaHasta",
    ].forEach((key) => next.delete(key));
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

    const nextFilters: FilterState = {
      bodegaId: parsePositiveIntParam(searchParams.get("bodegaId")),
      productoId: parsePositiveIntParam(searchParams.get("productoId")),
      tipo: parseEnumParam(searchParams.get("tipo"), MOVEMENT_TYPES),
      referenciaTipo: searchParams.get("referenciaTipo") ?? "",
      referenciaId: parsePositiveIntParam(searchParams.get("referenciaId")),
      creadoPorId: parsePositiveIntParam(searchParams.get("creadoPorId")),
      fechaDesde: searchParams.get("fechaDesde") ?? "",
      fechaHasta: searchParams.get("fechaHasta") ?? "",
    };

    filters.setState(nextFilters);
  }, [searchParams]);

  const queryFilters = useMemo<InventoryMovementFilters>(
    () => ({
      page: table.pagination.pageIndex + 1,
      limit: table.pagination.pageSize,
      bodegaId: filters.state.bodegaId ?? undefined,
      productoId: filters.state.productoId ?? undefined,
      tipo: filters.state.tipo ?? undefined,
      referenciaTipo: filters.state.referenciaTipo || undefined,
      referenciaId: filters.state.referenciaId ?? undefined,
      creadoPorId: filters.state.creadoPorId ?? undefined,
      fechaDesde: filters.state.fechaDesde || undefined,
      fechaHasta: filters.state.fechaHasta || undefined,
    }),
    [filters.state, table.pagination.pageIndex, table.pagination.pageSize],
  );

  return {
    table,
    filters: filters.state,
    queryFilters,
    hasRequiredContext:
      Boolean(filters.state.bodegaId) && Boolean(filters.state.productoId),
    setPagination,
    setBodegaId: (value: number | null) => setFilter("bodegaId", value),
    setProductoId: (value: number | null) => setFilter("productoId", value),
    setTipo: (value: InventoryMovementType | null) =>
      setFilter("tipo", value),
    setReferenciaTipo: (value: string) =>
      setFilter("referenciaTipo", value),
    setReferenciaId: (value: number | null) =>
      setFilter("referenciaId", value),
    setCreadoPorId: (value: number | null) =>
      setFilter("creadoPorId", value),
    setFechaDesde: (value: string) => setFilter("fechaDesde", value),
    setFechaHasta: (value: string) => setFilter("fechaHasta", value),
    resetFilters,
  };
}
