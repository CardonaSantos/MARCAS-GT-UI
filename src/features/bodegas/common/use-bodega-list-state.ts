import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { PaginationState, SortingState } from "@tanstack/react-table";

import {
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/ui/components/app/handlers";
import {
  BODEGA_SORT_DIRECTIONS,
  BODEGA_SORT_FIELDS,
} from "./bodega.constants";
import type {
  BodegaListFilters,
  BodegaSortField,
  SortDirection,
} from "../api/bodega.types";

type BodegaFilterState = {
  activo: boolean | null;
  esPrincipal: boolean | null;
  responsableId: number | null;
};

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseOptionalBoolean(value: string | null) {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function parseOptionalId(value: string | null) {
  if (!value) return null;

  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseSortField(value: string | null): BodegaSortField {
  return BODEGA_SORT_FIELDS.includes(value as BodegaSortField)
    ? (value as BodegaSortField)
    : "nombre";
}

function parseSortDirection(value: string | null): SortDirection {
  return BODEGA_SORT_DIRECTIONS.includes(value as SortDirection)
    ? (value as SortDirection)
    : "asc";
}

function booleanParam(value: boolean | null) {
  return value === null ? null : String(value);
}

export function useBodegaListState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = parsePositiveInt(searchParams.get("page"), 1);
  const initialLimit = parsePositiveInt(searchParams.get("limit"), 20);
  const initialSearch = searchParams.get("search") ?? "";
  const initialSortBy = parseSortField(searchParams.get("sortBy"));
  const initialSortDir = parseSortDirection(searchParams.get("sortDir"));

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

  const filters = useAppStateHandlers<BodegaFilterState>({
    activo: parseOptionalBoolean(searchParams.get("activo")),
    esPrincipal: parseOptionalBoolean(searchParams.get("esPrincipal")),
    responsableId: parseOptionalId(searchParams.get("responsableId")),
  });

  const updateUrl = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams);

      Object.entries(patch).forEach(([key, value]) => {
        if (value === null || value === "") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      });

      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const setPagination = useCallback(
    (next: PaginationState) => {
      table.setPagination(next);
      updateUrl({
        page: String(next.pageIndex + 1),
        limit: String(next.pageSize),
      });
    },
    [table, updateUrl],
  );

  const setSorting = useCallback(
    (next: SortingState) => {
      const resolved =
        next.length > 0
          ? next
          : [
              {
                id: "nombre",
                desc: false,
              },
            ];

      table.setSorting(resolved);

      const current = resolved[0];

      updateUrl({
        sortBy: current?.id ?? "nombre",
        sortDir: current?.desc ? "desc" : "asc",
        page: "1",
      });

      table.resetPage();
    },
    [table, updateUrl],
  );

  const setSearch = useCallback(
    (value: string) => {
      table.handleSearchChange(value);
    },
    [table],
  );

  const setServerSearch = useCallback(
    (value: string) => {
      table.handleDebouncedSearch(value);
      updateUrl({
        search: value || null,
        page: "1",
      });
    },
    [table, updateUrl],
  );

  const setActivo = useCallback(
    (value: boolean | null) => {
      filters.setField("activo", value);
      table.resetPage();
      updateUrl({
        activo: booleanParam(value),
        page: "1",
      });
    },
    [filters, table, updateUrl],
  );

  const setEsPrincipal = useCallback(
    (value: boolean | null) => {
      filters.setField("esPrincipal", value);
      table.resetPage();
      updateUrl({
        esPrincipal: booleanParam(value),
        page: "1",
      });
    },
    [filters, table, updateUrl],
  );

  const setResponsableId = useCallback(
    (value: number | null) => {
      filters.setField("responsableId", value);
      table.resetPage();
      updateUrl({
        responsableId: value ? String(value) : null,
        page: "1",
      });
    },
    [filters, table, updateUrl],
  );

  const resetFilters = useCallback(() => {
    filters.setState({
      activo: null,
      esPrincipal: null,
      responsableId: null,
    });
    table.setPagination((current) => ({ ...current, pageIndex: 0 }));
    table.setSearch("");
    table.setServerSearch("");
    table.setSorting([{ id: "nombre", desc: false }]);

    const next = new URLSearchParams(searchParams);
    [
      "page",
      "search",
      "activo",
      "esPrincipal",
      "responsableId",
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
    const page = parsePositiveInt(searchParams.get("page"), 1);
    const limit = parsePositiveInt(searchParams.get("limit"), 20);
    const search = searchParams.get("search") ?? "";
    const sortBy = parseSortField(searchParams.get("sortBy"));
    const sortDir = parseSortDirection(searchParams.get("sortDir"));
    const activo = parseOptionalBoolean(searchParams.get("activo"));
    const esPrincipal = parseOptionalBoolean(searchParams.get("esPrincipal"));
    const responsableId = parseOptionalId(searchParams.get("responsableId"));

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

    filters.setState((current) => {
      if (
        current.activo === activo &&
        current.esPrincipal === esPrincipal &&
        current.responsableId === responsableId
      ) {
        return current;
      }

      return {
        activo,
        esPrincipal,
        responsableId,
      };
    });
  }, [searchParams]);

  const queryFilters = useMemo<BodegaListFilters>(() => {
    const sorting = table.sorting[0];
    const sortBy = parseSortField(sorting?.id ?? "nombre");
    const sortDir: SortDirection = sorting?.desc ? "desc" : "asc";

    return {
      page: table.pagination.pageIndex + 1,
      limit: table.pagination.pageSize,
      search: table.serverSearch || undefined,
      activo: filters.state.activo ?? undefined,
      esPrincipal: filters.state.esPrincipal ?? undefined,
      responsableId: filters.state.responsableId ?? undefined,
      sortBy,
      sortDir,
    };
  }, [
    filters.state.activo,
    filters.state.esPrincipal,
    filters.state.responsableId,
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
    setActivo,
    setEsPrincipal,
    setResponsableId,
    resetFilters,
  };
}
