import { Eye } from "lucide-react";
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
  CREDIT_APPLICATION_STATE_LABELS,
  CREDIT_APPLICATION_STATE_TONES,
  CREDIT_INTEGRATION_LABELS,
  CREDIT_INTEGRATION_TONES,
} from "../common/credit.constants";
import type { CreditApplicationListItem } from "../api/credit.types";

interface CreditTableProps {
  data: CreditApplicationListItem[];
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

export function CreditTable({
  data,
  isLoading,
  isFetching,
  error,
  onRetry,
  sorting,
  onSortingChange,
  pagination,
  toolbar,
}: CreditTableProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.pathname + location.search;

  const go = (path: string) =>
    navigate(path, {
      state: { from: returnTo },
    });

  const columns: ColumnDef<CreditApplicationListItem, unknown>[] = [
    {
      accessorKey: "numero",
      header: "Solicitud",
      size: 130,
      enableSorting: true,
      cell: ({ row }) => (
        <Link
          to={"/marcas-gt/creditos/solicitudes/" + row.original.id}
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
      size: 150,
      enableSorting: true,
      cell: ({ row }) => row.original.vendedor.nombre,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 125,
      enableSorting: true,
      cell: ({ row }) => (
        <AppBadge
          tone={CREDIT_APPLICATION_STATE_TONES[row.original.estado]}
          size="xs"
        >
          {CREDIT_APPLICATION_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      id: "solicitado",
      header: "Solicitado",
      size: 120,
      enableSorting: true,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.montos.solicitado),
    },
    {
      id: "plazo",
      header: "Plazo",
      size: 90,
      enableSorting: true,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(row.original.plazos.solicitadoDias) + " días",
    },
    {
      id: "reqPendientes",
      header: "Req. pend.",
      size: 95,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(row.original.expediente.requisitosPendientes),
    },
    {
      id: "refPendientes",
      header: "Ref. pend.",
      size: 95,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(row.original.expediente.referenciasPendientes),
    },
    {
      id: "docPendientes",
      header: "Docs. pend.",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(row.original.expediente.documentosPendientes),
    },
    {
      id: "integracion",
      header: "Integración",
      size: 125,
      cell: ({ row }) =>
        row.original.integracion ? (
          <AppBadge
            tone={CREDIT_INTEGRATION_TONES[row.original.integracion.estado]}
            size="xs"
          >
            {CREDIT_INTEGRATION_LABELS[row.original.integracion.estado]}
          </AppBadge>
        ) : (
          "—"
        ),
    },
    {
      id: "solicitadaEn",
      header: "Solicitada",
      size: 150,
      enableSorting: true,
      cell: ({ row }) => formatDateTime(row.original.fechas.solicitadaEn),
    },
    createAppRowActionsColumn<CreditApplicationListItem>({
      actions: (row) => [
        {
          label: "Ver solicitud",
          icon: <Eye />,
          onClick: () =>
            go("/marcas-gt/creditos/solicitudes/" + row.original.id),
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
      emptyTitle="Sin solicitudes de crédito"
      emptyDescription="No se encontraron solicitudes con los filtros seleccionados."
    />
  );
}
