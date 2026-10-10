import { useCallback, useMemo } from "react";
import type { PaginationState } from "@tanstack/react-table";

import {
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/ui/components/app/handlers";

import type {
  PaymentListFilters,
  PaymentMethod,
  PaymentState,
} from "../api/payment.types";

type FilterState = {
  estado: PaymentState | null;
  metodo: PaymentMethod | null;
  clienteId: number | null;
  pedidoId: number | null;
  bancoId: number | null;
  fechaDesde: string;
  fechaHasta: string;
  soloConSaldoDisponible: boolean | null;
};

export function usePaymentListState() {
  const table = useAppTableHandlers({
    initialPageIndex: 0,
    initialPageSize: 20,
    initialSearch: "",
    initialServerSearch: "",
    initialDensity: "xs",
  });

  const filters = useAppStateHandlers<FilterState>({
    estado: null,
    metodo: null,
    clienteId: null,
    pedidoId: null,
    bancoId: null,
    fechaDesde: "",
    fechaHasta: "",
    soloConSaldoDisponible: null,
  });

  const setPagination = useCallback(
    (next: PaginationState) => table.setPagination(next),
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
      metodo: null,
      clienteId: null,
      pedidoId: null,
      bancoId: null,
      fechaDesde: "",
      fechaHasta: "",
      soloConSaldoDisponible: null,
    });
    table.setSearch("");
    table.setServerSearch("");
    table.setPagination((current) => ({ ...current, pageIndex: 0 }));
  }, [filters, table]);

  const queryFilters = useMemo<PaymentListFilters>(
    () => ({
      page: table.pagination.pageIndex + 1,
      limit: table.pagination.pageSize,
      search: table.serverSearch || undefined,
      estado: filters.state.estado ?? undefined,
      metodo: filters.state.metodo ?? undefined,
      clienteId: filters.state.clienteId ?? undefined,
      pedidoId: filters.state.pedidoId ?? undefined,
      bancoId: filters.state.bancoId ?? undefined,
      fechaDesde: filters.state.fechaDesde || undefined,
      fechaHasta: filters.state.fechaHasta || undefined,
      soloConSaldoDisponible:
        filters.state.soloConSaldoDisponible ?? undefined,
    }),
    [filters.state, table.pagination, table.serverSearch],
  );

  return {
    table,
    filters: filters.state,
    queryFilters,
    setFilter,
    setPagination,
    resetFilters,
  };
}
