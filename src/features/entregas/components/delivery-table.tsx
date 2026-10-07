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

import type { DeliveryView } from "../api/delivery.types";
import {
  DELIVERY_STATE_LABELS,
  DELIVERY_STATE_TONES,
} from "../common/delivery.constants";

interface Props {
  data: DeliveryView[];
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

export function DeliveryTable(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.pathname + location.search;

  const go = (id: number) =>
    navigate("/marcas-gt/entregas/" + id, {
      state: { from: returnTo },
    });

  const columns: ColumnDef<DeliveryView, unknown>[] = [
    {
      accessorKey: "id",
      header: "Entrega",
      size: 95,
      cell: ({ row }) => (
        <Link
          to={"/marcas-gt/entregas/" + row.original.id}
          state={{ from: returnTo }}
          className="font-medium text-[hsl(var(--app-primary))] hover:underline"
        >
          #{row.original.id}
        </Link>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 125,
      enableSorting: true,
      cell: ({ row }) => (
        <AppBadge tone={DELIVERY_STATE_TONES[row.original.estado]} size="xs">
          {DELIVERY_STATE_LABELS[row.original.estado]}
        </AppBadge>
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
      id: "pedido",
      header: "Pedido",
      size: 120,
      cell: ({ row }) => row.original.pedido.numero,
    },
    {
      id: "despacho",
      header: "Despacho",
      size: 120,
      cell: ({ row }) => row.original.despacho.numero,
    },
    {
      id: "envio",
      header: "Envío",
      size: 120,
      cell: ({ row }) => row.original.transporte?.envio.numero ?? "—",
    },
    {
      id: "carga",
      header: "Carga",
      size: 75,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.resultado.unidadesCargadas),
    },
    {
      id: "entregadas",
      header: "Entregadas",
      size: 90,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(row.original.resultado.unidadesEntregadas),
    },
    {
      id: "rechazadas",
      header: "Rechazadas",
      size: 90,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(row.original.resultado.unidadesRechazadas),
    },
    {
      id: "responsable",
      header: "Responsable",
      size: 150,
      cell: ({ row }) => row.original.transporte?.responsable?.nombre ?? "—",
    },
    {
      id: "evidencia",
      header: "Evid.",
      size: 65,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.evidencias.total),
    },
    {
      id: "gps",
      header: "GPS",
      size: 65,
      cell: ({ row }) => (row.original.ubicacion.entrega ? "Sí" : "No"),
    },
    {
      id: "finalizadaEn",
      header: "Finalizada",
      size: 155,
      enableSorting: true,
      cell: ({ row }) => formatDateTime(row.original.tiempos.finalizadaEn),
    },
    createAppRowActionsColumn<DeliveryView>({
      actions: (row) => [
        {
          label: "Ver entrega",
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
      emptyTitle="Sin entregas"
      emptyDescription="No se encontraron entregas con los filtros seleccionados."
    />
  );
}
