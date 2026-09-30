import * as React from "react";
import {
  ColumnPinningState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { AppCard } from "../primitives/app-card";
import { AppDataState } from "../primitives/app-data-state";
import {
  appDataTableCellVariants,
  appDataTableFooterVariants,
  appDataTableHeaderRowVariants,
  appDataTableRowVariants,
  appDataTableScrollVariants,
  appDataTableShellVariants,
  appDataTableToolbarVariants,
  appTableMobileCardVariants,
  appTableMobileCardsVariants,
} from "../theme/app-data-table.variants";
import type {
  AppDataTableDensity,
  AppDataTableProps,
} from "./app-data-table.types";
import { AppTableColumnVisibility } from "./app-table-column-visibility";
import { AppTablePagination } from "./app-table-pagination";
import {
  getColumnPinningStyle,
  getPageCount,
  getSelectionCount,
  normalizeMaxHeight,
  resolveUpdater,
} from "./app-table-utils";

function getEstimatedRowHeight(density: AppDataTableDensity) {
  if (density === "xs") return 36;
  if (density === "sm") return 40;
  return 46;
}

function AppTableSortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") {
    return <ArrowUp className="h-3 w-3" />;
  }

  if (sorted === "desc") {
    return <ArrowDown className="h-3 w-3" />;
  }

  return <ChevronsUpDown className="h-3 w-3 opacity-50" />;
}

function getColumnGridTemplate<TData>(
  columns: Array<Column<TData, unknown>>,
  before = 0,
  after = 0,
) {
  const parts: string[] = [];

  if (before > 0) {
    parts.push(`${before}px`);
  }

  parts.push(
    ...columns.map((column) => {
      const size = column.getSize();

      if (column.columnDef.meta?.grow) {
        return `minmax(${size}px, 1fr)`;
      }

      return `${size}px`;
    }),
  );

  if (after > 0) {
    parts.push(`${after}px`);
  }

  return parts.join(" ");
}

