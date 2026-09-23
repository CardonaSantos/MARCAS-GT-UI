import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { AppBadge, type AppBadgeProps } from "../primitives/app-badge";

export function createAppTextColumn<TData>({
  id,
  accessorKey,
  header,
  size = 160,
  getValue,
  fallback = "-",
}: {
  id?: string;
  accessorKey?: keyof TData & string;
  header: string;
  size?: number;
  getValue?: (row: TData) => React.ReactNode;
  fallback?: React.ReactNode;
}): ColumnDef<TData, unknown> {
  return {
    id: id ?? accessorKey,
    accessorKey,
    header,
    size,
    cell: ({ row }) => {
      const value = getValue
        ? getValue(row.original)
        : accessorKey
          ? (row.original[accessorKey] as React.ReactNode)
          : undefined;

      return value ?? fallback;
    },
  };
}

export function createAppBadgeColumn<TData, TValue extends string>({
  id,
  header,
  size = 120,
  getValue,
  getTone,
  fallback = "-",
}: {
  id: string;
  header: string;
  size?: number;
  getValue: (row: TData) => TValue | null | undefined;
  getTone: (value: TValue, row: TData) => AppBadgeProps["tone"];
  fallback?: React.ReactNode;
}): ColumnDef<TData, unknown> {
  return {
    id,
    header,
    size,
    cell: ({ row }) => {
      const value = getValue(row.original);

      if (!value) {
        return fallback;
      }

      return (
        <AppBadge size="xs" tone={getTone(value, row.original)}>
          {value}
        </AppBadge>
      );
    },
  };
}

export function createAppDateColumn<TData>({
  id,
  header,
  size = 130,
  getValue,
  format = "DD/MM/YYYY",
  fallback = "-",
}: {
  id: string;
  header: string;
  size?: number;
  getValue: (row: TData) => Date | string | null | undefined;
  format?: string;
  fallback?: React.ReactNode;
}): ColumnDef<TData, unknown> {
  return {
    id,
    header,
    size,
    cell: ({ row }) => {
      const value = getValue(row.original);

      if (!value) {
        return fallback;
      }

      const parsed = dayjs(value);

      if (!parsed.isValid()) {
        return fallback;
      }

      return parsed.format(format);
    },
  };
}
