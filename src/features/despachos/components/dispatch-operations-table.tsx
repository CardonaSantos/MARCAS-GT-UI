import type {
  ColumnDef,
  PaginationState,
} from "@tanstack/react-table";
import { Printer, RefreshCcw } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { dispatchReceiptPath } from "@/features/comprobantes/common/receipt.helpers";

import {
  formatDateTime,
  formatInteger,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import type { DispatchOperation } from "../api/dispatch.types";
import {
  DISPATCH_OPERATION_STATE_LABELS,
  DISPATCH_OPERATION_STATE_TONES,
  DISPATCH_OPERATION_TYPE_LABELS,
} from "../common/dispatch.constants";

interface Props {
  data: DispatchOperation[];
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  onRetryQuery?: () => void;
  canOperate?: boolean;
  canPrintReceipt?: boolean;
  onRetryOperation?: (id: number) => void;
  retryingOperationId?: number | null;
  pagination?: {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
    pageCount: number;
    onPaginationChange: (value: PaginationState) => void;
  };
  toolbar?: React.ReactNode;
  showDispatch?: boolean;
}

export function DispatchOperationsTable({
  showDispatch = false,
  ...props
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUrl = location.pathname + location.search;

  const columns: ColumnDef<DispatchOperation, unknown>[] = [
    {
      accessorKey: "id",
      header: "Operación",
      size: 95,
      cell: ({ row }) => "#" + row.original.id,
    },
    ...(showDispatch
      ? [
          {
            id: "despacho",
            header: "Despacho",
            size: 130,
            cell: ({ row }: { row: { original: DispatchOperation } }) => (
              <Link
                to={"/marcas-gt/despachos/" + row.original.ordenDespachoId}
                state={{ from: currentUrl }}
                className="font-medium text-[hsl(var(--app-primary))] hover:underline"
              >
                {row.original.numeroDespacho}
              </Link>
            ),
          } as ColumnDef<DispatchOperation, unknown>,
        ]
      : []),
    {
      accessorKey: "tipo",
      header: "Tipo",
      size: 175,
      cell: ({ row }) =>
        DISPATCH_OPERATION_TYPE_LABELS[row.original.tipo],
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 105,
      cell: ({ row }) => (
        <AppBadge
          tone={DISPATCH_OPERATION_STATE_TONES[row.original.estado]}
          size="xs"
        >
          {DISPATCH_OPERATION_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      id: "usuario",
      header: "Usuario",
      size: 150,
      cell: ({ row }) => row.original.usuario.nombre,
    },
    {
      accessorKey: "unidades",
      header: "Unidades",
      size: 90,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.unidades),
    },
    {
      accessorKey: "intentos",
      header: "Intentos",
      size: 80,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.intentos),
    },
    {
      accessorKey: "ocurridaEn",
      header: "Ocurrida",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.ocurridaEn),
    },
    {
      accessorKey: "aplicadaEn",
      header: "Aplicada",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.aplicadaEn),
    },
    {
      id: "error",
      header: "Error",
      size: 230,
      meta: { grow: true },
      cell: ({ row }) => row.original.errorAplicacion ?? "—",
    },
    createAppRowActionsColumn<DispatchOperation>({
      actions: (row) => [
        {
          label: "Comprobante de salida",
          icon: <Printer />,
          hidden: !props.canPrintReceipt || row.original.tipo !== "SALIDA_DESPACHO" || row.original.estado !== "APLICADA",
          onClick: () => navigate(dispatchReceiptPath(row.original.ordenDespachoId, row.original.id),
            { state: { from: currentUrl } }),
        },
        {
          label: "Reintentar operación",
          icon: <RefreshCcw />,
          hidden: !props.canOperate || row.original.estado !== "FALLIDA",
          disabled: props.retryingOperationId === row.original.id,
          onClick: () => props.onRetryOperation?.(row.original.id),
        },
      ],
    }),
  ];

  return (
    <AppDataTable
      data={props.data}
      columns={columns}
      getRowId={(row) => String(row.id)}
      isLoading={props.isLoading}
      isFetching={props.isFetching}
      error={props.error}
      onRetry={props.onRetryQuery}
      toolbar={props.toolbar}
      paginationMode={props.pagination ? "server" : "none"}
      pagination={props.pagination}
      density="xs"
      responsiveMode="scroll"
      emptyTitle="Sin operaciones"
      emptyDescription="No existen operaciones técnicas para este criterio."
    />
  );
}