export function AppDataTable<TData>({
  data,
  columns,
  getRowId,

  isLoading = false,
  isFetching = false,
  error,
  isEmpty,
  onRetry,

  emptyTitle = "No hay datos",
  emptyDescription = "No se encontraron registros para mostrar.",

  variant = "card",
  radius = "md",
  density = "xs",
  responsiveMode = "scroll",

  className,
  toolbarClassName,
  scrollClassName,
  tableClassName,
  footerClassName,
  bulkClassName,

  toolbar,
  rightToolbar,
  bulkActions,

  enableSorting = true,
  manualSorting = true,
  sorting,
  onSortingChange,

  enableRowSelection = false,
  rowSelection,
  onRowSelectionChange,

  enableColumnVisibility = true,
  columnVisibility,
  onColumnVisibilityChange,

  columnFilters,
  onColumnFiltersChange,
  manualFiltering = true,

  columnOrder,
  onColumnOrderChange,

  enableColumnPinning = true,
  columnPinning,
  onColumnPinningChange,

  paginationMode = "server",
  pagination,

  enableVirtualization = true,
  estimateRowHeight,
  overscan = 8,

  enableColumnVirtualization = false,
  estimateColumnWidth = 160,
  columnOverscan = 3,

  maxHeight = "calc(100dvh - 260px)",
  stickyHeader = true,
  hoverable = true,

  onRowClick,

  loadingRows = 6,
  loadingVariant = "skeleton",

  renderEmpty,
  renderError,
  renderMobileCard,
}: AppDataTableProps<TData>) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const [internalSorting, setInternalSorting] = React.useState<SortingState>(
    [],
  );
  const [internalRowSelection, setInternalRowSelection] =
    React.useState<RowSelectionState>({});
  const [internalColumnVisibility, setInternalColumnVisibility] =
    React.useState<VisibilityState>({});
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: pagination?.pageIndex ?? 0,
      pageSize: pagination?.pageSize ?? 10,
    });

  const [internalColumnPinning, setInternalColumnPinning] =
    React.useState<ColumnPinningState>({
      left: [],
      right: [],
    });

  const currentSorting = sorting ?? internalSorting;
  const currentRowSelection = rowSelection ?? internalRowSelection;
  const currentColumnVisibility = columnVisibility ?? internalColumnVisibility;

  const currentColumnPinning = columnPinning ?? internalColumnPinning;

  const currentPagination: PaginationState = pagination
    ? {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      }
    : internalPagination;

  const pageCount = getPageCount(
    currentPagination.pageSize,
    pagination?.totalRows,
    pagination?.pageCount,
  );

  const handleSortingChange = React.useCallback(
    (updater: unknown) => {
      const next = resolveUpdater(
        updater as Parameters<typeof setInternalSorting>[0],
        currentSorting,
      );

      if (sorting === undefined) {
        setInternalSorting(next);
      }

      onSortingChange?.(next);
    },
    [currentSorting, onSortingChange, sorting],
  );

  const handleRowSelectionChange = React.useCallback(
    (updater: unknown) => {
      const next = resolveUpdater(
        updater as Parameters<typeof setInternalRowSelection>[0],
        currentRowSelection,
      );

      if (rowSelection === undefined) {
        setInternalRowSelection(next);
      }

      onRowSelectionChange?.(next);
    },
    [currentRowSelection, onRowSelectionChange, rowSelection],
  );

  const handleColumnVisibilityChange = React.useCallback(
    (updater: unknown) => {
      const next = resolveUpdater(
        updater as Parameters<typeof setInternalColumnVisibility>[0],
        currentColumnVisibility,
      );

      if (columnVisibility === undefined) {
        setInternalColumnVisibility(next);
      }

      onColumnVisibilityChange?.(next);
    },
    [columnVisibility, currentColumnVisibility, onColumnVisibilityChange],
  );

  const handlePaginationChange = React.useCallback(
    (updater: unknown) => {
      const next = resolveUpdater(
        updater as Parameters<typeof setInternalPagination>[0],
        currentPagination,
      );

      if (!pagination) {
        setInternalPagination(next);
      }

      pagination?.onPaginationChange(next);
    },
    [currentPagination, pagination],
  );

  const handleColumnPinningChange = React.useCallback(
    (updater: unknown) => {
      const next = resolveUpdater(
        updater as Parameters<typeof setInternalColumnPinning>[0],
        currentColumnPinning,
      );

      if (columnPinning === undefined) {
        setInternalColumnPinning(next);
      }

      onColumnPinningChange?.(next);
    },
    [columnPinning, currentColumnPinning, onColumnPinningChange],
  );

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: {
      sorting: currentSorting,
      rowSelection: currentRowSelection,
      columnVisibility: currentColumnVisibility,
      pagination: currentPagination,
      columnFilters,
      columnOrder,
      columnPinning: currentColumnPinning,
    },
    defaultColumn: {
      minSize: 80,
      size: 160,
      maxSize: 700,
    },
    enableSorting,
    manualSorting,
    enableRowSelection,
    enableColumnPinning,
    manualFiltering,
    manualPagination: paginationMode === "server",
    pageCount,
    onSortingChange: handleSortingChange,
    onRowSelectionChange: handleRowSelectionChange,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onPaginationChange: handlePaginationChange,
    onColumnFiltersChange: onColumnFiltersChange
      ? (updater) => {
          const next = resolveUpdater(updater, columnFilters ?? []);
          onColumnFiltersChange(next);
        }
      : undefined,
    onColumnOrderChange: onColumnOrderChange
      ? (updater) => {
          const next = resolveUpdater(updater, columnOrder ?? []);
          onColumnOrderChange(next);
        }
      : undefined,
    onColumnPinningChange: handleColumnPinningChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel:
      paginationMode === "server" || manualSorting
        ? undefined
        : getSortedRowModel(),
    getPaginationRowModel:
      paginationMode === "client" ? getPaginationRowModel() : undefined,
  });

  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();

  const hasPinnedColumns =
    visibleColumns.some((column) => column.getIsPinned()) &&
    enableColumnPinning;

  const shouldVirtualizeColumns =
    enableColumnVirtualization &&
    !hasPinnedColumns &&
    visibleColumns.length > 0;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowHeight ?? getEstimatedRowHeight(density),
    overscan,
    enabled: enableVirtualization && !isLoading && rows.length > 0,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: visibleColumns.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) =>
      visibleColumns[index]?.getSize() ?? estimateColumnWidth,
    overscan: columnOverscan,
    enabled: shouldVirtualizeColumns,
  });

  const virtualColumns = shouldVirtualizeColumns
    ? columnVirtualizer.getVirtualItems()
    : [];

  const renderedColumns = shouldVirtualizeColumns
    ? virtualColumns
        .map((virtualColumn) => visibleColumns[virtualColumn.index])
        .filter(Boolean)
    : visibleColumns;

  const beforeVirtualColumns =
    shouldVirtualizeColumns && virtualColumns.length > 0
      ? (virtualColumns[0]?.start ?? 0)
      : 0;

  const afterVirtualColumns =
    shouldVirtualizeColumns && virtualColumns.length > 0
      ? Math.max(
          columnVirtualizer.getTotalSize() -
            (virtualColumns[virtualColumns.length - 1]?.end ?? 0),
          0,
        )
      : 0;

  const gridTemplateColumns = getColumnGridTemplate(
    renderedColumns,
    beforeVirtualColumns,
    afterVirtualColumns,
  );

  // const tableWidth = shouldVirtualizeColumns
  //   ? columnVirtualizer.getTotalSize()
  //   : table.getTotalSize();
  const tableMinWidth = shouldVirtualizeColumns
    ? columnVirtualizer.getTotalSize()
    : table.getTotalSize();

  const hasGrowColumn = renderedColumns.some(
    (column) => column.columnDef.meta?.grow,
  );

  const tableWidth: React.CSSProperties["width"] = hasGrowColumn
    ? "100%"
    : tableMinWidth;

  const selectedCount = getSelectionCount(currentRowSelection);
  const resolvedIsEmpty = isEmpty ?? rows.length === 0;

  const renderHeader = () => (
    <div
      role="row"
      className={appDataTableHeaderRowVariants({
        density,
        sticky: stickyHeader,
      })}
      style={{
        gridTemplateColumns,
        width: tableWidth,
        minWidth: tableMinWidth,
      }}
    >
      {shouldVirtualizeColumns && beforeVirtualColumns > 0 ? (
        <div aria-hidden="true" />
      ) : null}

      {renderedColumns.map((column) => {
        const headerGroups = table.getHeaderGroups();
        const lastHeaderGroup = headerGroups[headerGroups.length - 1];

        const header = lastHeaderGroup?.headers.find(
          (item) => item.column.id === column.id,
        );

        if (!header) return null;

        const canSort = header.column.getCanSort();
        const sorted = header.column.getIsSorted();
        const pinned = hasPinnedColumns ? column.getIsPinned() : false;

        return (
          <div
            key={header.id}
            role="columnheader"
            className={cn(
              appDataTableCellVariants({
                density,
                align: column.columnDef.meta?.align ?? "left",
                truncate: true,
                pinned: pinned || false,
                header: true,
              }),
              pinned && "bg-[hsl(var(--app-table-pinned-header-bg))]",
              column.columnDef.meta?.headerClassName,
            )}
            style={
              hasPinnedColumns ? getColumnPinningStyle(column, true) : undefined
            }
          >
            {header.isPlaceholder ? null : canSort ? (
              <button
                type="button"
                className="flex min-w-0 items-center gap-1 text-left hover:text-[hsl(var(--app-table-foreground))]"
                onClick={header.column.getToggleSortingHandler()}
              >
                <span className="min-w-0 truncate">
                  {flexRender(column.columnDef.header, header.getContext())}
                </span>
                <AppTableSortIcon sorted={sorted} />
              </button>
            ) : (
              <div className="min-w-0 truncate">
                {flexRender(column.columnDef.header, header.getContext())}
              </div>
            )}
          </div>
        );
      })}

      {shouldVirtualizeColumns && afterVirtualColumns > 0 ? (
        <div aria-hidden="true" />
      ) : null}
    </div>
  );

  const renderRow = (row: Row<TData>, virtualStart?: number) => {
    const cellByColumnId = new Map(
      row.getVisibleCells().map((cell) => [cell.column.id, cell]),
    );

    return (
      <div
        key={row.id}
        role="row"
        data-state={row.getIsSelected() ? "selected" : undefined}
        className={cn(
          appDataTableRowVariants({
            density,
            hoverable,
            selected: row.getIsSelected(),
            clickable: Boolean(onRowClick),
          }),
          enableVirtualization &&
            virtualStart !== undefined &&
            "absolute left-0 top-0",
        )}
        style={{
          gridTemplateColumns,
          width: tableWidth,
          minWidth: tableMinWidth,
          ...(enableVirtualization && virtualStart !== undefined
            ? {
                transform: `translateY(${virtualStart}px)`,
              }
            : undefined),
        }}
        onClick={() => onRowClick?.(row)}
      >
        {shouldVirtualizeColumns && beforeVirtualColumns > 0 ? (
          <div aria-hidden="true" />
        ) : null}

        {renderedColumns.map((column) => {
          const cell = cellByColumnId.get(column.id);
          const pinned = hasPinnedColumns ? column.getIsPinned() : false;

          if (!cell) return null;

          return (
            <div
              key={cell.id}
              role="cell"
              className={cn(
                appDataTableCellVariants({
                  density,
                  align: column.columnDef.meta?.align ?? "left",
                  truncate: column.columnDef.meta?.truncate ?? true,
                  pinned: pinned || false,
                  header: false,
                }),
                column.columnDef.meta?.cellClassName,
              )}
              style={
                hasPinnedColumns
                  ? getColumnPinningStyle(column, false)
                  : undefined
              }
              onClick={(event) => {
                if (column.id === "__select" || column.id === "__actions") {
                  event.stopPropagation();
                }
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          );
        })}

        {shouldVirtualizeColumns && afterVirtualColumns > 0 ? (
          <div aria-hidden="true" />
        ) : null}
      </div>
    );
  };

  const renderBody = () => {
    if (enableVirtualization) {
      const virtualRows = rowVirtualizer.getVirtualItems();

      return (
        <div
          role="rowgroup"
          className="relative"
          style={{
            height: rowVirtualizer.getTotalSize(),
            width: tableWidth,
            minWidth: tableMinWidth,
          }}
        >
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];

            if (!row) return null;

            return renderRow(row, virtualRow.start);
          })}
        </div>
      );
    }
    return (
      <div
        role="rowgroup"
        style={{
          width: tableWidth,
          minWidth: tableMinWidth,
        }}
      >
        {rows.map((row) => renderRow(row))}
      </div>
    );
  };

  const renderCards = () => {
    if (responsiveMode !== "cards" || !renderMobileCard) {
      return null;
    }

    return (
      <div className={appTableMobileCardsVariants()}>
        {rows.map((row) => (
          <AppCard
            key={row.id}
            size="xs"
            className={cn(
              appTableMobileCardVariants(),
              row.getIsSelected() &&
                "bg-[hsl(var(--app-table-row-selected-bg))]",
            )}
            onClick={() => onRowClick?.(row)}
          >
            {renderMobileCard(row, table)}
          </AppCard>
        ))}
      </div>
    );
  };

  const tableContent = (
    <>
      {(toolbar || rightToolbar || enableColumnVisibility) && (
        <div className={cn(appDataTableToolbarVariants(), toolbarClassName)}>
          <div className="min-w-0">{toolbar}</div>

          <div className="flex min-w-0 items-center justify-end gap-2">
            {rightToolbar}
            {enableColumnVisibility ? (
              <AppTableColumnVisibility table={table} />
            ) : null}
          </div>
        </div>
      )}

      {selectedCount > 0 && bulkActions ? (
        <div className={bulkClassName}>{bulkActions}</div>
      ) : null}

      {renderCards()}

      <div
        ref={scrollRef}
        role="table"
        aria-rowcount={pagination?.totalRows}
        className={cn(
          appDataTableScrollVariants(),
          responsiveMode === "cards" && renderMobileCard && "hidden md:block",
          scrollClassName,
        )}
        style={{
          maxHeight: normalizeMaxHeight(maxHeight),
        }}
      >
        <div
          className={tableClassName}
          style={{
            width: tableWidth,
            minWidth: tableMinWidth,
          }}
        >
          {renderHeader()}
          {renderBody()}
        </div>
      </div>

      {paginationMode !== "none" && pagination ? (
        <div className={cn(appDataTableFooterVariants(), footerClassName)}>
          <div className="min-h-4 text-xs text-[hsl(var(--app-muted-foreground))]">
            {selectedCount > 0
              ? `${selectedCount} seleccionado${selectedCount === 1 ? "" : "s"}`
              : isFetching
                ? "Actualizando..."
                : null}
          </div>

          <AppTablePagination
            pageIndex={currentPagination.pageIndex}
            pageSize={currentPagination.pageSize}
            pageCount={pageCount}
            totalRows={pagination.totalRows}
            pageSizeOptions={pagination.pageSizeOptions}
            disabled={isLoading || isFetching}
            onPageIndexChange={(pageIndex) => {
              handlePaginationChange({
                pageIndex,
                pageSize: currentPagination.pageSize,
              });
            }}
            onPageSizeChange={(pageSize) => {
              handlePaginationChange({
                pageIndex: 0,
                pageSize,
              });
            }}
          />
        </div>
      ) : null}
    </>
  );

  return (
    <div
      className={cn(
        appDataTableShellVariants({
          variant,
          radius,
        }),
        className,
      )}
    >
      <AppDataState
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        isEmpty={resolvedIsEmpty}
        onRetry={onRetry}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        loadingRows={loadingRows}
        loadingVariant={loadingVariant}
        emptyFallback={renderEmpty}
        errorFallback={renderError}
        size="xs"
      >
        {tableContent}
      </AppDataState>
    </div>
  );
}
