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
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import type { ShipmentListItem } from "../api/transport.types";
import {
  SHIPMENT_MODE_LABELS,
  SHIPMENT_STATE_LABELS,
  SHIPMENT_STATE_TONES,
} from "../common/transport.constants";

interface Props {
  data: ShipmentListItem[];
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

export function ShipmentTable(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.pathname + location.search;

  const go = (id: number) =>
    navigate("/marcas-gt/transporte/envios/" + id, {
      state: { from: returnTo },
    });

  const columns: ColumnDef<ShipmentListItem, unknown>[] = [
    {
      accessorKey: "numero",
      header: "Envío",
      size: 125,
      enableSorting: true,
      cell: ({ row }) => (
        <Link
          to={"/marcas-gt/transporte/envios/" + row.original.id}
          state={{ from: returnTo }}
          className="font-medium text-[hsl(var(--app-primary))] hover:underline"
        >
          {row.original.numero}
        </Link>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 150,
      enableSorting: true,
      cell: ({ row }) => (
        <AppBadge tone={SHIPMENT_STATE_TONES[row.original.estado]} size="xs">
          {SHIPMENT_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      accessorKey: "modalidad",
      header: "Modalidad",
      size: 95,
      cell: ({ row }) => SHIPMENT_MODE_LABELS[row.original.modalidad],
    },
    {
      id: "bodega",
      header: "Bodega",
      size: 160,
      cell: ({ row }) => row.original.bodega?.nombre ?? "—",
    },
    {
      id: "paradas",
      header: "Paradas",
      size: 80,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.progreso.paradas),
    },
    {
      id: "carga",
      header: "Carga",
      size: 115,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(row.original.progreso.unidadesCargadas) +
        " / " +
        formatInteger(row.original.progreso.unidadesPlanificadas),
    },
    {
      id: "recurso",
      header: "Recurso",
      size: 190,
      meta: { grow: true },
      cell: ({ row }) =>
        row.original.modalidad === "EXTERNO"
          ? row.original.transportista?.nombre ?? "Sin asignar"
          : row.original.vehiculo
            ? row.original.vehiculo.placa +
              (row.original.conductor
                ? " · " + row.original.conductor.nombre
                : "")
            : "Sin asignar",
    },
    {
      id: "responsable",
      header: "Responsable",
      size: 150,
      cell: ({ row }) => row.original.responsable?.nombre ?? "—",
    },
    {
      id: "incidencias",
      header: "Incid.",
      size: 75,
      meta: { align: "right" },
      cell: ({ row }) =>
        row.original.incidenciasAbiertas > 0 ? (
          <AppBadge tone="danger" size="xs">
            {formatInteger(row.original.incidenciasAbiertas)}
          </AppBadge>
        ) : (
          "0"
        ),
    },
    {
      accessorKey: "salidaProgramadaEn",
      header: "Salida programada",
      size: 160,
      enableSorting: true,
      cell: ({ row }) => formatDateTime(row.original.salidaProgramadaEn),
    },
    {
      accessorKey: "salidaEn",
      header: "Salida",
      size: 155,
      enableSorting: true,
      cell: ({ row }) => formatDateTime(row.original.salidaEn),
    },
    {
      id: "costo",
      header: "Costo",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.costo),
    },
    createAppRowActionsColumn<ShipmentListItem>({
      actions: (row) => [
        {
          label: "Ver envío",
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
      emptyTitle="Sin envíos"
      emptyDescription="No se encontraron envíos con los filtros seleccionados."
    />
  );
}
