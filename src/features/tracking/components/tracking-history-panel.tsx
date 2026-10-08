import * as React from "react";

import {
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/ui/components/app/handlers";
import { AppStack } from "@/ui/components/app/primitives/app-stack";


import { useTrackingHistory } from "../api/tracking.queries";
import {
  TRACKING_HISTORY_FILTERS_DEFAULT,
  toTrackingHistoryQueryParams,
  type TrackingHistoryFiltersState,
} from "../api/tracking.filters";

import { TrackingHistoryFilters } from "./tracking-history-filters";
import { TrackingHistoryTable } from "./tracking-history-table";
import { createTrackingHistoryColumns } from "./tracking-history-table.columns";

const EMPTY_ITEMS: never[] = [];

export function TrackingHistoryPanel() {
  const table = useAppTableHandlers({
    initialPageIndex: 0,
    initialPageSize: 20,
    initialDensity: "xs",
    resetPageOnSearch: true,
  });

  const filters = useAppStateHandlers<TrackingHistoryFiltersState>(
    TRACKING_HISTORY_FILTERS_DEFAULT,
  );

  const queryParams = React.useMemo(
    () =>
      toTrackingHistoryQueryParams({
        pageIndex: table.pagination.pageIndex,
        pageSize: table.pagination.pageSize,
        search: table.serverSearch,
        filters: filters.state,
      }),
    [
      filters.state,
      table.pagination.pageIndex,
      table.pagination.pageSize,
      table.serverSearch,
    ],
  );

  const historyQuery = useTrackingHistory(queryParams);
  const tecnicoOptions = React.useMemo(() => {
    const employees = (historyQuery.data?.items ?? []).map((item) => ({
      value: item.usuario.id, label: item.usuario.nombre,
    }));
    return [...new Map(employees.map((item) => [item.value, item])).values()]
      .sort((a, b) => a.label.localeCompare(b.label, "es"));
  }, [historyQuery.data?.items]);

  const columns = React.useMemo(() => createTrackingHistoryColumns(), []);

  const handleFilterChange = <TKey extends keyof TrackingHistoryFiltersState>(
    key: TKey,
    value: TrackingHistoryFiltersState[TKey],
  ) => {
    filters.setField(key, value);
    table.resetPage();
  };

  const hasActiveFilters =
    Boolean(table.search.trim()) ||
    filters.state.usuarioId !== null ||
    filters.state.estadoSesion !== null ||
    filters.state.fecha.start !== null ||
    filters.state.fecha.end !== null;

  const handleClearFilters = () => {
    filters.reset(TRACKING_HISTORY_FILTERS_DEFAULT);
    table.handleSearchChange("");
    table.handleDebouncedSearch("");
    table.resetPage();
  };

  return (
    <AppStack gap="sm">
      <TrackingHistoryFilters
        search={table.search}
        filters={filters.state}
        tecnicoOptions={tecnicoOptions}
        isLoadingTecnicos={false}
        isSearching={historyQuery.isFetching}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={table.handleSearchChange}
        onDebouncedSearchChange={table.handleDebouncedSearch}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      <TrackingHistoryTable
        data={historyQuery.data?.items ?? EMPTY_ITEMS}
        columns={columns}
        totalRows={historyQuery.data?.total ?? 0}
        table={table}
        isLoading={historyQuery.isPending}
        isFetching={historyQuery.isFetching}
        error={historyQuery.error}
        onRetry={() => historyQuery.refetch()}
      />
    </AppStack>
  );
}
