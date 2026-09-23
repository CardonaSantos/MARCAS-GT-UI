import * as React from "react";
import type {
  ColumnPinningState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import type { AppDataTableDensity } from "../table/app-data-table.types";
import {
  getSelectionCount,
  getSortingParam,
  makePagination,
} from "../table/app-table-utils";

export interface UseAppTableHandlersOptions {
  initialPageIndex?: number;
  initialPageSize?: number;
  initialSorting?: SortingState;
  initialRowSelection?: RowSelectionState;
  initialColumnVisibility?: VisibilityState;
  initialColumnPinning?: ColumnPinningState;
  initialDensity?: AppDataTableDensity;
  resetPageOnSearch?: boolean;
}

export function useAppTableHandlers(options: UseAppTableHandlersOptions = {}) {
  const {
    initialPageIndex = 0,
    initialPageSize = 10,
    initialSorting = [],
    initialRowSelection = {},
    initialColumnVisibility = {},
    initialColumnPinning = {
      left: ["__select"],
      right: ["__actions"],
    },
    initialDensity = "xs",
    resetPageOnSearch = true,
  } = options;

  const [pagination, setPagination] = React.useState<PaginationState>(() =>
    makePagination(initialPageIndex, initialPageSize),
  );

  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);

  const [rowSelection, setRowSelection] =
    React.useState<RowSelectionState>(initialRowSelection);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility);

  const [columnPinning, setColumnPinning] =
    React.useState<ColumnPinningState>(initialColumnPinning);

  const [density, setDensity] =
    React.useState<AppDataTableDensity>(initialDensity);

  const [search, setSearch] = React.useState("");
  const [serverSearch, setServerSearch] = React.useState("");

  const selectedCount = React.useMemo(
    () => getSelectionCount(rowSelection),
    [rowSelection],
  );

  const sortingParam = React.useMemo(() => getSortingParam(sorting), [sorting]);

  const resetPage = React.useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, []);

  const clearSelection = React.useCallback(() => {
    setRowSelection({});
  }, []);

  const resetTable = React.useCallback(() => {
    setPagination(makePagination(initialPageIndex, initialPageSize));
    setSorting(initialSorting);
    setRowSelection(initialRowSelection);
    setColumnVisibility(initialColumnVisibility);
    setColumnPinning(initialColumnPinning);
    setDensity(initialDensity);
    setSearch("");
    setServerSearch("");
  }, [
    initialColumnPinning,
    initialColumnVisibility,
    initialDensity,
    initialPageIndex,
    initialPageSize,
    initialRowSelection,
    initialSorting,
  ]);

  const handleSearchChange = React.useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleDebouncedSearch = React.useCallback(
    (value: string) => {
      setServerSearch(value);

      if (resetPageOnSearch) {
        setPagination((prev) => ({
          ...prev,
          pageIndex: 0,
        }));
      }
    },
    [resetPageOnSearch],
  );

  const getPaginationConfig = React.useCallback(
    (config: {
      totalRows?: number;
      pageCount?: number;
      pageSizeOptions?: number[];
    }) => ({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalRows: config.totalRows,
      pageCount: config.pageCount,
      pageSizeOptions: config.pageSizeOptions,
      onPaginationChange: setPagination,
    }),
    [pagination.pageIndex, pagination.pageSize],
  );

  const getDataTableStateProps = React.useCallback(
    () => ({
      sorting,
      onSortingChange: setSorting,
      rowSelection,
      onRowSelectionChange: setRowSelection,
      columnVisibility,
      onColumnVisibilityChange: setColumnVisibility,
      columnPinning,
      onColumnPinningChange: setColumnPinning,
      density,
    }),
    [columnPinning, columnVisibility, density, rowSelection, sorting],
  );

  return {
    pagination,
    setPagination,

    sorting,
    setSorting,
    sortingParam,

    rowSelection,
    setRowSelection,
    selectedCount,
    clearSelection,

    columnVisibility,
    setColumnVisibility,

    columnPinning,
    setColumnPinning,

    density,
    setDensity,

    search,
    setSearch,
    serverSearch,
    setServerSearch,

    resetPage,
    resetTable,

    handleSearchChange,
    handleDebouncedSearch,

    getPaginationConfig,
    getDataTableStateProps,
  };
}
