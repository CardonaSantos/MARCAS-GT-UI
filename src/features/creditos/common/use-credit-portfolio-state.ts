import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { PaginationState } from "@tanstack/react-table";

import {
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/ui/components/app/handlers";
import {
  parseEnumParam,
  parseOptionalBooleanParam,
  parsePositiveIntParam,
  setSearchParam,
} from "@/features/common/navigation/url-state.utils";

import type { CreditPortfolioFilters } from "../api/credit.types";

const PORTFOLIO_STATES = ["ACTIVO", "CERRADO"] as const;

type PortfolioState = (typeof PORTFOLIO_STATES)[number];

type FilterState = {
  estado: PortfolioState | null;
  clienteId: number | null;
  vendedorId: number | null;
  fechaDesde: string;
  fechaHasta: string;
  conSaldoPendiente: boolean | null;
};

export function useCreditPortfolioState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage =
    parsePositiveIntParam(searchParams.get("page"), 1) ?? 1;
  const initialLimit =
    parsePositiveIntParam(searchParams.get("limit"), 20) ?? 20;
  const initialSearch = searchParams.get("search") ?? "";

  const table = useAppTableHandlers({
    initialPageIndex: initialPage - 1,
    initialPageSize: initialLimit,
    initialSearch,
    initialServerSearch: initialSearch,
    initialDensity: "xs",
  });

  const filters = useAppStateHandlers<FilterState>({
    estado: parseEnumParam(searchParams.get("estado"), PORTFOLIO_STATES),
    clienteId: parsePositiveIntParam(searchParams.get("clienteId")),
    vendedorId: parsePositiveIntParam(searchParams.get("vendedorId")),
    fechaDesde: searchParams.get("fechaDesde") ?? "",
    fechaHasta: searchParams.get("fechaHasta") ?? "",
    conSaldoPendiente: parseOptionalBooleanParam(
      searchParams.get("conSaldoPendiente"),
    ),
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
      clienteId: null,
      vendedorId: null,
      fechaDesde: "",
      fechaHasta: "",
      conSaldoPendiente: null,
    });
    table.setSearch("");
    table.setServerSearch("");
    table.setPagination((current) => ({ ...current, pageIndex: 0 }));

    const next = new URLSearchParams(searchParams);
    [
      "page",
      "search",
      "estado",
      "clienteId",
      "vendedorId",
      "fechaDesde",
      "fechaHasta",
      "conSaldoPendiente",
    ].forEach((key) => next.delete(key));
    if (table.pagination.pageSize !== 20) {
      next.set("limit", String(table.pagination.pageSize));
    }
    setSearchParams(next, { replace: true });
  }, [filters, searchParams, setSearchParams, table]);

  useEffect(() => {
    const page =
      parsePositiveIntParam(searchParams.get("page"), 1) ?? 1;
    const limit =
      parsePositiveIntParam(searchParams.get("limit"), 20) ?? 20;
    const search = searchParams.get("search") ?? "";

    table.setPagination((current) =>
      current.pageIndex === page - 1 && current.pageSize === limit
        ? current
        : { pageIndex: page - 1, pageSize: limit },
    );

    if (table.search !== search) table.setSearch(search);
    if (table.serverSearch !== search) table.setServerSearch(search);

    filters.setState({
      estado: parseEnumParam(searchParams.get("estado"), PORTFOLIO_STATES),
      clienteId: parsePositiveIntParam(searchParams.get("clienteId")),
      vendedorId: parsePositiveIntParam(searchParams.get("vendedorId")),
      fechaDesde: searchParams.get("fechaDesde") ?? "",
      fechaHasta: searchParams.get("fechaHasta") ?? "",
      conSaldoPendiente: parseOptionalBooleanParam(
        searchParams.get("conSaldoPendiente"),
      ),
    });
  }, [searchParams]);

  const queryFilters = useMemo<CreditPortfolioFilters>(
    () => ({
      page: table.pagination.pageIndex + 1,
      limit: table.pagination.pageSize,
      search: table.serverSearch || undefined,
      estado: filters.state.estado ?? undefined,
      clienteId: filters.state.clienteId ?? undefined,
      vendedorId: filters.state.vendedorId ?? undefined,
      fechaDesde: filters.state.fechaDesde || undefined,
      fechaHasta: filters.state.fechaHasta || undefined,
      conSaldoPendiente: filters.state.conSaldoPendiente ?? undefined,
    }),
    [
      filters.state,
      table.pagination.pageIndex,
      table.pagination.pageSize,
      table.serverSearch,
    ],
  );

  return {
    table,
    filters: filters.state,
    queryFilters,
    setPagination,
    setSearch: table.handleSearchChange,
    setServerSearch: (value: string) => {
      table.handleDebouncedSearch(value);
      updateUrl({ search: value || null, page: 1 });
    },
    setEstado: (value: PortfolioState | null) =>
      setFilter("estado", value),
    setClienteId: (value: number | null) =>
      setFilter("clienteId", value),
    setVendedorId: (value: number | null) =>
      setFilter("vendedorId", value),
    setFechaDesde: (value: string) =>
      setFilter("fechaDesde", value),
    setFechaHasta: (value: string) =>
      setFilter("fechaHasta", value),
    setConSaldoPendiente: (value: boolean | null) =>
      setFilter("conSaldoPendiente", value),
    resetFilters,
  };
}
