import { Eye, Pencil, PowerOff } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";

import {
  formatDateTime,
  formatDecimal,
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import type { CreditPolicy } from "../api/credit.types";

export function CreditPolicyTable({
  data,
  isAdmin,
  isLoading,
  isFetching,
  error,
  onRetry,
  pagination,
  toolbar,
}: {
  data: CreditPolicy[];
  isAdmin: boolean;
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

  const go = (path: string) =>
    navigate(path, { state: { from: returnTo } });

  const columns: ColumnDef<CreditPolicy, unknown>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre",
      size: 220,
      meta: { grow: true },
      cell: ({ row }) => (
        <Link
          to={"/marcas-gt/creditos/politicas/" + row.original.id}
          state={{ from: returnTo }}
          className="font-medium text-[hsl(var(--app-primary))] hover:underline"
        >
          {row.original.nombre}
        </Link>
      ),
    },
    {
      accessorKey: "activo",
      header: "Estado",
      size: 100,
      cell: ({ row }) => (
        <AppBadge tone={row.original.activo ? "success" : "neutral"} size="xs">
          {row.original.activo ? "Activa" : "Inactiva"}
        </AppBadge>
      ),
    },
    {
      accessorKey: "montoMaximo",
      header: "Monto máximo",
      size: 130,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.montoMaximo, "Sin límite"),
    },
    {
      accessorKey: "plazoMaximoDias",
      header: "Plazo máximo",
      size: 120,
      meta: { align: "right" },
      cell: ({ row }) =>
        row.original.plazoMaximoDias == null
          ? "Sin límite"
          : formatInteger(row.original.plazoMaximoDias) + " días",
    },
    {
      accessorKey: "porcentajeAnticipo",
      header: "Anticipo mín.",
      size: 110,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatDecimal(row.original.porcentajeAnticipo ?? 0) + "%",
    },
    {
      id: "requisitos",
      header: "Requisitos",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(
          row.original.requisitos.filter((requirement) => requirement.activo)
            .length,
        ),
    },
    {
      accessorKey: "actualizadoEn",
      header: "Actualizada",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.actualizadoEn),
    },
    createAppRowActionsColumn<CreditPolicy>({
      actions: (row) => [
        {
          label: "Ver política",
          icon: <Eye />,
          onClick: () =>
            go("/marcas-gt/creditos/politicas/" + row.original.id),
        },
        {
          label: "Editar",
          icon: <Pencil />,
          hidden: !isAdmin,
          onClick: () =>
            go(
              "/marcas-gt/creditos/politicas/" +
                row.original.id +
                "/editar",
            ),
        },
        {
          label: "Desactivar",
          icon: <PowerOff />,
          tone: "danger",
          separatorBefore: true,
          hidden: !isAdmin || !row.original.activo,
          onClick: () =>
            go(
              "/marcas-gt/creditos/politicas/" +
                row.original.id +
                "/desactivar",
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
      emptyTitle="Sin políticas"
      emptyDescription="No se encontraron políticas de crédito."
    />
  );
}
