import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { MARCAS_USER_ROLES, type MarcasUserRole, type UserDirectoryFilters, type UserSortField } from "../api/user.types";

const SORT_FIELDS: readonly UserSortField[] = [
  "nombre", "correo", "rol", "activo", "creadoEn", "actualizadoEn",
];
const PAGE_SIZES = [10, 20, 30, 50, 100];
function positive(raw: string | null) {
  if (!raw || !/^\d+$/.test(raw)) return undefined;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}
function sortField(value: string | null): UserSortField {
  return SORT_FIELDS.find((key) => key === value) ?? "nombre";
}
function role(value: string | null): MarcasUserRole | undefined {
  return MARCAS_USER_ROLES.find((key) => key === value);
}

export function useUserDirectoryState() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo<UserDirectoryFilters>(() => ({
    page: positive(params.get("page")) ?? 1,
    limit: PAGE_SIZES.find((value) => value === positive(params.get("limit"))) ?? 20,
    search: params.get("search")?.trim() || undefined,
    rol: role(params.get("rol")),
    activo: params.get("activo") === "true" ? "true" :
      params.get("activo") === "false" ? "false" : undefined,
    sortBy: sortField(params.get("sortBy")),
    sortDir: params.get("sortDir") === "desc" ? "desc" : "asc",
  }), [params]);
  const [searchDraft, setSearchDraft] = useState(params.get("search") ?? "");
  useEffect(() => { setSearchDraft(params.get("search") ?? ""); }, [params]);

  const patch = useCallback((values: Record<string, string | number | null | undefined>) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") next.delete(key);
        else next.set(key, String(value));
      });
      return next;
    }, { replace: true });
  }, [setParams]);
  const setFilter = useCallback((key: "rol" | "activo", value: string | null) =>
    patch({ [key]: value, page: 1 }), [patch]);
  const setSearch = useCallback((value: string) =>
    patch({ search: value.trim() || null, page: 1 }), [patch]);
  const setPagination = useCallback((page: PaginationState) =>
    patch({ page: page.pageIndex + 1, limit: page.pageSize }), [patch]);
  const setSorting = useCallback((sorting: SortingState) =>
    patch({
      sortBy: sortField(sorting[0]?.id ?? null),
      sortDir: sorting[0]?.desc ? "desc" : "asc", page: 1,
    }), [patch]);
  const clear = useCallback(() => {
    setSearchDraft("");
    setParams(new URLSearchParams(), { replace: true });
  }, [setParams]);

  return {
    filters, searchDraft, setSearchDraft, setFilter, setSearch,
    setPagination, setSorting, clear,
    sorting: [{ id: filters.sortBy, desc: filters.sortDir === "desc" }] as SortingState,
    pagination: { pageIndex: filters.page - 1, pageSize: filters.limit } as PaginationState,
  };
}
