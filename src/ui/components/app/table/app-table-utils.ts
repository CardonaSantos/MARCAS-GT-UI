import type * as React from "react";
import type {
  Column,
  PaginationState,
  RowSelectionState,
  SortingState,
  Updater,
  VisibilityState,
} from "@tanstack/react-table";

export function resolveUpdater<T>(updater: Updater<T>, current: T): T {
  return typeof updater === "function"
    ? (updater as (old: T) => T)(current)
    : updater;
}

export function normalizeMaxHeight(maxHeight: string | number | undefined) {
  if (typeof maxHeight === "number") {
    return `${maxHeight}px`;
  }

  return maxHeight;
}

export function getSelectionCount(selection: RowSelectionState) {
  return Object.keys(selection).length;
}

export function getPageCount(
  pageSize: number,
  totalRows?: number,
  pageCount?: number,
) {
  if (pageCount !== undefined) {
    return Math.max(pageCount, 1);
  }

  if (totalRows !== undefined) {
    return Math.max(Math.ceil(totalRows / pageSize), 1);
  }

  return 1;
}

export function getSortingParam(sorting: SortingState) {
  const first = sorting[0];

  if (!first) {
    return undefined;
  }

  return {
    sortBy: first.id,
    sortDirection: first.desc ? "desc" : "asc",
  };
}

export function makePagination(pageIndex: number, pageSize: number) {
  return {
    pageIndex,
    pageSize,
  } satisfies PaginationState;
}

export function makeVisibilityState(
  values: Record<string, boolean>,
): VisibilityState {
  return values;
}

export function getColumnPinningStyle<TData>(
  column: Column<TData, unknown>,
  isHeader = false,
): React.CSSProperties {
  const pinned = column.getIsPinned();

  if (!pinned) {
    return {};
  }

  const isLeft = pinned === "left";

  return {
    position: "sticky",
    left: isLeft ? `${column.getStart("left")}px` : undefined,
    right: !isLeft ? `${column.getAfter("right")}px` : undefined,
    zIndex: isHeader ? 30 : 15,
  };
}

export function stringifyCsvValue(value: unknown) {
  if (value === null || value === undefined) return "";

  const text =
    value instanceof Date
      ? value.toISOString()
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);

  return `"${text.replace(/"/g, '""')}"`;
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
