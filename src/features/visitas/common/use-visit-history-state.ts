import { useCallback, useEffect, useMemo, useState } from "react";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import type { VisitHistoryFilters, VisitHistorySort } from "../api/visit-history.types";
import type { VisitReason, VisitStatus, VisitType } from "../api/visit-workflow.types";

const SORT_FIELDS: VisitHistorySort[] = [
  "inicio", "fin", "creadoEn", "actualizadoEn", "estadoVisita", "tipoVisita", "motivoVisita",
];
const STATUS: VisitStatus[] = ["INICIADA", "FINALIZADA", "CANCELADA"];
const TYPES: VisitType[] = ["PRESENCIAL", "VIRTUAL"];
const REASONS: VisitReason[] = [
  "COMPRA_CLIENTE", "PRESENTACION_PRODUCTOS", "NEGOCIACION_PRECIOS",
  "ENTREGA_MUESTRAS", "PLANIFICACION_PEDIDOS", "CONSULTA_CLIENTE",
  "SEGUIMIENTO", "PROMOCION", "OTRO",
];
const SIZES = [10, 20, 30, 50, 100];
const positive = (v: string | null) =>
  v && /^\d+$/.test(v) && Number.isSafeInteger(Number(v)) && Number(v) > 0
    ? Number(v) : undefined;
const date = (v: string | null) =>
  v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined;
const sortField = (v: string | null): VisitHistorySort =>
  SORT_FIELDS.find((field) => field === v) ?? "inicio";

export type VisitFilterKey =
  "estadoVisita" | "tipoVisita" | "motivoVisita" | "clienteId" |
  "vendedorId" | "departamentoId" | "municipioId" | "desde" | "hasta";

export function useVisitHistoryState() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo<VisitHistoryFilters>(() => ({
    page: positive(params.get("page")) ?? 1,
    limit: SIZES.find((v) => v === positive(params.get("limit"))) ?? 20,
    search: params.get("search")?.trim() || undefined,
    estadoVisita: STATUS.find((v) => v === params.get("estadoVisita")),
    tipoVisita: TYPES.find((v) => v === params.get("tipoVisita")),
    motivoVisita: REASONS.find((v) => v === params.get("motivoVisita")),
    clienteId: positive(params.get("clienteId")),
    vendedorId: positive(params.get("vendedorId")),
    departamentoId: positive(params.get("departamentoId")),
    municipioId: positive(params.get("municipioId")),
    desde: date(params.get("desde")),
    hasta: date(params.get("hasta")),
    sortBy: sortField(params.get("sortBy")),
    sortDir: params.get("sortDir") === "asc" ? "asc" : "desc",
  }), [params]);
  const [searchDraft, setSearchDraft] = useState(params.get("search") ?? "");
  useEffect(() => {
    setSearchDraft(params.get("search") ?? "");
  }, [params]);

  const patch = useCallback((values: Record<string, string | number | null | undefined>) => {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      for (const [key, value] of Object.entries(values)) {
        if (value === undefined || value === null || value === "") next.delete(key);
        else next.set(key, String(value));
      }
      return next;
    }, { replace: true });
  }, [setParams]);

  const setFilter = useCallback((key: VisitFilterKey, value: string | number | null) => {
    patch({
      [key]: value, page: 1,
      ...(key === "departamentoId" ? { municipioId: null } : {}),
    });
  }, [patch]);
  const setSearch = useCallback((search: string) => {
    patch({ search: search.trim() || null, page: 1 });
  }, [patch]);
  const setPagination = useCallback((pagination: PaginationState) => {
    patch({ page: pagination.pageIndex + 1, limit: pagination.pageSize });
  }, [patch]);
  const setSorting = useCallback((sorting: SortingState) => {
    patch({ sortBy: sortField(sorting[0]?.id ?? null),
      sortDir: sorting[0]?.desc ? "desc" : "asc", page: 1 });
  }, [patch]);
  const clear = useCallback(() => {
    setSearchDraft("");
    setParams(new URLSearchParams(), { replace: true });
  }, [setParams]);

  return {
    filters, searchDraft, setSearchDraft, setFilter, setSearch, setPagination, setSorting, clear,
    pagination: { pageIndex: filters.page - 1, pageSize: filters.limit } as PaginationState,
    sorting: [{ id: filters.sortBy, desc: filters.sortDir === "desc" }] as SortingState,
  };
}
