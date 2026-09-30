import type * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  Table,
  VisibilityState,
} from "@tanstack/react-table";
import type { VariantProps } from "class-variance-authority";

import type {
  appDataTableCellVariants,
  appDataTableShellVariants,
} from "../theme/app-data-table.variants";

export type AppDataTableDensity = "xs" | "sm" | "md";

export type AppDataTableResponsiveMode = "scroll" | "cards";

export type AppDataTablePaginationMode = "client" | "server" | "none";

// export type AppDataTableColumnMeta = {
//   align?: VariantProps<typeof appDataTableCellVariants>["align"];
//   truncate?: boolean;
//   headerClassName?: string;
//   cellClassName?: string;
// };

export type AppDataTableColumnMeta = {
  align?: VariantProps<typeof appDataTableCellVariants>["align"];
  truncate?: boolean;
  headerClassName?: string;
  cellClassName?: string;

  /**
   * Permite que una columna absorba el espacio sobrante del grid.
   * Útil para que la última columna de acciones no parezca gigante.
   */
  grow?: boolean;
};

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> extends AppDataTableColumnMeta {}
}

export interface AppDataTablePaginationConfig {
  pageIndex: number;
  pageSize: number;
  totalRows?: number;
  pageCount?: number;
  pageSizeOptions?: number[];
  onPaginationChange: (pagination: PaginationState) => void;
}

export interface AppDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];

  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;

  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  isEmpty?: boolean;
  onRetry?: () => void;

  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;

  variant?: VariantProps<typeof appDataTableShellVariants>["variant"];
  radius?: VariantProps<typeof appDataTableShellVariants>["radius"];
  density?: AppDataTableDensity;
  responsiveMode?: AppDataTableResponsiveMode;

  className?: string;
  toolbarClassName?: string;
  scrollClassName?: string;
  tableClassName?: string;
  footerClassName?: string;
  bulkClassName?: string;

  toolbar?: React.ReactNode;
  rightToolbar?: React.ReactNode;
  bulkActions?: React.ReactNode;

  enableSorting?: boolean;
  manualSorting?: boolean;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;

  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;

  enableColumnVisibility?: boolean;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;

  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  manualFiltering?: boolean;

  columnOrder?: ColumnOrderState;
  onColumnOrderChange?: (order: ColumnOrderState) => void;

  enableColumnPinning?: boolean;
  columnPinning?: ColumnPinningState;
  onColumnPinningChange?: (pinning: ColumnPinningState) => void;

  paginationMode?: AppDataTablePaginationMode;
  pagination?: AppDataTablePaginationConfig;

  enableVirtualization?: boolean;
  estimateRowHeight?: number;
  overscan?: number;

  enableColumnVirtualization?: boolean;
  estimateColumnWidth?: number;
  columnOverscan?: number;

  maxHeight?: string | number;
  stickyHeader?: boolean;
  hoverable?: boolean;

  onRowClick?: (row: Row<TData>) => void;

  loadingRows?: number;
  loadingVariant?: "skeleton" | "skeleton-card" | "skeleton-grid";

  renderEmpty?: React.ReactNode;
  renderError?: React.ReactNode;
  renderMobileCard?: (row: Row<TData>, table: Table<TData>) => React.ReactNode;
}

export type AppTableActionTone = "default" | "danger" | "warning" | "success";

export interface AppTableRowAction<TData> {
  label: React.ReactNode;
  icon?: React.ReactNode;
  tone?: AppTableActionTone;
  disabled?: boolean;
  hidden?: boolean;
  separatorBefore?: boolean;
  onClick: (row: Row<TData>) => void;
}

export interface AppTableBulkAction {
  label: React.ReactNode;
  icon?: React.ReactNode;
  tone?: AppTableActionTone;
  disabled?: boolean;
  hidden?: boolean;
  onClick: () => void;
}

export interface AppTableExportColumn<TData> {
  key: string;
  label: string;
  getValue: (row: TData) => unknown;
}
