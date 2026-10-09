import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { Eye, PackageCheck, Pencil, Send } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { formatDateTime } from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import type { TransferListItem } from "../api/transfer.types";
import {
  TRANSFER_STATE_LABELS,
  transferStateTone,
} from "../common/transfer.constants";
import { TransferProgress } from "./transfer-progress";

export function TransferTable({
  data,
  role,
  isLoading,
  isFetching,
  error,
  onRetry,
  sorting,
  onSortingChange,
  pagination,
  toolbar,
}: {
  data: TransferListItem[];
  role: string | null;
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
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.pathname + location.search;
  const canOperate = role === "ADMIN" || role === "BODEGA";

  const go = (path: string) =>
    navigate(path, {
      state: { from: returnTo },
    });

  const columns: ColumnDef<TransferListItem, unknown>[] = [
    {
      accessorKey: "id",
      header: "Transferencia",
      size: 120,
      enableSorting: false,
      cell: ({ row }) => (
        <Link
          to={"/marcas-gt/transferencias/" + row.original.id}
          state={{ from: returnTo }}
          className="font-medium text-[hsl(var(--app-primary))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--app-ring))]"
        >
          {"#" + row.original.id}
        </Link>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 145,
      enableSorting: true,
      cell: ({ row }) => (
        <AppBadge tone={transferStateTone(row.original.estado)} size="xs">
          {TRANSFER_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      id: "bodegaOrigen",
      accessorFn: (row) => row.bodegaOrigen.nombre,
      header: "Origen",
      size: 180,
      enableSorting: true,
      meta: { grow: true },
      cell: ({ row }) =>
        row.original.bodegaOrigen.codigo +
        " · " +
        row.original.bodegaOrigen.nombre,
    },
    {
      id: "bodegaDestino",
      accessorFn: (row) => row.bodegaDestino.nombre,
      header: "Destino",
      size: 180,
      enableSorting: true,
      meta: { grow: true },
      cell: ({ row }) =>
        row.original.bodegaDestino.codigo +
        " · " +
        row.original.bodegaDestino.nombre,
    },
    {
      id: "progreso",
      header: "Recepción",
      size: 190,
      enableSorting: false,
      cell: ({ row }) => (
        <TransferProgress
          received={row.original.progreso.unidadesRecibidas}
          sent={row.original.progreso.unidadesEnviadas}
          percentage={row.original.progreso.porcentajeRecepcion}
          compact
        />
      ),
    },
    {
      id: "transito",
      header: "En tránsito",
      size: 105,
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="tabular-nums">
          {row.original.progreso.unidadesEnTransito}
        </span>
      ),
    },
    {
      id: "creadoPor",
      accessorFn: (row) => row.creadoPor.nombre,
      header: "Creado por",
      size: 150,
      enableSorting: true,
    },
    {
      accessorKey: "creadoEn",
      header: "Creada",
      size: 155,
      enableSorting: true,
      cell: ({ row }) => formatDateTime(row.original.creadoEn),
    },
    createAppRowActionsColumn<TransferListItem>({
      actions: (row) => [
        {
          label: "Ver detalle",
          icon: <Eye />,
          onClick: () => go("/marcas-gt/transferencias/" + row.original.id),
        },
        {
          label: "Editar borrador",
          icon: <Pencil />,
          hidden: !canOperate || row.original.estado !== "BORRADOR",
          onClick: () =>
            go("/marcas-gt/transferencias/" + row.original.id + "/editar"),
        },
        {
          label: "Registrar salida",
          icon: <Send />,
          hidden: !canOperate || row.original.estado !== "PREPARADA",
          onClick: () =>
            go("/marcas-gt/transferencias/" + row.original.id + "/salida"),
        },
        {
          label: "Registrar recepción",
          icon: <PackageCheck />,
          hidden:
            !canOperate ||
            !["EN_TRANSITO", "RECIBIDA_PARCIAL"].includes(row.original.estado),
          onClick: () =>
            go("/marcas-gt/transferencias/" + row.original.id + "/recibir"),
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
      emptyTitle="Sin transferencias"
      emptyDescription="No se encontraron transferencias con los filtros seleccionados."
    />
  );
}
