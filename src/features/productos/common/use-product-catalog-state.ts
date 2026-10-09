import { useCallback, useEffect, useMemo, useState } from "react";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";

import type { CatalogSortField, ProductCatalogFilters, SortDirection } from "../api/catalog.types";

const SORT_FIELDS = ["nombre","codigoProducto","precio","costo","creadoEn","actualizadoEn"] as const;
const PAGE_SIZES = [10,20,30,50,100] as const;

const intParam = (input: string | null): number | undefined => {
  const n = Number(input);
  return input && Number.isInteger(n) && n > 0 ? n : undefined;
};
const moneyParam = (input: string | null): number | undefined => {
  if (!input || !/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(input)) return undefined;
  return Number(input);
};
const sortField = (input: string | null): CatalogSortField =>
  SORT_FIELDS.find((name) => name === input) ?? "nombre";

export function useProductCatalogState() {
  const [params, setParams] = useSearchParams();

  const filters = useMemo<ProductCatalogFilters>(() => ({
    page: intParam(params.get("page")) ?? 1,
    limit: PAGE_SIZES.find((n) => n === intParam(params.get("limit"))) ?? 20,
    search: params.get("search")?.trim() || undefined,
    categoriaId: intParam(params.get("categoriaId")),
    bodegaId: intParam(params.get("bodegaId")),
    conExistencia: params.get("conExistencia") === "true"
      ? true : params.get("conExistencia") === "false" ? false : undefined,
    precioMin: moneyParam(params.get("precioMin")),
    precioMax: moneyParam(params.get("precioMax")),
    sortBy: sortField(params.get("sortBy")),
    sortDir: params.get("sortDir") === "desc" ? "desc" : "asc",
  }), [params]);

  const [draftSearch, setDraftSearch] = useState(params.get("search") ?? "");
  useEffect(() => {
    setDraftSearch(params.get("search") ?? "");
  }, [params]);

  const patch = useCallback(
    (changes: Record<string, string | number | boolean | null | undefined>) => {
      setParams((previous) => {
        const next = new URLSearchParams(previous);
        for (const [key, value] of Object.entries(changes)) {
          if (value === null || value === undefined || value === "") next.delete(key);
          else next.set(key, String(value));
        }
        return next;
      }, { replace: true });
    },
    [setParams],
  );

  const pagination: PaginationState = {
    pageIndex: filters.page - 1,
    pageSize: filters.limit,
  };
  const sorting: SortingState = [{ id: filters.sortBy, desc: filters.sortDir === "desc" }];

  const setFilter = useCallback(
    (key: "categoriaId" | "bodegaId" | "conExistencia", value: number | boolean | null) =>
      patch({ [key]: value, page: 1 }),
    [patch],
  );

  const setSearch = useCallback((value: string) => {
    patch({ search: value.trim() || null, page: 1 });
  }, [patch]);

  const setPriceRange = useCallback((min: number | undefined, max: number | undefined) => {
    patch({ precioMin: min, precioMax: max, page: 1 });
  }, [patch]);

  const setPagination = useCallback((value: PaginationState) => {
    patch({ page: value.pageIndex + 1, limit: value.pageSize });
  }, [patch]);

  const setSorting = useCallback((value: SortingState) => {
    const chosen = sortField(value[0]?.id ?? null);
    const direction: SortDirection = value[0]?.desc ? "desc" : "asc";
    patch({ sortBy: chosen, sortDir: direction, page: 1 });
  }, [patch]);

  const reset = useCallback(() => {
    setDraftSearch("");
    setParams(new URLSearchParams(), { replace: true });
  }, [setParams]);

  return {
    filters,
    draftSearch,
    setDraftSearch,
    setSearch,
    setFilter,
    setPriceRange,
    setPagination,
    setSorting,
    pagination,
    sorting,
    reset,
  };
}
