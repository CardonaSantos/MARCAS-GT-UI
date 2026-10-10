import type { ColumnDef, PaginationState } from "@tanstack/react-table";

import {
  formatDateTime,
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

import { INVENTORY_MOVEMENT_LABELS } from "../common/inventory.constants";
import type { InventoryMovement } from "../api/inventory.types";

interface InventoryMovementTableProps {
  data: InventoryMovement[];
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  onRetry?: () => void;
  toolbar?: React.ReactNode;
  pagination?: {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
    pageCount: number;
    onPaginationChange: (pagination: PaginationState) => void;
  };
}

export function InventoryMovementTable({
  data,
  isLoading,
  isFetching,
  error,
  onRetry,
  toolbar,
  pagination,
}: InventoryMovementTableProps) {
  const columns: ColumnDef<InventoryMovement, unknown>[] = [
    {
      accessorKey: "creadoEn",
      header: "Fecha",
      size: 155,
      cell: ({ row }) => formatDateTime(row.original.creadoEn),
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      size: 180,
      cell: ({ row }) => (
        <AppBadge tone="neutral" size="xs">
          {INVENTORY_MOVEMENT_LABELS[row.original.tipo]}
        </AppBadge>
      ),
    },
    {
      accessorKey: "cantidad",
      header: "Cantidad",
      size: 95,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.cantidad),
    },
    {
      accessorKey: "cantidadRealAntes",
      header: "Real antes",
      size: 95,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.cantidadRealAntes),
    },
    {
      accessorKey: "cantidadRealDespues",
      header: "Real después",
      size: 105,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.cantidadRealDespues),
    },
    {
      accessorKey: "reservadaAntes",
      header: "Reservado antes",
      size: 115,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.reservadaAntes),
    },
    {
      accessorKey: "reservadaDespues",
      header: "Reservado después",
      size: 125,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.reservadaDespues),
    },
    {
      accessorKey: "costoUnitario",
      header: "Costo unitario",
      size: 120,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.costoUnitario),
    },
    {
      id: "actor",
      header: "Usuario",
      size: 165,
      cell: ({ row }) => row.original.actor?.nombre ?? "Sistema",
    },
    {
      id: "referenciaTipo",
      header: "Tipo referencia",
      size: 145,
      cell: ({ row }) => row.original.referencia?.type ?? "—",
    },
    {
      id: "referenciaId",
      header: "ID referencia",
      size: 105,
      meta: { align: "right" },
      cell: ({ row }) => row.original.referencia?.id ?? "—",
    },
  ];

  return (
    <AppDataTable
      data={data}
      columns={columns}
      getRowId={(row) => String(row.id)}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      onRetry={onRetry}
      toolbar={toolbar}
      paginationMode={pagination ? "server" : "none"}
      pagination={pagination}
      stickyHeader
      density="xs"
      responsiveMode="scroll"
      enableColumnVisibility
      emptyTitle="Sin movimientos"
      emptyDescription="No hay movimientos de inventario para el contexto seleccionado."
    />
  );
}
