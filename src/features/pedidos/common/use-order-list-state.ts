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
  ORDER_PAYMENT_CONDITIONS,
  ORDER_PAYMENT_STATES,
  ORDER_SORT_FIELDS,
  ORDER_STATES,
} from "./order.constants";
import type {
  OrderListFilters,
  OrderPaymentCondition,
  OrderPaymentState,
  OrderSortField,
  OrderState,
  OrderSummaryFilters,
  SortDirection,
} from "../api/order.types";

type FilterState = {
  estado: OrderState | null;
  estadoPago: OrderPaymentState | null;
  condicionPago: OrderPaymentCondition | null;
  clienteId: number | null;
  vendedorId: number | null;
  visitaId: number | null;
  fechaDesde: string;
  fechaHasta: string;
  soloAbiertos: boolean | null;
};

const SORT_DIRECTIONS = ["asc", "desc"] as const;

export function useOrderListState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage =
    parsePositiveIntParam(searchParams.get("page"), 1) ?? 1;
  const initialLimit =
    parsePositiveIntParam(searchParams.get("limit"), 20) ?? 20;
  const initialSearch = searchParams.get("search") ?? "";
  const initialSortBy =
    parseEnumParam(
      searchParams.get("sortBy"),
      ORDER_SORT_FIELDS,
      "creadoEn",
    ) ?? "creadoEn";
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
    estado: parseEnumParam(searchParams.get("estado"), ORDER_STATES),
    estadoPago: parseEnumParam(
      searchParams.get("estadoPago"),
      ORDER_PAYMENT_STATES,
    ),
    condicionPago: parseEnumParam(
      searchParams.get("condicionPago"),
      ORDER_PAYMENT_CONDITIONS,
    ),
    clienteId: parsePositiveIntParam(searchParams.get("clienteId")),
    vendedorId: parsePositiveIntParam(searchParams.get("vendedorId")),
    visitaId: parsePositiveIntParam(searchParams.get("visitaId")),
    fechaDesde: searchParams.get("fechaDesde") ?? "",
    fechaHasta: searchParams.get("fechaHasta") ?? "",
    soloAbiertos: parseOptionalBooleanParam(
      searchParams.get("soloAbiertos"),
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
      estadoPago: null,
      condicionPago: null,
      clienteId: null,
      vendedorId: null,
      visitaId: null,
      fechaDesde: "",
      fechaHasta: "",
      soloAbiertos: null,
    });
    table.setPagination((current) => ({ ...current, pageIndex: 0 }));
    table.setSearch("");
    table.setServerSearch("");
    table.setSorting([{ id: "creadoEn", desc: true }]);

    const next = new URLSearchParams(searchParams);
    [
      "page",
      "search",
      "estado",
      "estadoPago",
      "condicionPago",
      "clienteId",
      "vendedorId",
      "visitaId",
      "fechaDesde",
      "fechaHasta",
      "soloAbiertos",
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
        ORDER_SORT_FIELDS,
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
      estado: parseEnumParam(searchParams.get("estado"), ORDER_STATES),
      estadoPago: parseEnumParam(
        searchParams.get("estadoPago"),
        ORDER_PAYMENT_STATES,
      ),
      condicionPago: parseEnumParam(
        searchParams.get("condicionPago"),
        ORDER_PAYMENT_CONDITIONS,
      ),
      clienteId: parsePositiveIntParam(searchParams.get("clienteId")),
      vendedorId: parsePositiveIntParam(searchParams.get("vendedorId")),
      visitaId: parsePositiveIntParam(searchParams.get("visitaId")),
      fechaDesde: searchParams.get("fechaDesde") ?? "",
      fechaHasta: searchParams.get("fechaHasta") ?? "",
      soloAbiertos: parseOptionalBooleanParam(
        searchParams.get("soloAbiertos"),
      ),
    });
  }, [searchParams]);

  const queryFilters = useMemo<OrderListFilters>(() => {
    const sorting = table.sorting[0];
    const sortBy =
      parseEnumParam(
        sorting?.id ?? null,
        ORDER_SORT_FIELDS,
        "creadoEn",
      ) ?? "creadoEn";
    const sortDir: SortDirection = sorting?.desc ? "desc" : "asc";

    return {
      page: table.pagination.pageIndex + 1,
      limit: table.pagination.pageSize,
      search: table.serverSearch || undefined,
      estado: filters.state.estado ?? undefined,
      estadoPago: filters.state.estadoPago ?? undefined,
      condicionPago: filters.state.condicionPago ?? undefined,
      clienteId: filters.state.clienteId ?? undefined,
      vendedorId: filters.state.vendedorId ?? undefined,
      visitaId: filters.state.visitaId ?? undefined,
      fechaDesde: filters.state.fechaDesde || undefined,
      fechaHasta: filters.state.fechaHasta || undefined,
      soloAbiertos: filters.state.soloAbiertos ?? undefined,
      sortBy: sortBy as OrderSortField,
      sortDir,
    };
  }, [
    filters.state,
    table.pagination.pageIndex,
    table.pagination.pageSize,
    table.serverSearch,
    table.sorting,
  ]);

  const summaryFilters = useMemo<OrderSummaryFilters>(
    () => ({
      estado: filters.state.estado ?? undefined,
      estadoPago: filters.state.estadoPago ?? undefined,
      condicionPago: filters.state.condicionPago ?? undefined,
      clienteId: filters.state.clienteId ?? undefined,
      vendedorId: filters.state.vendedorId ?? undefined,
      fechaDesde: filters.state.fechaDesde || undefined,
      fechaHasta: filters.state.fechaHasta || undefined,
    }),
    [filters.state],
  );

  return {
    table,
    filters: filters.state,
    queryFilters,
    summaryFilters,
    setPagination,
    setSorting,
    setSearch: table.handleSearchChange,
    setServerSearch: (value: string) => {
      table.handleDebouncedSearch(value);
      updateUrl({ search: value || null, page: 1 });
    },
    setEstado: (value: OrderState | null) => setFilter("estado", value),
    setEstadoPago: (value: OrderPaymentState | null) =>
      setFilter("estadoPago", value),
    setCondicionPago: (value: OrderPaymentCondition | null) =>
      setFilter("condicionPago", value),
    setClienteId: (value: number | null) => setFilter("clienteId", value),
    setVendedorId: (value: number | null) => setFilter("vendedorId", value),
    setVisitaId: (value: number | null) => setFilter("visitaId", value),
    setFechaDesde: (value: string) => setFilter("fechaDesde", value),
    setFechaHasta: (value: string) => setFilter("fechaHasta", value),
    setSoloAbiertos: (value: boolean | null) =>
      setFilter("soloAbiertos", value),
    resetFilters,
  };
}
