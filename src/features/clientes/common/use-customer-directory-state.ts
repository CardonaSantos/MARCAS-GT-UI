import { useCallback, useEffect, useMemo, useState } from "react";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import type { CustomerDirectoryFilters, CustomerDirectorySort } from "../api/customer-directory.types";

const SORT_FIELDS: readonly CustomerDirectorySort[] = [
  "nombre", "apellido", "tipoCliente", "correo", "telefono", "creadoEn", "actualizadoEn",
];
const SIZES = [10, 20, 30, 50, 100];
function parsePositive(raw: string | null) {
  if (!raw || !/^\d+$/.test(raw)) return undefined;
  const value = Number(raw);
  return Number.isSafeInteger(value) && value > 0 ? value : undefined;
}
function resolveSort(raw: string | null): CustomerDirectorySort {
  return SORT_FIELDS.find((field) => field === raw) ?? "nombre";
}

export function useCustomerDirectoryState() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo<CustomerDirectoryFilters>(() => ({
    page: parsePositive(params.get("page")) ?? 1,
    limit: SIZES.find((n) => n === parsePositive(params.get("limit"))) ?? 20,
    search: params.get("search")?.trim() || undefined,
    departamentoId: parsePositive(params.get("departamentoId")),
    municipioId: parsePositive(params.get("municipioId")),
    tipoCliente: params.get("tipoCliente") || undefined,
    volumenCompra: params.get("volumenCompra") || undefined,
    presupuestoMensual: params.get("presupuestoMensual") || undefined,
    intereses: params.get("intereses") || undefined,
    sortBy: resolveSort(params.get("sortBy")),
    sortDir: params.get("sortDir") === "desc" ? "desc" : "asc",
  }), [params]);

  const [draftSearch, setDraftSearch] = useState(params.get("search") ?? "");
  useEffect(() => { setDraftSearch(params.get("search") ?? ""); }, [params]);

  const patch = useCallback((values: Record<string, string | number | null | undefined>) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      for (const [key, value] of Object.entries(values)) {
        if (value === null || value === undefined || value === "") next.delete(key);
        else next.set(key, String(value));
      }
      return next;
    }, { replace: true });
  }, [setParams]);

  const setFilter = useCallback((
    key: "departamentoId" | "municipioId" | "tipoCliente" | "volumenCompra" | "presupuestoMensual" | "intereses",
    value: number | string | null,
  ) => patch({
    [key]: value, page: 1,
    ...(key === "departamentoId" ? { municipioId: null } : {}),
  }), [patch]);
  const setSearch = useCallback((value: string) => patch({
    search: value.trim() || null, page: 1,
  }), [patch]);
  const setPagination = useCallback((page: PaginationState) => patch({
    page: page.pageIndex + 1, limit: page.pageSize,
  }), [patch]);
  const setSorting = useCallback((sort: SortingState) => patch({
    sortBy: resolveSort(sort[0]?.id ?? null),
    sortDir: sort[0]?.desc ? "desc" : "asc",
    page: 1,
  }), [patch]);
  const clear = useCallback(() => {
    setDraftSearch("");
    setParams(new URLSearchParams(), { replace: true });
  }, [setParams]);

  return {
    filters, draftSearch, setDraftSearch,
    setFilter, setSearch, setPagination, setSorting, clear,
    sorting: [{ id: filters.sortBy, desc: filters.sortDir === "desc" }] as SortingState,
    pagination: { pageIndex: filters.page - 1, pageSize: filters.limit } as PaginationState,
  };
}
