import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { RotateCcw } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  formatDateTime,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

import type { TransferOperation } from "../api/transfer.types";
import {
  TRANSFER_OPERATION_STATE_LABELS,
  TRANSFER_OPERATION_TYPE_LABELS,
  transferOperationTone,
} from "../common/transfer.constants";

export function TransferOperationsTable({
  operations,
  isLoading,
  isFetching,
  error,
  onRetryQuery,
  onRetryOperation,
  showTransfer = false,
  pagination,
}: {
  operations: TransferOperation[];
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  onRetryQuery?: () => void;
  onRetryOperation?: (operation: TransferOperation) => void;
  showTransfer?: boolean;
  pagination?: {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
    pageCount: number;
    onPaginationChange: (pagination: PaginationState) => void;
  };
}) {
  const location = useLocation();
  const currentUrl = location.pathname + location.search;

  const columns: ColumnDef<TransferOperation, unknown>[] = [
    {
      accessorKey: "id",
      header: "Operación",
      size: 100,
      cell: ({ row }) => "#" + row.original.id,
    },
    ...(showTransfer
      ? [
          {
            accessorKey: "transferenciaId",
            header: "Transferencia",
            size: 120,
            cell: ({ row }: { row: { original: TransferOperation } }) => (
              <Link
                to={"/marcas-gt/transferencias/" + row.original.transferenciaId}
                state={{ from: currentUrl }}
                className="font-medium text-[hsl(var(--app-primary))] hover:underline"
              >
                {"#" + row.original.transferenciaId}
              </Link>
            ),
          } as ColumnDef<TransferOperation, unknown>,
        ]
      : []),
    {
      accessorKey: "tipo",
      header: "Tipo",
      size: 105,
      cell: ({ row }) => TRANSFER_OPERATION_TYPE_LABELS[row.original.tipo],
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 110,
      cell: ({ row }) => (
        <AppBadge tone={transferOperationTone(row.original.estado)} size="xs">
          {TRANSFER_OPERATION_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      accessorKey: "documentoReferencia",
      header: "Documento",
      size: 150,
      meta: { grow: true },

      cell: ({ row }) => row.original.documentoReferencia ?? "—",
    },
    {
      accessorKey: "unidades",
      header: "Unidades",
      size: 95,
      meta: { align: "right" },
    },
    {
      accessorKey: "costoTotal",
      header: "Valor",
      size: 120,
      meta: { align: "right" },
      cell: ({ row }) =>
        row.original.costoTotal == null
          ? "—"
          : formatMoney(row.original.costoTotal),
    },
    {
      id: "usuario",
      header: "Usuario",
      size: 150,
      meta: { grow: true },
      cell: ({ row }) => row.original.usuario.nombre,
    },
    {
      accessorKey: "ocurridaEn",
      header: "Ocurrida",
      size: 160,
      cell: ({ row }) => formatDateTime(row.original.ocurridaEn),
    },
    {
      id: "accion",
      header: "Acción",
      size: 140,
      enableSorting: false,
      cell: ({ row }) =>
        onRetryOperation &&
        ["PENDIENTE", "FALLIDA"].includes(row.original.estado) ? (
          <AppButton
            variant="secondary"
            size="sm"
            leftIcon={<RotateCcw />}
            onClick={() => onRetryOperation(row.original)}
          >
            Reintentar
          </AppButton>
        ) : (
          "—"
        ),
    },
  ];

  return (
    <AppDataTable
      data={operations}
      columns={columns}
      getRowId={(row) => String(row.id)}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      onRetry={onRetryQuery}
      paginationMode={pagination ? "server" : "none"}
      {...(pagination ? { pagination } : {})}
      density="xs"
      responsiveMode="scroll"
      emptyTitle="Sin operaciones"
      emptyDescription="Todavía no existen salidas o recepciones para esta transferencia."
    />
  );
}
