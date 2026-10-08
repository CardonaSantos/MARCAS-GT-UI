import type { ColumnDef } from "@tanstack/react-table";

import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import type { useAppTableHandlers } from "@/ui/components/app/handlers";
import type { TrackingHistoryItem } from "../api/tracking.types";

type TableController = ReturnType<typeof useAppTableHandlers>;

type TrackingHistoryTableProps = {
  data: TrackingHistoryItem[];
  columns: ColumnDef<TrackingHistoryItem, any>[];
  totalRows: number;
  table: TableController;
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  onRetry?: () => void;
};

export function TrackingHistoryTable({
  data,
  columns,
  totalRows,
  table,
  isLoading = false,
  isFetching = false,
  error,
  onRetry,
}: TrackingHistoryTableProps) {
  return (
    <AppCard variant="outline" size="xs" radius="md">
      <AppDataTable<TrackingHistoryItem>
        data={data}
        columns={columns}
        getRowId={(row) => String(row.asistenciaId)}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={onRetry}
        paginationMode="server"
        {...table.getDataTableStateProps()}
        pagination={table.getPaginationConfig({
          totalRows,
          pageSizeOptions: [10, 20, 50, 100],
        })}
        enableColumnVisibility
        enableColumnPinning
        stickyHeader
        density={table.density}
        maxHeight="70vh"
      />
    </AppCard>
  );
}
