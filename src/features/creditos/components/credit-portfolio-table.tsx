import { Eye } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";

import {
  formatDateTime,
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import type { CreditPortfolioItem } from "../api/credit.types";

export function CreditPortfolioTable({
  data,
  isLoading,
  isFetching,
  error,
  onRetry,
  pagination,
  toolbar,
}: {
  data: CreditPortfolioItem[];
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  onRetry?: () => void;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
    pageCount: number;
    onPaginationChange: (pagination: PaginationState) => void;
  };
  toolbar?: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.pathname + location.search;

  const columns: ColumnDef<CreditPortfolioItem, unknown>[] = [
    {
      accessorKey: "numero",
      header: "Crédito",
      size: 125,
    },
    {
      id: "solicitud",
      header: "Solicitud",
      size: 130,
      cell: ({ row }) => (
        <Link
          to={
            "/marcas-gt/creditos/solicitudes/" +
            row.original.solicitud.id
          }
          state={{ from: returnTo }}
          className="font-medium text-[hsl(var(--app-primary))] hover:underline"
        >
          {row.original.solicitud.numero}
        </Link>
      ),
    },
    {
      id: "cliente",
      header: "Cliente",
      size: 190,
      meta: { grow: true },
      cell: ({ row }) => row.original.cliente.nombreCompleto,
    },
    {
      id: "vendedor",
      header: "Vendedor",
      size: 150,
      cell: ({ row }) => row.original.vendedor.nombre,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 100,
      cell: ({ row }) => (
        <AppBadge
          tone={row.original.estado === "ACTIVO" ? "success" : "neutral"}
          size="xs"
        >
          {row.original.estado}
        </AppBadge>
      ),
    },
    {
      id: "autorizado",
      header: "Autorizado",
      size: 120,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.montos.autorizado),
    },
    {
      id: "financiado",
      header: "Financiado",
      size: 120,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.montos.financiado),
    },
    {
      id: "saldo",
      header: "Saldo",
      size: 120,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.montos.saldoPendiente),
    },
    {
      id: "vencidas",
      header: "CxC vencidas",
      size: 105,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.cuentas.vencidas),
    },
    {
      id: "proximoVencimiento",
      header: "Próx. vencimiento",
      size: 150,
      cell: ({ row }) =>
        formatDateTime(row.original.cuentas.proximoVencimiento),
    },
    {
      accessorKey: "aprobadoEn",
      header: "Aprobado",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.aprobadoEn),
    },
    createAppRowActionsColumn<CreditPortfolioItem>({
      actions: (row) => [
        {
          label: "Ver solicitud",
          icon: <Eye />,
          onClick: () =>
            navigate(
              "/marcas-gt/creditos/solicitudes/" +
                row.original.solicitud.id,
              { state: { from: returnTo } },
            ),
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
      paginationMode="server"
      pagination={pagination}
      density="xs"
      stickyHeader
      responsiveMode="scroll"
      enableColumnVisibility
      emptyTitle="Sin créditos en cartera"
      emptyDescription="No se encontraron créditos con los filtros seleccionados."
    />
  );
}
