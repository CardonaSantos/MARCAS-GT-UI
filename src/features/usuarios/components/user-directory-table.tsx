import type { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { KeyRound, Pencil, UserCheck, UserX } from "lucide-react";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";
import { USER_ROLE_OPTIONS, type SystemUser } from "../api/user.types";

const roleLabel = (value: string) => USER_ROLE_OPTIONS.find((option) => option.value === value)?.label ?? value;
const dateLabel = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium", timeStyle: "short",
  }).format(date);
};
function UserStatus({ active }: { active: boolean }) {
  return <AppBadge size="sm" tone={active ? "success" : "warning"}>{active ? "Activo" : "Inactivo"}</AppBadge>;
}

interface Props {
  rows: SystemUser[];
  currentUserId: number | null;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  onRetry: () => void;
  onEdit: (user: SystemUser) => void;
  onPassword: (user: SystemUser) => void;
  onToggle: (user: SystemUser) => void;
  sorting: SortingState;
  onSortingChange: (state: SortingState) => void;
  pagination: {
    pageIndex: number; pageSize: number; totalRows: number; pageCount: number;
    onPaginationChange: (next: PaginationState) => void;
  };
  toolbar: React.ReactNode;
}

export function UserDirectoryTable(props: Props) {
  const columns: ColumnDef<SystemUser, unknown>[] = [
    { accessorKey: "nombre", header: "Usuario", size: 200, meta: { grow: true },
      cell: ({ row }) => <span className="font-medium">{row.original.nombre}</span> },
    { accessorKey: "correo", header: "Correo electrónico", size: 250, meta: { grow: true },
      cell: ({ row }) => <span className="block max-w-full truncate" title={row.original.correo}>{row.original.correo}</span> },
    { accessorKey: "rol", header: "Rol", size: 175,
      cell: ({ row }) => roleLabel(row.original.rol) },
    { accessorKey: "activo", header: "Estado", size: 115,
      cell: ({ row }) => <UserStatus active={row.original.activo} /> },
    { accessorKey: "creadoEn", header: "Creación", size: 175,
      cell: ({ row }) => dateLabel(row.original.creadoEn) },
    { accessorKey: "actualizadoEn", header: "Actualización", size: 175,
      cell: ({ row }) => dateLabel(row.original.actualizadoEn) },
    createAppRowActionsColumn<SystemUser>({
      actions: ({ original }) => [
        { label: "Editar usuario", icon: <Pencil />, onClick: () => props.onEdit(original) },
        { label: "Cambiar contraseña", icon: <KeyRound />, onClick: () => props.onPassword(original) },
        { label: original.activo ? "Desactivar cuenta" : "Reactivar cuenta",
          icon: original.activo ? <UserX /> : <UserCheck />,
          disabled: original.id === props.currentUserId,
          separatorBefore: true,
          tone: original.activo ? "danger" : "default",
          onClick: () => props.onToggle(original) },
      ],
    }),
  ];
  return (
    <AppDataTable<SystemUser>
      data={props.rows} columns={columns}
      getRowId={(row) => String(row.id)}
      isLoading={props.isLoading} isFetching={props.isFetching}
      error={props.error} onRetry={props.onRetry}
      sorting={props.sorting} onSortingChange={props.onSortingChange}
      manualSorting paginationMode="server" pagination={props.pagination}
      density="sm" stickyHeader responsiveMode="cards" enableColumnVisibility
      toolbar={props.toolbar}
      emptyTitle="Sin usuarios"
      emptyDescription="No hay cuentas que coincidan con los filtros."
      renderMobileCard={({ original }) => (
        <article className="min-w-0 space-y-3 rounded-lg border border-[hsl(var(--app-border))] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="min-w-0 break-words font-semibold">{original.nombre}</span>
            <UserStatus active={original.activo} />
          </div>
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 text-xs">
            <dt>Correo</dt><dd className="break-all">{original.correo}</dd>
            <dt>Rol</dt><dd>{roleLabel(original.rol)}</dd>
            <dt>Creación</dt><dd>{dateLabel(original.creadoEn)}</dd>
          </dl>
          <div className="flex flex-wrap gap-2">
            <AppButton size="sm" variant="secondary" leftIcon={<Pencil />}
              onClick={() => props.onEdit(original)}>Editar</AppButton>
            <AppButton size="sm" variant="outline" leftIcon={<KeyRound />}
              onClick={() => props.onPassword(original)}>Contraseña</AppButton>
            <AppButton size="sm" variant="outline" disabled={original.id === props.currentUserId}
              leftIcon={original.activo ? <UserX /> : <UserCheck />}
              onClick={() => props.onToggle(original)}>
              {original.activo ? "Desactivar" : "Reactivar"}
            </AppButton>
          </div>
        </article>
      )}
    />
  );
}
