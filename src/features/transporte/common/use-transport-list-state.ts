import { useCallback, useEffect, useMemo } from "react";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";

import {
  parseEnumParam,
  parseOptionalBooleanParam,
  parsePositiveIntParam,
  setSearchParam,
} from "@/features/common/navigation/url-state.utils";
import {
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/ui/components/app/handlers";

import type {
  ShipmentListFilters,
  ShipmentMode,
  ShipmentSortField,
  ShipmentState,
  SortDirection,
} from "../api/transport.types";
import {
  SHIPMENT_MODES,
  SHIPMENT_SORT_FIELDS,
  SHIPMENT_STATES,
} from "./transport.constants";

const SORT_DIRECTIONS = ["asc", "desc"] as const;

type FilterState = {
  estado: ShipmentState | null;
  modalidad: ShipmentMode | null;
  bodegaId: number | null;
  transportistaId: number | null;
  vehiculoId: number | null;
  conductorId: number | null;
  responsableId: number | null;
  clienteId: number | null;
  conIncidencia: boolean | null;
  soloAtrasados: boolean | null;
  fechaDesde: string;
  fechaHasta: string;
};

export function useTransportListState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const table = useAppTableHandlers({
    initialPageIndex:
      (parsePositiveIntParam(searchParams.get("page"), 1) ?? 1) - 1,
    initialPageSize:
      parsePositiveIntParam(searchParams.get("limit"), 20) ?? 20,
    initialSorting: [
      {
        id:
          parseEnumParam(
            searchParams.get("sortBy"),
            SHIPMENT_SORT_FIELDS,
            "creadoEn",
          ) ?? "creadoEn",
        desc:
          (parseEnumParam(
            searchParams.get("sortDir"),
            SORT_DIRECTIONS,
            "desc",
          ) ?? "desc") === "desc",
      },
    ],
    initialSearch: searchParams.get("search") ?? "",
    initialServerSearch: searchParams.get("search") ?? "",
    initialDensity: "xs",
  });

  const filters = useAppStateHandlers<FilterState>({
    estado: parseEnumParam(searchParams.get("estado"), SHIPMENT_STATES),
    modalidad: parseEnumParam(searchParams.get("modalidad"), SHIPMENT_MODES),
    bodegaId: parsePositiveIntParam(searchParams.get("bodegaId")),
    transportistaId: parsePositiveIntParam(searchParams.get("transportistaId")),
    vehiculoId: parsePositiveIntParam(searchParams.get("vehiculoId")),
    conductorId: parsePositiveIntParam(searchParams.get("conductorId")),
    responsableId: parsePositiveIntParam(searchParams.get("responsableId")),
    clienteId: parsePositiveIntParam(searchParams.get("clienteId")),
    conIncidencia: parseOptionalBooleanParam(searchParams.get("conIncidencia")),
    soloAtrasados: parseOptionalBooleanParam(searchParams.get("soloAtrasados")),
    fechaDesde: searchParams.get("fechaDesde") ?? "",
    fechaHasta: searchParams.get("fechaHasta") ?? "",
  });

  const updateUrl = useCallback(
    (patch: Record<string, string | number | boolean | null | undefined>) => {
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
      updateUrl({ page: next.pageIndex + 1, limit: next.pageSize });
    },
    [table, updateUrl],
  );

  const setSorting = useCallback(
    (next: SortingState) => {
      const resolved =
        next.length > 0 ? next : [{ id: "creadoEn", desc: true }];
      table.setSorting(resolved);
      table.resetPage();
      updateUrl({
        page: 1,
        sortBy: resolved[0]?.id ?? "creadoEn",
        sortDir: resolved[0]?.desc ? "desc" : "asc",
      });
    },
    [table, updateUrl],
  );

  const setFilter = useCallback(
    <TKey extends keyof FilterState>(key: TKey, value: FilterState[TKey]) => {
      filters.setField(key, value);
      table.resetPage();
      updateUrl({
        [key]: value as string | number | boolean | null,
        page: 1,
      });
    },
    [filters, table, updateUrl],
  );

  const resetFilters = useCallback(() => {
    filters.setState({
      estado: null,
      modalidad: null,
      bodegaId: null,
      transportistaId: null,
      vehiculoId: null,
      conductorId: null,
      responsableId: null,
      clienteId: null,
      conIncidencia: null,
      soloAtrasados: null,
      fechaDesde: "",
      fechaHasta: "",
    });
    table.setPagination((current) => ({ ...current, pageIndex: 0 }));
    table.setSearch("");
    table.setServerSearch("");
    table.setSorting([{ id: "creadoEn", desc: true }]);

    const next = new URLSearchParams();
    if (table.pagination.pageSize !== 20) {
      next.set("limit", String(table.pagination.pageSize));
    }
    setSearchParams(next, { replace: true });
  }, [filters, setSearchParams, table]);

  useEffect(() => {
    const page = parsePositiveIntParam(searchParams.get("page"), 1) ?? 1;
    const limit = parsePositiveIntParam(searchParams.get("limit"), 20) ?? 20;
    const search = searchParams.get("search") ?? "";
    const sortBy =
      parseEnumParam(
        searchParams.get("sortBy"),
        SHIPMENT_SORT_FIELDS,
        "creadoEn",
      ) ?? "creadoEn";
    const sortDir =
      parseEnumParam(
        searchParams.get("sortDir"),
        SORT_DIRECTIONS,
        "desc",
      ) ?? "desc";

    table.setPagination((current) =>
      current.pageIndex === page - 1 && current.pageSize === limit
        ? current
        : { pageIndex: page - 1, pageSize: limit },
    );
    table.setSorting((current) => {
      const first = current[0];
      if (first?.id === sortBy && first.desc === (sortDir === "desc")) {
        return current;
      }
      return [{ id: sortBy, desc: sortDir === "desc" }];
    });
    if (table.search !== search) table.setSearch(search);
    if (table.serverSearch !== search) table.setServerSearch(search);

    filters.setState({
      estado: parseEnumParam(searchParams.get("estado"), SHIPMENT_STATES),
      modalidad: parseEnumParam(searchParams.get("modalidad"), SHIPMENT_MODES),
      bodegaId: parsePositiveIntParam(searchParams.get("bodegaId")),
      transportistaId: parsePositiveIntParam(searchParams.get("transportistaId")),
      vehiculoId: parsePositiveIntParam(searchParams.get("vehiculoId")),
      conductorId: parsePositiveIntParam(searchParams.get("conductorId")),
      responsableId: parsePositiveIntParam(searchParams.get("responsableId")),
      clienteId: parsePositiveIntParam(searchParams.get("clienteId")),
      conIncidencia: parseOptionalBooleanParam(searchParams.get("conIncidencia")),
      soloAtrasados: parseOptionalBooleanParam(searchParams.get("soloAtrasados")),
      fechaDesde: searchParams.get("fechaDesde") ?? "",
      fechaHasta: searchParams.get("fechaHasta") ?? "",
    });
  }, [searchParams]);

  const queryFilters = useMemo<ShipmentListFilters>(() => {
    const sorting = table.sorting[0];
    const sortBy =
      parseEnumParam(
        sorting?.id ?? null,
        SHIPMENT_SORT_FIELDS,
        "creadoEn",
      ) ?? "creadoEn";
    const sortDir: SortDirection = sorting?.desc ? "desc" : "asc";

    return {
      page: table.pagination.pageIndex + 1,
      limit: table.pagination.pageSize,
      search: table.serverSearch || undefined,
      estado: filters.state.estado ?? undefined,
      modalidad: filters.state.modalidad ?? undefined,
      bodegaId: filters.state.bodegaId ?? undefined,
      transportistaId: filters.state.transportistaId ?? undefined,
      vehiculoId: filters.state.vehiculoId ?? undefined,
      conductorId: filters.state.conductorId ?? undefined,
      responsableId: filters.state.responsableId ?? undefined,
      clienteId: filters.state.clienteId ?? undefined,
      conIncidencia: filters.state.conIncidencia ?? undefined,
      soloAtrasados: filters.state.soloAtrasados ?? undefined,
      fechaDesde: filters.state.fechaDesde || undefined,
      fechaHasta: filters.state.fechaHasta || undefined,
      sortBy: sortBy as ShipmentSortField,
      sortDir,
    };
  }, [filters.state, table.pagination, table.serverSearch, table.sorting]);

  return {
    table,
    filters: filters.state,
    queryFilters,
    setFilter,
    setPagination,
    setSorting,
    resetFilters,
    updateUrl,
  };
}
