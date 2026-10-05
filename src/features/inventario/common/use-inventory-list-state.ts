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
import { INVENTORY_SORT_FIELDS } from "./inventory.constants";
import type {
  InventoryListFilters,
  InventorySortField,
  SortDirection,
} from "../api/inventory.types";

type FilterState = {
  bodegaId: number | null;
  productoId: number | null;
  conExistencia: boolean | null;
  conReservas: boolean | null;
};

const SORT_DIRECTIONS = ["asc", "desc"] as const;

export function useInventoryListState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage =
    parsePositiveIntParam(searchParams.get("page"), 1) ?? 1;
  const initialLimit =
    parsePositiveIntParam(searchParams.get("limit"), 20) ?? 20;
  const initialSearch = searchParams.get("search") ?? "";
  const initialSortBy =
    parseEnumParam(
      searchParams.get("sortBy"),
      INVENTORY_SORT_FIELDS,
      "actualizadoEn",
    ) ?? "actualizadoEn";
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
    bodegaId: parsePositiveIntParam(searchParams.get("bodegaId")),
    productoId: parsePositiveIntParam(searchParams.get("productoId")),
    conExistencia: parseOptionalBooleanParam(
      searchParams.get("conExistencia"),
    ),
    conReservas: parseOptionalBooleanParam(searchParams.get("conReservas")),
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
          : [{ id: "actualizadoEn", desc: true }];

      table.setSorting(resolved);
      table.resetPage();

      updateUrl({
        page: 1,
        sortBy: resolved[0]?.id ?? "actualizadoEn",
        sortDir: resolved[0]?.desc ? "desc" : "asc",
      });
    },
    [table, updateUrl],
  );

  const setSearch = useCallback(
    (value: string) => table.handleSearchChange(value),
    [table],
  );

  const setServerSearch = useCallback(
    (value: string) => {
      table.handleDebouncedSearch(value);
      updateUrl({ search: value || null, page: 1 });
    },
    [table, updateUrl],
  );

  const setFilter = useCallback(
    <TKey extends keyof FilterState>(key: TKey, value: FilterState[TKey]) => {
      filters.setField(key, value);
      table.resetPage();
      updateUrl({ [key]: value, page: 1 });
    },
    [filters, table, updateUrl],
  );

  const resetFilters = useCallback(() => {
    filters.setState({
      bodegaId: null,
      productoId: null,
      conExistencia: null,
      conReservas: null,
    });
    table.setPagination((current) => ({ ...current, pageIndex: 0 }));
    table.setSearch("");
    table.setServerSearch("");
    table.setSorting([{ id: "actualizadoEn", desc: true }]);

    const next = new URLSearchParams(searchParams);
    [
      "page",
      "search",
      "bodegaId",
      "productoId",
      "conExistencia",
      "conReservas",
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
        INVENTORY_SORT_FIELDS,
        "actualizadoEn",
      ) ?? "actualizadoEn";
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

    const nextFilters: FilterState = {
      bodegaId: parsePositiveIntParam(searchParams.get("bodegaId")),
      productoId: parsePositiveIntParam(searchParams.get("productoId")),
      conExistencia: parseOptionalBooleanParam(
        searchParams.get("conExistencia"),
      ),
      conReservas: parseOptionalBooleanParam(searchParams.get("conReservas")),
    };

    filters.setState((current) =>
      current.bodegaId === nextFilters.bodegaId &&
      current.productoId === nextFilters.productoId &&
      current.conExistencia === nextFilters.conExistencia &&
      current.conReservas === nextFilters.conReservas
        ? current
        : nextFilters,
    );
  }, [searchParams]);

  const queryFilters = useMemo<InventoryListFilters>(() => {
    const sorting = table.sorting[0];
    const sortBy =
      parseEnumParam(
        sorting?.id ?? null,
        INVENTORY_SORT_FIELDS,
        "actualizadoEn",
      ) ?? "actualizadoEn";
    const sortDir: SortDirection = sorting?.desc ? "desc" : "asc";

    return {
      page: table.pagination.pageIndex + 1,
      limit: table.pagination.pageSize,
      search: table.serverSearch || undefined,
      bodegaId: filters.state.bodegaId ?? undefined,
      productoId: filters.state.productoId ?? undefined,
      conExistencia: filters.state.conExistencia ?? undefined,
      conReservas: filters.state.conReservas ?? undefined,
      sortBy: sortBy as InventorySortField,
      sortDir,
    };
  }, [
    filters.state.bodegaId,
    filters.state.conExistencia,
    filters.state.conReservas,
    filters.state.productoId,
    table.pagination.pageIndex,
    table.pagination.pageSize,
    table.serverSearch,
    table.sorting,
  ]);

  return {
    table,
    filters: filters.state,
    queryFilters,
    setPagination,
    setSorting,
    setSearch,
    setServerSearch,
    setBodegaId: (value: number | null) => setFilter("bodegaId", value),
    setProductoId: (value: number | null) => setFilter("productoId", value),
    setConExistencia: (value: boolean | null) =>
      setFilter("conExistencia", value),
    setConReservas: (value: boolean | null) =>
      setFilter("conReservas", value),
    resetFilters,
  };
}
