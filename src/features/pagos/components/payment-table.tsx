import type {
  ColumnDef,
  PaginationState,
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

import type { PaymentListItem } from "../api/payment.types";
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATE_LABELS,
  PAYMENT_STATE_TONES,
} from "../common/payment.constants";

interface Props {
  data: PaymentListItem[];
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  onRetry?: () => void;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
    pageCount: number;
    onPaginationChange: (value: PaginationState) => void;
  };
  toolbar?: React.ReactNode;
}

export function PaymentTable(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.pathname + location.search;

  const columns: ColumnDef<PaymentListItem, unknown>[] = [
    {
      accessorKey: "id",
      header: "Pago",
      size: 85,
      cell: ({ row }) => (
        <Link
          to={"/marcas-gt/pagos/" + row.original.id}
          state={{ from }}
          className="font-medium text-[hsl(var(--app-primary))] hover:underline"
        >
          #{row.original.id}
        </Link>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 120,
      cell: ({ row }) => (
        <AppBadge tone={PAYMENT_STATE_TONES[row.original.estado]} size="xs">
          {PAYMENT_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      id: "cliente",
      header: "Cliente",
      size: 190,
      meta: { grow: true },
      cell: ({ row }) =>
        [row.original.cliente.nombre, row.original.cliente.apellido]
          .filter(Boolean)
          .join(" "),
    },
    {
      id: "pedido",
      header: "Pedido",
      size: 115,
      cell: ({ row }) => row.original.pedido?.numero ?? "—",
    },
    {
      accessorKey: "metodo",
      header: "Método",
      size: 150,
      cell: ({ row }) => PAYMENT_METHOD_LABELS[row.original.metodo],
    },
    {
      accessorKey: "monto",
      header: "Monto",
      size: 105,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.monto),
    },
    {
      accessorKey: "montoAplicado",
      header: "A CxC",
      size: 105,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.montoAplicado),
    },
    {
      accessorKey: "montoDisponible",
      header: "Saldo / destino",
      size: 180,
      meta: { align: "right" },
      cell: ({ row }) => {
        const payment = row.original;
        const direct = ["PREPAGO", "CONTRAENTREGA"].includes(
          payment.pedido?.condicionPago ?? "",
        );
        return (
          <span
            className="whitespace-nowrap tabular-nums"
            title={direct
              ? "Saldo verificado vinculado al pedido, sin aplicación a CxC"
              : "Saldo pendiente de aplicación a cartera"}
          >
            {formatMoney(payment.montoDisponible)}
            <span className="ml-2 text-xs text-[hsl(var(--app-muted-foreground))]">
              {payment.estado === "VERIFICADO"
                ? direct ? "Anticipo" : "CxC"
                : "Sin verificar"}
            </span>
          </span>
        );
      },
    },
    {
      accessorKey: "referencia",
      header: "Referencia",
      size: 150,
      cell: ({ row }) => row.original.referencia ?? "—",
    },
    {
      accessorKey: "fechaPago",
      header: "Fecha pago",
      size: 155,
      cell: ({ row }) => formatDateTime(row.original.fechaPago),
    },
    createAppRowActionsColumn<PaymentListItem>({
      actions: (row) => [
        {
          label: "Ver pago",
          icon: <Eye />,
          onClick: () =>
            navigate("/marcas-gt/pagos/" + row.original.id, {
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
      paginationMode="server"
      pagination={props.pagination}
      stickyHeader
      density="xs"
      responsiveMode="scroll"
      enableColumnVisibility
      enableColumnPinning
      emptyTitle="Sin pagos"
      emptyDescription="No se encontraron pagos con los filtros seleccionados."
    />
  );
}
