import { useCallback, useEffect, useMemo, useState } from "react";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import type {
  ProspectHistoryFilters, ProspectHistorySort, ProspectState,
} from "../api/prospect-history.types";

const SORT_FIELDS: readonly ProspectHistorySort[] = [
  "creadoEn", "actualizadoEn", "inicio", "fin", "nombreCompleto", "empresaTienda", "estado",
];
const PAGE_SIZES = [10, 20, 30, 50, 100];
const STATUS: ProspectState[] = ["EN_PROSPECTO", "FINALIZADO", "CERRADO"];

const positiveInt = (str: string | null) =>
  str && /^\d+$/.test(str) && Number.isSafeInteger(Number(str)) && Number(str) > 0
    ? Number(str) : undefined;
const sortField = (str: string | null): ProspectHistorySort =>
  SORT_FIELDS.find((field) => field === str) ?? "creadoEn";
const dateField = (str: string | null) =>
  str && /^\d{4}-\d{2}-\d{2}$/.test(str) ? str : undefined;

type SetFilterKey =
  "estado" | "tipoCliente" | "departamentoId" | "municipioId" |
  "vendedorId" | "convertido" | "desde" | "hasta";

export function useProspectHistoryState() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo<ProspectHistoryFilters>(() => ({
    page: positiveInt(params.get("page")) ?? 1,
    limit: PAGE_SIZES.find((n) => n === positiveInt(params.get("limit"))) ?? 20,
    search: params.get("search")?.trim() || undefined,
    estado: STATUS.find((s) => s === params.get("estado")),
    tipoCliente: params.get("tipoCliente") || undefined,
    departamentoId: positiveInt(params.get("departamentoId")),
    municipioId: positiveInt(params.get("municipioId")),
    vendedorId: positiveInt(params.get("vendedorId")),
    convertido: params.get("convertido") === "true" ? "true" :
      params.get("convertido") === "false" ? "false" : undefined,
    desde: dateField(params.get("desde")),
    hasta: dateField(params.get("hasta")),
    sortBy: sortField(params.get("sortBy")),
    sortDir: params.get("sortDir") === "asc" ? "asc" : "desc",
  }), [params]);

  const [searchDraft, setSearchDraft] = useState(params.get("search") ?? "");
  useEffect(() => {
    setSearchDraft(params.get("search") ?? "");
  }, [params]);

  const patch = useCallback((values: Record<string, string | number | null | undefined>) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(values)) {
        if (value === undefined || value === null || value === "") next.delete(key);
        else next.set(key, String(value));
      }
      return next;
    }, { replace: true });
  }, [setParams]);

  const setFilter = useCallback((name: SetFilterKey, value: string | number | null) => {
    patch({
      [name]: value, page: 1,
      ...(name === "departamentoId" ? { municipioId: null } : {}),
    });
  }, [patch]);
  const setSearch = useCallback((str: string) => {
    patch({ search: str.trim() || null, page: 1 });
  }, [patch]);
  const setPagination = useCallback((p: PaginationState) => {
    patch({ page: p.pageIndex + 1, limit: p.pageSize });
  }, [patch]);
  const setSorting = useCallback((s: SortingState) => {
    patch({
      page: 1, sortBy: sortField(s[0]?.id ?? null),
      sortDir: s[0]?.desc ? "desc" : "asc",
    });
  }, [patch]);
  const clear = useCallback(() => {
    setSearchDraft("");
    setParams(new URLSearchParams(), { replace: true });
  }, [setParams]);

  return {
    filters, searchDraft, setSearchDraft, setFilter, setSearch,
    setPagination, setSorting, clear,
    pagination: { pageIndex: filters.page - 1, pageSize: filters.limit } as PaginationState,
    sorting: [{ id: filters.sortBy, desc: filters.sortDir === "desc" }] as SortingState,
  };
}
