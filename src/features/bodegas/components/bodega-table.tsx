import { Eye, Pencil, PowerOff, UserCog } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";

import { formatDateTime, formatInteger } from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppStatusDot } from "@/ui/components/app/primitives/app-status-dot";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import type { BodegaListItem } from "../api/bodega.types";

interface BodegaTableProps {
  data: BodegaListItem[];
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  onRetry?: () => void;
  isAdmin: boolean;
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

export function BodegaTable({
  data,
  isLoading,
  isFetching,
  error,
  onRetry,
  isAdmin,
  sorting,
  onSortingChange,
  pagination,
  toolbar,
}: BodegaTableProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.pathname + location.search;

  const go = (path: string) =>
    navigate(path, {
      state: { from: returnTo },
    });

  const columns: ColumnDef<BodegaListItem, unknown>[] = [
    {
      accessorKey: "codigo",
      header: "Código",
      size: 120,
      enableSorting: true,
    },
    {
      accessorKey: "nombre",
      header: "Nombre",
      size: 220,
      enableSorting: true,
      meta: { grow: true },
      cell: ({ row }) => (
        <Link
          to={"/marcas-gt/bodegas/" + row.original.id}
          state={{ from: returnTo }}
          className="font-medium text-[hsl(var(--app-primary))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--app-ring))]"
        >
          {row.original.nombre}
        </Link>
      ),
    },
    {
      id: "responsable",
      header: "Responsable",
      size: 180,
      enableSorting: false,
      cell: ({ row }) => row.original.responsable?.nombre ?? "Sin asignar",
    },
    {
      id: "disponible",
      header: "Disponible",
      size: 120,
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatInteger(row.original.operacion.stockDisponible)}
        </span>
      ),
    },
    {
      id: "reservado",
      header: "Reservado",
      size: 110,
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatInteger(row.original.operacion.stockReservado)}
        </span>
      ),
    },
    {
      id: "estado",
      header: "Estado",
      size: 110,
      enableSorting: false,
      cell: ({ row }) => (
        <AppStatusDot
          tone={row.original.activo ? "success" : "danger"}
          label={row.original.activo ? "Activa" : "Inactiva"}
          size="sm"
        />
      ),
    },
    {
      id: "principal",
      header: "Principal",
      size: 100,
      enableSorting: false,
      cell: ({ row }) =>
        row.original.esPrincipal ? (
          <AppBadge tone="primary" size="xs">
            Principal
          </AppBadge>
        ) : (
          "—"
        ),
    },
    {
      accessorKey: "actualizadoEn",
      header: "Actualizada",
      size: 150,
      enableSorting: true,
      cell: ({ row }) => formatDateTime(row.original.actualizadoEn),
    },
    createAppRowActionsColumn<BodegaListItem>({
      actions: (row) => [
        {
          label: "Ver detalle",
          icon: <Eye />,
          onClick: () => go("/marcas-gt/bodegas/" + row.original.id),
        },
        {
          label: "Editar",
          icon: <Pencil />,
          hidden: !isAdmin,
          onClick: () =>
            go("/marcas-gt/bodegas/" + row.original.id + "/editar"),
        },
        {
          label: "Cambiar responsable",
          icon: <UserCog />,
          hidden: !isAdmin,
          onClick: () =>
            go("/marcas-gt/bodegas/" + row.original.id + "/responsable"),
        },
        {
          label: "Desactivar",
          icon: <PowerOff />,
          tone: "danger",
          separatorBefore: true,
          hidden: !isAdmin || !row.original.activo,
          onClick: () =>
            go("/marcas-gt/bodegas/" + row.original.id + "/desactivar"),
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
      emptyTitle="No hay bodegas"
      emptyDescription="No se encontraron bodegas con los filtros seleccionados."
    />
  );
}
