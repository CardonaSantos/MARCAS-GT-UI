import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { PaginationState } from "@tanstack/react-table";

import {
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/ui/components/app/handlers";
import {
  parseOptionalBooleanParam,
  parsePositiveIntParam,
  setSearchParam,
} from "@/features/common/navigation/url-state.utils";

import type { CreditPolicyFilters } from "../api/credit.types";

export function useCreditPolicyListState() {
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

  const filters = useAppStateHandlers({
    activo: parseOptionalBooleanParam(searchParams.get("activo")),
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

  const setActivo = useCallback(
    (value: boolean | null) => {
      filters.setField("activo", value);
      table.resetPage();
      updateUrl({ activo: value, page: 1 });
    },
    [filters, table, updateUrl],
  );

  const resetFilters = useCallback(() => {
    filters.setState({ activo: null });
    table.setSearch("");
    table.setServerSearch("");
    table.setPagination((current) => ({ ...current, pageIndex: 0 }));

    const next = new URLSearchParams(searchParams);
    ["page", "search", "activo"].forEach((key) => next.delete(key));
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
      activo: parseOptionalBooleanParam(searchParams.get("activo")),
    });
  }, [searchParams]);

  const queryFilters = useMemo<CreditPolicyFilters>(
    () => ({
      page: table.pagination.pageIndex + 1,
      limit: table.pagination.pageSize,
      search: table.serverSearch || undefined,
      activo: filters.state.activo ?? undefined,
    }),
    [
      filters.state.activo,
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
    setActivo,
    resetFilters,
  };
}
