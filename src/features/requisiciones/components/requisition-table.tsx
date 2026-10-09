import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { Eye, PackageCheck, Pencil } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  formatDateTime,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import type { RequisitionListItem } from "../api/requisition.types";
import {
  REQUISITION_STATE_LABELS,
  requisitionStateTone,
} from "../common/requisition.constants";
import { RequisitionProgress } from "./requisition-progress";

export function RequisitionTable({
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
  data: RequisitionListItem[];
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

  const columns: ColumnDef<RequisitionListItem, unknown>[] = [
    {
      accessorKey: "id",
      header: "Requisición",
      size: 115,
      enableSorting: false,
      cell: ({ row }) => (
        <Link
          to={"/marcas-gt/requisiciones/" + row.original.id}
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
      size: 135,
      enableSorting: true,
      cell: ({ row }) => (
        <AppBadge tone={requisitionStateTone(row.original.estado)} size="xs">
          {REQUISITION_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      id: "bodega",
      accessorFn: (row) => row.bodega.nombre,
      header: "Bodega destino",
      size: 190,
      enableSorting: true,
      meta: { grow: true },
      cell: ({ row }) =>
        row.original.bodega.codigo + " · " + row.original.bodega.nombre,
    },
    {
      id: "proveedor",
      accessorFn: (row) => row.proveedor?.nombre ?? "",
      header: "Proveedor",
      size: 180,
      enableSorting: true,
      cell: ({ row }) => row.original.proveedor?.nombre ?? "Sin asignar",
    },
    {
      id: "solicitante",
      accessorFn: (row) => row.solicitante.nombre,
      header: "Solicitante",
      size: 150,
      enableSorting: true,
    },
    {
      id: "progreso",
      header: "Recepción",
      size: 180,
      enableSorting: false,
      cell: ({ row }) => (
        <RequisitionProgress
          received={row.original.progreso.unidadesRecibidas}
          requested={row.original.progreso.unidadesSolicitadas}
          percentage={row.original.progreso.porcentajeRecepcion}
          compact
        />
      ),
    },
    {
      id: "pendiente",
      header: "Pendiente",
      size: 100,
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="tabular-nums">
          {row.original.progreso.unidadesPendientes}
        </span>
      ),
    },
    {
      id: "costo",
      header: "Estimado",
      size: 120,
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.progreso.costoEstimado),
    },
    {
      accessorKey: "creadoEn",
      header: "Creada",
      size: 150,
      enableSorting: true,
      cell: ({ row }) => formatDateTime(row.original.creadoEn),
    },
    createAppRowActionsColumn<RequisitionListItem>({
      actions: (row) => [
        {
          label: "Ver detalle",
          icon: <Eye />,
          onClick: () => go("/marcas-gt/requisiciones/" + row.original.id),
        },
        {
          label: "Editar borrador",
          icon: <Pencil />,
          hidden: !canOperate || row.original.estado !== "BORRADOR",
          onClick: () =>
            go("/marcas-gt/requisiciones/" + row.original.id + "/editar"),
        },
        {
          label: "Registrar recepción",
          icon: <PackageCheck />,
          hidden:
            !canOperate ||
            !["APROBADA", "PARCIAL"].includes(row.original.estado),
          onClick: () =>
            go("/marcas-gt/requisiciones/" + row.original.id + "/recibir"),
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
      emptyTitle="Sin requisiciones"
      emptyDescription="No se encontraron requisiciones con los filtros seleccionados."
    />
  );
}
