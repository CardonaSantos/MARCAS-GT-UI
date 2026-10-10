import { useCallback, useMemo } from "react";
import type { PaginationState, SortingState } from "@tanstack/react-table";

import {
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/ui/components/app/handlers";

import type {
  FiscalDocumentState,
  InvoiceListFilters,
  InvoiceSortField,
  InvoiceState,
  PaymentCondition,
  SortDirection,
} from "../api/billing.types";

type FilterState = {
  estado: InvoiceState | null;
  estadoFiscal: FiscalDocumentState | null;
  clienteId: number | null;
  vendedorId: number | null;
  condicionPago: PaymentCondition | null;
  soloPendientesFel: boolean | null;
  soloErroresFel: boolean | null;
  soloInciertas: boolean | null;
  fechaDesde: string;
  fechaHasta: string;
};

export function useInvoiceListState() {
  const table = useAppTableHandlers({
    initialPageIndex: 0,
    initialPageSize: 20,
    initialSorting: [{ id: "creadoEn", desc: true }],
    initialSearch: "",
    initialServerSearch: "",
    initialDensity: "xs",
  });

  const filters = useAppStateHandlers<FilterState>({
    estado: null,
    estadoFiscal: null,
    clienteId: null,
    vendedorId: null,
    condicionPago: null,
    soloPendientesFel: null,
    soloErroresFel: null,
    soloInciertas: null,
    fechaDesde: "",
    fechaHasta: "",
  });

  const setPagination = useCallback(
    (next: PaginationState) => table.setPagination(next),
    [table],
  );

  const setSorting = useCallback(
    (next: SortingState) => {
      table.setSorting(next.length ? next : [{ id: "creadoEn", desc: true }]);
      table.resetPage();
    },
    [table],
  );

  const setFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      filters.setField(key, value);
      table.resetPage();
    },
    [filters, table],
  );

  const resetFilters = useCallback(() => {
    filters.setState({
      estado: null,
      estadoFiscal: null,
      clienteId: null,
      vendedorId: null,
      condicionPago: null,
      soloPendientesFel: null,
      soloErroresFel: null,
      soloInciertas: null,
      fechaDesde: "",
      fechaHasta: "",
    });
    table.setSearch("");
    table.setServerSearch("");
    table.setPagination((current) => ({ ...current, pageIndex: 0 }));
    table.setSorting([{ id: "creadoEn", desc: true }]);
  }, [filters, table]);

  const queryFilters = useMemo<InvoiceListFilters>(() => {
    const sorting = table.sorting[0];
    return {
      page: table.pagination.pageIndex + 1,
      limit: table.pagination.pageSize,
      search: table.serverSearch || undefined,
      estado: filters.state.estado ?? undefined,
      estadoFiscal: filters.state.estadoFiscal ?? undefined,
      clienteId: filters.state.clienteId ?? undefined,
      vendedorId: filters.state.vendedorId ?? undefined,
      condicionPago: filters.state.condicionPago ?? undefined,
      soloPendientesFel: filters.state.soloPendientesFel ?? undefined,
      soloErroresFel: filters.state.soloErroresFel ?? undefined,
      soloInciertas: filters.state.soloInciertas ?? undefined,
      fechaDesde: filters.state.fechaDesde || undefined,
      fechaHasta: filters.state.fechaHasta || undefined,
      sortBy: (sorting?.id ?? "creadoEn") as InvoiceSortField,
      sortDir: (sorting?.desc ? "desc" : "asc") as SortDirection,
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
  };
}
