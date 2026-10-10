import { Eye, Pencil } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

import {
  formatDateTime,
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import {
  ORDER_PAYMENT_CONDITION_LABELS,
  ORDER_PAYMENT_STATE_LABELS,
  ORDER_PAYMENT_STATE_TONES,
  ORDER_STATE_LABELS,
  ORDER_STATE_TONES,
} from "../common/order.constants";
import type { OrderListItem } from "../api/order.types";

interface OrderTableProps {
  data: OrderListItem[];
  canWrite: boolean;
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  onRetry?: () => void;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
    pageCount: number;
    onPaginationChange: (pagination: PaginationState) => void;
  };
  toolbar?: React.ReactNode;
}

export function OrderTable({
  data,
  canWrite,
  isLoading,
  isFetching,
  error,
  onRetry,
  sorting,
  onSortingChange,
  pagination,
  toolbar,
}: OrderTableProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = location.pathname + location.search;

  const go = (path: string) =>
    navigate(path, { state: { from: returnTo } });

  const columns: ColumnDef<OrderListItem, unknown>[] = [
    {
      accessorKey: "numero",
      header: "Número",
      size: 125,
      enableSorting: true,
      cell: ({ row }) => (
        <Link
          to={"/marcas-gt/pedidos/" + row.original.id}
          state={{ from: returnTo }}
          className="font-medium text-[hsl(var(--app-primary))] hover:underline"
        >
          {row.original.numero}
        </Link>
      ),
    },
    {
      id: "cliente",
      header: "Cliente",
      size: 190,
      enableSorting: true,
      meta: { grow: true },
      cell: ({ row }) => row.original.cliente.nombreCompleto,
    },
    {
      id: "vendedor",
      header: "Vendedor",
      size: 155,
      enableSorting: true,
      cell: ({ row }) => row.original.vendedor.nombre,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 165,
      enableSorting: true,
      cell: ({ row }) => (
        <AppBadge tone={ORDER_STATE_TONES[row.original.estado]} size="xs">
          {ORDER_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      accessorKey: "condicionPago",
      header: "Condición",
      size: 125,
      cell: ({ row }) =>
        ORDER_PAYMENT_CONDITION_LABELS[row.original.condicionPago],
    },
    {
      accessorKey: "estadoPago",
      header: "Pago",
      size: 115,
      enableSorting: true,
      cell: ({ row }) => (
        <AppBadge
          tone={ORDER_PAYMENT_STATE_TONES[row.original.estadoPago]}
          size="xs"
        >
          {ORDER_PAYMENT_STATE_LABELS[row.original.estadoPago]}
        </AppBadge>
      ),
    },
    {
      id: "productos",
      header: "Productos",
      size: 95,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.progreso.productos),
    },
    {
      id: "solicitadas",
      header: "Solicitadas",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(row.original.progreso.unidadesSolicitadas),
    },
    {
      id: "reservadas",
      header: "Reservadas",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(row.original.progreso.unidadesReservadas),
    },
    {
      id: "despachadas",
      header: "Despachadas",
      size: 105,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(row.original.progreso.unidadesDespachadas),
    },
    {
      accessorKey: "total",
      header: "Total",
      size: 115,
      enableSorting: true,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.total),
    },
    {
      accessorKey: "creadoEn",
      header: "Creado",
      size: 150,
      enableSorting: true,
      cell: ({ row }) => formatDateTime(row.original.creadoEn),
    },
    createAppRowActionsColumn<OrderListItem>({
      actions: (row) => [
        {
          label: "Ver detalle",
          icon: <Eye />,
          onClick: () => go("/marcas-gt/pedidos/" + row.original.id),
        },
        {
          label: "Editar pedido",
          icon: <Pencil />,
          hidden: !canWrite || row.original.estado !== "BORRADOR",
          separatorBefore: true,
          onClick: () =>
            go("/marcas-gt/pedidos/" + row.original.id + "/editar"),
        },
      ],
    }),
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
      enableSorting
      manualSorting
      sorting={sorting}
      onSortingChange={onSortingChange}
      paginationMode="server"
      pagination={pagination}
      stickyHeader
      density="xs"
      responsiveMode="scroll"
      enableColumnVisibility
      enableColumnPinning
      emptyTitle="Sin pedidos"
      emptyDescription="No se encontraron pedidos con los filtros seleccionados."
    />
  );
}
