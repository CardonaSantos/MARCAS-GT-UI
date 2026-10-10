import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { PaginationState, SortingState } from "@tanstack/react-table";

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

import {
  CREDIT_APPLICATION_STATES,
  CREDIT_DECISION_TYPES,
  CREDIT_INTEGRATION_STATES,
  CREDIT_SORT_FIELDS,
} from "./credit.constants";
import type {
  CreditApplicationState,
  CreditDecisionType,
  CreditIntegrationState,
  CreditListFilters,
  CreditSortField,
  CreditSummaryFilters,
  SortDirection,
} from "../api/credit.types";

const SORT_DIRECTIONS = ["asc", "desc"] as const;

type FilterState = {
  estado: CreditApplicationState | null;
  clienteId: number | null;
  solicitanteId: number | null;
  vendedorId: number | null;
  politicaId: number | null;
  tipoDecision: CreditDecisionType | null;
  integracionEstado: CreditIntegrationState | null;
  fechaDesde: string;
  fechaHasta: string;
  soloPendientes: boolean | null;
};

export function useCreditListState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage =
    parsePositiveIntParam(searchParams.get("page"), 1) ?? 1;
  const initialLimit =
    parsePositiveIntParam(searchParams.get("limit"), 20) ?? 20;
  const initialSearch = searchParams.get("search") ?? "";
  const initialSortBy =
    parseEnumParam(
      searchParams.get("sortBy"),
      CREDIT_SORT_FIELDS,
      "solicitadaEn",
    ) ?? "solicitadaEn";
  const initialSortDir =
    parseEnumParam(
      searchParams.get("sortDir"),
      SORT_DIRECTIONS,
      "desc",
    ) ?? "desc";

  const table = useAppTableHandlers({
    initialPageIndex: initialPage - 1,
    initialPageSize: initialLimit,
    initialSorting: [
      {
        id: initialSortBy,
        desc: initialSortDir === "desc",
      },
    ],
    initialSearch,
    initialServerSearch: initialSearch,
    initialDensity: "xs",
  });

  const filters = useAppStateHandlers<FilterState>({
    estado: parseEnumParam(
      searchParams.get("estado"),
      CREDIT_APPLICATION_STATES,
    ),
    clienteId: parsePositiveIntParam(searchParams.get("clienteId")),
    solicitanteId: parsePositiveIntParam(searchParams.get("solicitanteId")),
    vendedorId: parsePositiveIntParam(searchParams.get("vendedorId")),
    politicaId: parsePositiveIntParam(searchParams.get("politicaId")),
    tipoDecision: parseEnumParam(
      searchParams.get("tipoDecision"),
      CREDIT_DECISION_TYPES,
    ),
    integracionEstado: parseEnumParam(
      searchParams.get("integracionEstado"),
      CREDIT_INTEGRATION_STATES,
    ),
    fechaDesde: searchParams.get("fechaDesde") ?? "",
    fechaHasta: searchParams.get("fechaHasta") ?? "",
    soloPendientes: parseOptionalBooleanParam(
      searchParams.get("soloPendientes"),
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

  const setSorting = useCallback(
    (next: SortingState) => {
      const resolved =
        next.length > 0
          ? next
          : [{ id: "solicitadaEn", desc: true }];

      table.setSorting(resolved);
      table.resetPage();
      updateUrl({
        page: 1,
        sortBy: resolved[0]?.id ?? "solicitadaEn",
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
      clienteId: null,
      solicitanteId: null,
      vendedorId: null,
      politicaId: null,
      tipoDecision: null,
      integracionEstado: null,
      fechaDesde: "",
      fechaHasta: "",
      soloPendientes: null,
    });
    table.setPagination((current) => ({ ...current, pageIndex: 0 }));
    table.setSearch("");
    table.setServerSearch("");
    table.setSorting([{ id: "solicitadaEn", desc: true }]);

    const next = new URLSearchParams(searchParams);
    [
      "page",
      "search",
      "estado",
      "clienteId",
      "solicitanteId",
      "vendedorId",
      "politicaId",
      "tipoDecision",
      "integracionEstado",
      "fechaDesde",
      "fechaHasta",
      "soloPendientes",
      "sortBy",
      "sortDir",
    ].forEach((key) => next.delete(key));

    if (table.pagination.pageSize !== 20) {
      next.set("limit", String(table.pagination.pageSize));
    } else {
      next.delete("limit");
    }

    setSearchParams(next, { replace: true });
  }, [filters, searchParams, setSearchParams, table]);

  useEffect(() => {
    const page =
      parsePositiveIntParam(searchParams.get("page"), 1) ?? 1;
    const limit =
      parsePositiveIntParam(searchParams.get("limit"), 20) ?? 20;
    const search = searchParams.get("search") ?? "";
    const sortBy =
      parseEnumParam(
        searchParams.get("sortBy"),
        CREDIT_SORT_FIELDS,
        "solicitadaEn",
      ) ?? "solicitadaEn";
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
      estado: parseEnumParam(
        searchParams.get("estado"),
        CREDIT_APPLICATION_STATES,
      ),
      clienteId: parsePositiveIntParam(searchParams.get("clienteId")),
      solicitanteId: parsePositiveIntParam(searchParams.get("solicitanteId")),
      vendedorId: parsePositiveIntParam(searchParams.get("vendedorId")),
      politicaId: parsePositiveIntParam(searchParams.get("politicaId")),
      tipoDecision: parseEnumParam(
        searchParams.get("tipoDecision"),
        CREDIT_DECISION_TYPES,
      ),
      integracionEstado: parseEnumParam(
        searchParams.get("integracionEstado"),
        CREDIT_INTEGRATION_STATES,
      ),
      fechaDesde: searchParams.get("fechaDesde") ?? "",
      fechaHasta: searchParams.get("fechaHasta") ?? "",
      soloPendientes: parseOptionalBooleanParam(
        searchParams.get("soloPendientes"),
      ),
    });
  }, [searchParams]);

  const queryFilters = useMemo<CreditListFilters>(() => {
    const sorting = table.sorting[0];
    const sortBy =
      parseEnumParam(
        sorting?.id ?? null,
        CREDIT_SORT_FIELDS,
        "solicitadaEn",
      ) ?? "solicitadaEn";
    const sortDir: SortDirection = sorting?.desc ? "desc" : "asc";

    return {
      page: table.pagination.pageIndex + 1,
      limit: table.pagination.pageSize,
      search: table.serverSearch || undefined,
      estado: filters.state.estado ?? undefined,
      clienteId: filters.state.clienteId ?? undefined,
      solicitanteId: filters.state.solicitanteId ?? undefined,
      vendedorId: filters.state.vendedorId ?? undefined,
      politicaId: filters.state.politicaId ?? undefined,
      tipoDecision: filters.state.tipoDecision ?? undefined,
      integracionEstado: filters.state.integracionEstado ?? undefined,
      fechaDesde: filters.state.fechaDesde || undefined,
      fechaHasta: filters.state.fechaHasta || undefined,
      soloPendientes: filters.state.soloPendientes ?? undefined,
      sortBy: sortBy as CreditSortField,
      sortDir,
    };
  }, [
    filters.state,
    table.pagination.pageIndex,
    table.pagination.pageSize,
    table.serverSearch,
    table.sorting,
  ]);

  const summaryFilters = useMemo<CreditSummaryFilters>(
    () => ({
      estado: filters.state.estado ?? undefined,
      clienteId: filters.state.clienteId ?? undefined,
      solicitanteId: filters.state.solicitanteId ?? undefined,
      vendedorId: filters.state.vendedorId ?? undefined,
      politicaId: filters.state.politicaId ?? undefined,
      fechaDesde: filters.state.fechaDesde || undefined,
      fechaHasta: filters.state.fechaHasta || undefined,
    }),
    [filters.state],
  );

  const summaryCompatible =
    filters.state.tipoDecision === null &&
    filters.state.integracionEstado === null &&
    filters.state.soloPendientes !== true;

  return {
    table,
    filters: filters.state,
    queryFilters,
    summaryFilters,
    summaryCompatible,
    setPagination,
    setSorting,
    setSearch: table.handleSearchChange,
    setServerSearch: (value: string) => {
      table.handleDebouncedSearch(value);
      updateUrl({ search: value || null, page: 1 });
    },
    setEstado: (value: CreditApplicationState | null) =>
      setFilter("estado", value),
    setClienteId: (value: number | null) =>
      setFilter("clienteId", value),
    setSolicitanteId: (value: number | null) =>
      setFilter("solicitanteId", value),
    setVendedorId: (value: number | null) =>
      setFilter("vendedorId", value),
    setPoliticaId: (value: number | null) =>
      setFilter("politicaId", value),
    setTipoDecision: (value: CreditDecisionType | null) =>
      setFilter("tipoDecision", value),
    setIntegracionEstado: (value: CreditIntegrationState | null) =>
      setFilter("integracionEstado", value),
    setFechaDesde: (value: string) =>
      setFilter("fechaDesde", value),
    setFechaHasta: (value: string) =>
      setFilter("fechaHasta", value),
    setSoloPendientes: (value: boolean | null) =>
      setFilter("soloPendientes", value),
    resetFilters,
  };
}
