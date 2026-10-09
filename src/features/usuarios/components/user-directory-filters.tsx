import { RotateCcw } from "lucide-react";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";
import { USER_ROLE_OPTIONS, type MarcasUserRole, type UserDirectoryFilters } from "../api/user.types";

const statusOptions: { value: "true" | "false"; label: string }[] = [
  { value: "true", label: "Activos" },
  { value: "false", label: "Inactivos" },
];

interface Props {
  filters: UserDirectoryFilters;
  searchDraft: string;
  onSearchDraft: (value: string) => void;
  onSearch: (value: string) => void;
  onFilter: (key: "rol" | "activo", value: string | null) => void;
  onClear: () => void;
}

export function UserDirectoryFilters({ filters, searchDraft, onSearchDraft, onSearch, onFilter, onClear }: Props) {
  const filtered = Boolean(filters.search || filters.rol || filters.activo);
  return (
    <section className="min-w-0 space-y-3" aria-label="Filtros de usuarios">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Filtrar usuarios</h2>
        <AppButton type="button" variant="secondary" size="sm" leftIcon={<RotateCcw />}
          onClick={onClear} disabled={!filtered}>
          Limpiar filtros
        </AppButton>
      </div>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(170px,1fr)_minmax(170px,1fr)]">
        <div className="min-w-0">
          <label htmlFor="user-search" className="mb-1 block text-xs font-medium">Nombre o correo</label>
          <AppSearchInput id="user-search" value={searchDraft}
            onValueChange={onSearchDraft} onDebouncedChange={onSearch}
            placeholder="Buscar usuarios..." />
        </div>
        <div className="min-w-0">
          <label htmlFor="user-role" className="mb-1 block text-xs font-medium">Rol</label>
          <AppSingleSelect<MarcasUserRole> inputId="user-role" options={USER_ROLE_OPTIONS}
            value={filters.rol ?? null} onChange={(value) => onFilter("rol", value)}
            placeholder="Todos los roles" />
        </div>
        <div className="min-w-0">
          <label htmlFor="user-active" className="mb-1 block text-xs font-medium">Estado</label>
          <AppSingleSelect<"true" | "false"> inputId="user-active" options={statusOptions}
            value={filters.activo ?? null} onChange={(value) => onFilter("activo", value)}
            placeholder="Todos los estados" />
        </div>
      </div>
    </section>
  );
}
