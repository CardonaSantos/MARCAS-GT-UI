import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  formatDateTime,
  formatInteger,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import type { DispatchListItem } from "../api/dispatch.types";
import {
  DISPATCH_STATE_LABELS,
  DISPATCH_STATE_TONES,
} from "../common/dispatch.constants";

interface Props {
  data: DispatchListItem[];
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

export function DispatchTable(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.pathname + location.search;

  const go = (id: number) =>
    navigate("/marcas-gt/despachos/" + id, {
      state: { from: returnTo },
    });

  const columns: ColumnDef<DispatchListItem, unknown>[] = [
    {
      accessorKey: "numero",
      header: "Despacho",
      size: 125,
      enableSorting: true,
      cell: ({ row }) => (
        <Link
          to={"/marcas-gt/despachos/" + row.original.id}
          state={{ from: returnTo }}
          className="font-medium text-[hsl(var(--app-primary))] hover:underline"
        >
          {row.original.numero}
        </Link>
      ),
    },
    {
      id: "pedido",
      header: "Pedido",
      size: 120,
      enableSorting: true,
      cell: ({ row }) => row.original.pedido.numero,
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
      id: "bodega",
      header: "Bodega",
      size: 170,
      enableSorting: true,
      cell: ({ row }) => row.original.bodega.nombre,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 170,
      enableSorting: true,
      cell: ({ row }) => (
        <AppBadge tone={DISPATCH_STATE_TONES[row.original.estado]} size="xs">
          {DISPATCH_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      id: "programadas",
      header: "Programadas",
      size: 105,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.progreso.unidadesProgramadas),
    },
    {
      id: "preparadas",
      header: "Preparadas",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.progreso.unidadesPreparadas),
    },
    {
      id: "despachadas",
      header: "Despachadas",
      size: 105,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.progreso.unidadesDespachadas),
    },
    {
      id: "pendPrep",
      header: "Pend. preparar",
      size: 110,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(row.original.progreso.unidadesPendientesPreparacion),
    },
    {
      id: "pendDesp",
      header: "Pend. despachar",
      size: 115,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(row.original.progreso.unidadesPendientesDespacho),
    },
    {
      id: "fallidas",
      header: "Fallos",
      size: 80,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span
          className={
            row.original.operaciones.fallidas > 0
              ? "font-semibold text-[hsl(var(--app-danger))]"
              : undefined
          }
        >
          {formatInteger(row.original.operaciones.fallidas)}
        </span>
      ),
    },
    {
      id: "programadoEn",
      header: "Programado",
      size: 155,
      enableSorting: true,
      cell: ({ row }) => formatDateTime(row.original.tiempos.programadoEn),
    },
    {
      id: "atrasado",
      header: "Atraso",
      size: 95,
      cell: ({ row }) =>
        row.original.tiempos.atrasado ? (
          <AppBadge tone="danger" size="xs">
            {row.original.tiempos.horasAtraso.toFixed(1)} h
          </AppBadge>
        ) : (
          "—"
        ),
    },
    createAppRowActionsColumn<DispatchListItem>({
      actions: (row) => [
        {
          label: "Ver despacho",
          icon: <Eye />,
          onClick: () => go(row.original.id),
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
      emptyTitle="Sin órdenes de despacho"
      emptyDescription="No se encontraron despachos con los filtros seleccionados."
    />
  );
}
