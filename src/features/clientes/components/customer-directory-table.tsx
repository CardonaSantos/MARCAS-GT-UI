import type { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { Eye, History, Pencil, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";
import type { CustomerDirectoryItem } from "../api/customer-directory.types";

interface Props {
  customers: CustomerDirectoryItem[];
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  onRetry: () => void;
  onDetail: (id: number) => void;
  onDelete: (customer: CustomerDirectoryItem) => void;
  canManage: boolean;
  sorting: SortingState;
  onSorting: (sorting: SortingState) => void;
  pagination: {
    pageIndex: number; pageSize: number; totalRows: number; pageCount: number;
    onPaginationChange: (pagination: PaginationState) => void;
  };
  toolbar: React.ReactNode;
}

export function CustomerDirectoryTable(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.pathname + location.search;
  const history = (id: number) =>
    navigate(`/marcas-gt/historial-cliente-ventas/${id}`, { state: { from } });
  const edit = (id: number) =>
    navigate(`/marcas-gt/editar-cliente/${id}`, { state: { from } });

  const columns: ColumnDef<CustomerDirectoryItem, unknown>[] = [
    {
      accessorKey: "nombre", header: "Cliente", size: 210, meta: { grow: true },
      cell: ({ row }) => (
        <button type="button" className="block max-w-full truncate text-left font-medium text-[hsl(var(--app-primary))] hover:underline"
          onClick={() => props.onDetail(row.original.id)} title="Ver ficha del cliente">
          {[row.original.nombre, row.original.apellido].filter(Boolean).join(" ")}
        </button>
      ),
    },
    { accessorKey: "tipoCliente", header: "Tipo", size: 140,
      cell: ({ row }) => row.original.tipoCliente || "—" },
    { accessorKey: "correo", header: "Correo", size: 205,
      cell: ({ row }) => row.original.correo || "—" },
    { accessorKey: "telefono", header: "Teléfono", size: 120,
      cell: ({ row }) => row.original.telefono || "—" },
    { id: "departamento", header: "Departamento", size: 145, enableSorting: false,
      cell: ({ row }) => row.original.departamento?.nombre || "—" },
    { id: "municipio", header: "Municipio", size: 140, enableSorting: false,
      cell: ({ row }) => row.original.municipio?.nombre || "—" },
    { id: "ventas", header: "Ventas", size: 75, enableSorting: false, meta: { align: "right" },
      cell: ({ row }) => row.original.actividad.ventas },
    createAppRowActionsColumn<CustomerDirectoryItem>({
      actions: ({ original }) => [
        { label: "Ver detalles", icon: <Eye />, onClick: () => props.onDetail(original.id) },
        { label: "Historial de ventas", icon: <History />, onClick: () => history(original.id) },
        { label: "Editar cliente", icon: <Pencil />, hidden: !props.canManage,
          onClick: () => edit(original.id) },
        { label: "Eliminar cliente", icon: <Trash2 />, tone: "danger", hidden: !props.canManage,
          separatorBefore: true, onClick: () => props.onDelete(original) },
      ],
    }),
  ];
  return (
    <AppDataTable<CustomerDirectoryItem>
      data={props.customers}
      columns={columns}
      getRowId={(row) => String(row.id)}
      isLoading={props.isLoading}
      isFetching={props.isFetching}
      error={props.error}
      onRetry={props.onRetry}
      density="sm"
      responsiveMode="cards"
      stickyHeader
      sorting={props.sorting}
      onSortingChange={props.onSorting}
      manualSorting
      paginationMode="server"
      pagination={props.pagination}
      enableColumnVisibility
      toolbar={props.toolbar}
      emptyTitle="Sin clientes"
      emptyDescription="No se encontraron clientes con los filtros seleccionados."
      renderMobileCard={({ original }) => (
        <article className="space-y-3 rounded-lg border border-[hsl(var(--app-border))] p-3">
          <div className="min-w-0">
            <button type="button" className="max-w-full truncate text-left text-sm font-semibold text-[hsl(var(--app-primary))]"
              onClick={() => props.onDetail(original.id)}>
              {[original.nombre, original.apellido].filter(Boolean).join(" ")}
            </button>
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">{original.tipoCliente || "Sin tipo"}</p>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs">
            <dt>Teléfono</dt><dd>{original.telefono || "—"}</dd>
            <dt>Correo</dt><dd className="min-w-0 break-all">{original.correo || "—"}</dd>
            <dt>Ubicación</dt><dd>{original.municipio?.nombre || original.departamento?.nombre || "—"}</dd>
            <dt>Ventas</dt><dd>{original.actividad.ventas}</dd>
          </dl>
          <div className="flex flex-wrap gap-2">
            <AppButton size="sm" variant="secondary" onClick={() => props.onDetail(original.id)} leftIcon={<Eye />}>Detalle</AppButton>
            <AppButton size="sm" variant="ghost" onClick={() => history(original.id)} leftIcon={<History />}>Ventas</AppButton>
            {props.canManage ? (
              <>
                <AppButton size="sm" variant="outline" onClick={() => edit(original.id)} leftIcon={<Pencil />}>Editar</AppButton>
                <AppButton size="sm" variant="ghost" onClick={() => props.onDelete(original)} leftIcon={<Trash2 />}>Eliminar</AppButton>
              </>
            ) : null}
          </div>
        </article>
      )}
    />
  );
}
