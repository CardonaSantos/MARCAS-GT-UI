import type { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { Eye, UserRoundPlus } from "lucide-react";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";
import type { ProspectHistoryRow, ProspectState } from "../api/prospect-history.types";
import {
  formatProspectDate, formatProspectDuration, prospectDisplayName, prospectStatusLabel,
} from "../common/prospect-history.formatters";

function Status({ status }: { status: ProspectState }) {
  const tone = status === "FINALIZADO" ? "success" :
    status === "CERRADO" ? "danger" : "warning";
  return <AppBadge tone={tone} size="sm">{prospectStatusLabel(status)}</AppBadge>;
}

interface Props {
  rows: ProspectHistoryRow[];
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  onRetry: () => void;
  onDetail: (id: number) => void;
  onConvert: (id: number) => void;
  sorting: SortingState;
  onSortingChange: (value: SortingState) => void;
  pagination: {
    pageIndex: number; pageSize: number; totalRows: number; pageCount: number;
    onPaginationChange: (value: PaginationState) => void;
  };
  toolbar: React.ReactNode;
}

export function ProspectHistoryTable(props: Props) {
  const columns: ColumnDef<ProspectHistoryRow, unknown>[] = [
    {
      id: "nombreCompleto", header: "Contacto", size: 185,
      cell: ({ row }) => (
        <button type="button" onClick={() => props.onDetail(row.original.id)}
          title="Ver detalles del prospecto"
          className="block max-w-full truncate text-left font-medium text-[hsl(var(--app-primary))] hover:underline">
          {prospectDisplayName({
            nombreCompleto: row.original.nombreCompleto,
            apellido: row.original.apellido, empresaTienda: null,
          })}
        </button>
      ),
    },
    { accessorKey: "empresaTienda", header: "Empresa o tienda", size: 165,
      cell: ({ row }) => row.original.empresaTienda || "—" },
    { accessorKey: "telefono", header: "Teléfono", size: 120, enableSorting: false,
      cell: ({ row }) => row.original.telefono || "—" },
    { id: "vendedor", header: "Vendedor", size: 150, enableSorting: false,
      cell: ({ row }) => row.original.vendedor?.nombre || "—" },
    { accessorKey: "estado", header: "Estado", size: 115,
      cell: ({ row }) => <Status status={row.original.estado} /> },
    { accessorKey: "creadoEn", header: "Fecha de registro", size: 175,
      cell: ({ row }) => formatProspectDate(row.original.creadoEn) },
    { id: "duracion", header: "Duración", size: 100, enableSorting: false,
      cell: ({ row }) => formatProspectDuration(row.original.duracionMinutos) },
    { id: "clienteId", header: "Cliente vinculado", size: 110, enableSorting: false,
      cell: ({ row }) => row.original.clienteId === null ? "No" : `#${row.original.clienteId}` },
    createAppRowActionsColumn<ProspectHistoryRow>({
      actions: ({ original }) => [
        { label: "Ver ficha", icon: <Eye />, onClick: () => props.onDetail(original.id) },
        { label: "Convertir en cliente", icon: <UserRoundPlus />,
          hidden: original.estado !== "FINALIZADO" || original.clienteId !== null,
          disabled: !original.telefono?.trim() ||
            !(original.nombreCompleto?.trim() || original.empresaTienda?.trim()),
          onClick: () => props.onConvert(original.id) },
      ],
    }),
  ];

  return (
    <AppDataTable<ProspectHistoryRow>
      data={props.rows}
      columns={columns}
      getRowId={(row) => String(row.id)}
      isLoading={props.isLoading} isFetching={props.isFetching}
      error={props.error} onRetry={props.onRetry}
      sorting={props.sorting} onSortingChange={props.onSortingChange}
      manualSorting paginationMode="server" pagination={props.pagination}
      density="sm" stickyHeader responsiveMode="cards"
      enableColumnVisibility
      toolbar={props.toolbar}
      emptyTitle="Sin prospectos"
      emptyDescription="No se encontraron registros con los filtros seleccionados."
      renderMobileCard={({ original }) => (
        <article className="space-y-3 rounded-lg border border-[hsl(var(--app-border))] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button type="button" onClick={() => props.onDetail(original.id)}
              className="max-w-full truncate text-left text-sm font-semibold text-[hsl(var(--app-primary))]">
              {prospectDisplayName(original)}
            </button>
            <Status status={original.estado} />
          </div>
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-xs">
            <dt>Empresa</dt><dd className="break-words">{original.empresaTienda || "—"}</dd>
            <dt>Vendedor</dt><dd>{original.vendedor?.nombre || "—"}</dd>
            <dt>Teléfono</dt><dd>{original.telefono || "—"}</dd>
            <dt>Fecha</dt><dd>{formatProspectDate(original.creadoEn)}</dd>
            <dt>Duración</dt><dd>{formatProspectDuration(original.duracionMinutos)}</dd>
          </dl>
          <div className="flex flex-wrap gap-2">
            <AppButton type="button" size="sm" variant="secondary"
              leftIcon={<Eye />} onClick={() => props.onDetail(original.id)}>
              Ver ficha
            </AppButton>
            {original.estado === "FINALIZADO" && !original.clienteId && (
              <AppButton type="button" size="sm" variant="outline"
                disabled={!original.telefono?.trim() ||
                  !(original.nombreCompleto?.trim() || original.empresaTienda?.trim())}
                leftIcon={<UserRoundPlus />} onClick={() => props.onConvert(original.id)}>
                Crear cliente
              </AppButton>
            )}
          </div>
        </article>
      )}
    />
  );
}
