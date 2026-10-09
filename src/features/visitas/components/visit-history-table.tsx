import type { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";
import type { VisitHistoryRow } from "../api/visit-history.types";
import type { VisitStatus } from "../api/visit-workflow.types";
import {
  customerName, visitDate, visitDuration, visitStatusLabel,
} from "../common/visit-history.formatters";
import { visitReasonLabel, visitTypeLabel } from "../common/visit-workflow.formatters";

function Status({ status }: { status: VisitStatus }) {
  return (
    <AppBadge size="sm" tone={status === "FINALIZADA" ? "success" :
      status === "CANCELADA" ? "danger" : "warning"}>
      {visitStatusLabel(status)}
    </AppBadge>
  );
}

interface Props {
  rows: VisitHistoryRow[];
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  onRetry: () => void;
  onDetail: (id: number) => void;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  pagination: {
    pageIndex: number; pageSize: number; totalRows: number; pageCount: number;
    onPaginationChange: (next: PaginationState) => void;
  };
  toolbar: React.ReactNode;
}

export function VisitHistoryTable(props: Props) {
  const columns: ColumnDef<VisitHistoryRow, unknown>[] = [
    { id: "cliente", header: "Cliente", size: 250, meta: { grow: true },
      enableSorting: false,
      cell: ({ row }) => (
        <button type="button" onClick={() => props.onDetail(row.original.id)}
          className="block max-w-full truncate text-left font-medium text-[hsl(var(--app-primary))] hover:underline">
          {customerName(row.original.cliente)}
        </button>
      ) },
    { id: "vendedor", header: "Vendedor", size: 180, meta: { grow: true },
      enableSorting: false,
      cell: ({ row }) => row.original.vendedor.nombre },
    { accessorKey: "inicio", header: "Inicio", size: 173,
      cell: ({ row }) => visitDate(row.original.inicio) },
    { accessorKey: "estadoVisita", header: "Estado", size: 125,
      cell: ({ row }) => <Status status={row.original.estadoVisita} /> },
    { accessorKey: "tipoVisita", header: "Tipo", size: 103,
      cell: ({ row }) => visitTypeLabel(row.original.tipoVisita) },
    { id: "duracion", header: "Duración", size: 100, enableSorting: false,
      cell: ({ row }) => visitDuration(row.original.duracionMinutos) },
    { id: "ventas", header: "Ventas", size: 80, enableSorting: false,
      cell: ({ row }) => row.original._count.ventas },
    { id: "pedidos", header: "Pedidos", size: 90, enableSorting: false,
      cell: ({ row }) => row.original._count.pedidos },
    createAppRowActionsColumn<VisitHistoryRow>({
      actions: ({ original }) => [
        { label: "Ver ficha", icon: <Eye />, onClick: () => props.onDetail(original.id) },
      ],
    }),
  ];
  return (
    <AppDataTable<VisitHistoryRow>
      data={props.rows} columns={columns}
      getRowId={(r) => String(r.id)}
      isLoading={props.isLoading} isFetching={props.isFetching}
      error={props.error} onRetry={props.onRetry}
      sorting={props.sorting} onSortingChange={props.onSortingChange}
      manualSorting paginationMode="server" pagination={props.pagination}
      density="sm" stickyHeader responsiveMode="cards" enableColumnVisibility
      toolbar={props.toolbar}
      emptyTitle="Sin visitas"
      emptyDescription="No hay registros con los filtros seleccionados."
      renderMobileCard={({ original }) => (
        <article className="space-y-3 rounded-lg border border-[hsl(var(--app-border))] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button type="button" onClick={() => props.onDetail(original.id)}
              className="max-w-full truncate text-left text-sm font-semibold text-[hsl(var(--app-primary))]">
              {customerName(original.cliente)}
            </button>
            <Status status={original.estadoVisita} />
          </div>
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-xs">
            <dt>Vendedor</dt><dd className="break-words">{original.vendedor.nombre}</dd>
            <dt>Inicio</dt><dd>{visitDate(original.inicio)}</dd>
            <dt>Motivo</dt><dd>{visitReasonLabel(original.motivoVisita)}</dd>
            <dt>Tipo</dt><dd>{visitTypeLabel(original.tipoVisita)}</dd>
            <dt>Duración</dt><dd>{visitDuration(original.duracionMinutos)}</dd>
            <dt>Ventas</dt><dd>{original._count.ventas}</dd>
            <dt>Pedidos</dt><dd>{original._count.pedidos}</dd>
          </dl>
          <AppButton type="button" size="sm" variant="secondary"
            leftIcon={<Eye />} onClick={() => props.onDetail(original.id)}>
            Ver ficha
          </AppButton>
        </article>
      )}
    />
  );
}
