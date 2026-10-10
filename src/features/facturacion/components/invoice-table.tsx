import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  formatDateTime,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import type { InvoiceListItem } from "../api/billing.types";
import {
  FISCAL_STATE_LABELS,
  FISCAL_STATE_TONES,
  INVOICE_STATE_LABELS,
  INVOICE_STATE_TONES,
} from "../common/billing.constants";

interface Props {
  data: InvoiceListItem[];
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  onRetry?: () => void;
  sorting: SortingState;
  onSortingChange: (value: SortingState) => void;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
    pageCount: number;
    onPaginationChange: (value: PaginationState) => void;
  };
  toolbar?: React.ReactNode;
}

export function InvoiceTable(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.pathname + location.search;

  const columns: ColumnDef<InvoiceListItem, unknown>[] = [
    {
      id: "factura",
      header: "Factura",
      size: 115,
      cell: ({ row }) => (
        <Link
          to={"/marcas-gt/facturacion/facturas/" + row.original.id}
          state={{ from }}
          className="font-medium text-[hsl(var(--app-primary))] hover:underline"
        >
          {row.original.serie && row.original.numero
            ? row.original.serie + "-" + row.original.numero
            : "#" + row.original.id}
        </Link>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 135,
      enableSorting: true,
      cell: ({ row }) => (
        <AppBadge tone={INVOICE_STATE_TONES[row.original.estado]} size="xs">
          {INVOICE_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      id: "fiscal",
      header: "Fiscal",
      size: 145,
      cell: ({ row }) =>
        row.original.fiscal ? (
          <AppBadge tone={FISCAL_STATE_TONES[row.original.fiscal.estado]} size="xs">
            {FISCAL_STATE_LABELS[row.original.fiscal.estado]}
          </AppBadge>
        ) : (
          "—"
        ),
    },
    {
      id: "cliente",
      header: "Cliente",
      size: 200,
      meta: { grow: true },
      cell: ({ row }) => row.original.cliente.nombreCompleto,
    },
    {
      id: "pedido",
      header: "Pedido",
      size: 120,
      cell: ({ row }) => row.original.pedido?.numero ?? "—",
    },
    {
      accessorKey: "condicionPago",
      header: "Condición",
      size: 120,
      cell: ({ row }) => row.original.condicionPago ?? "—",
    },
    {
      accessorKey: "total",
      header: "Total",
      size: 110,
      enableSorting: true,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.total),
    },
    {
      id: "cxp",
      header: "CxC",
      size: 115,
      cell: ({ row }) =>
        row.original.cuentaPorCobrar
          ? formatMoney(row.original.cuentaPorCobrar.saldoPendiente)
          : "—",
    },
    {
      accessorKey: "creadoEn",
      header: "Creada",
      size: 155,
      enableSorting: true,
      cell: ({ row }) => formatDateTime(row.original.creadoEn),
    },
    createAppRowActionsColumn<InvoiceListItem>({
      actions: (row) => [
        {
          label: "Ver factura",
          icon: <Eye />,
          onClick: () =>
            navigate("/marcas-gt/facturacion/facturas/" + row.original.id, {
              state: { from },
            }),
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
      onRetry={props.onRetry}
      toolbar={props.toolbar}
      enableSorting
      manualSorting
      sorting={props.sorting}
      onSortingChange={props.onSortingChange}
      paginationMode="server"
      pagination={props.pagination}
      stickyHeader
      density="xs"
      responsiveMode="scroll"
      enableColumnVisibility
      enableColumnPinning
      emptyTitle="Sin facturas"
      emptyDescription="No se encontraron facturas con los filtros seleccionados."
    />
  );
}
