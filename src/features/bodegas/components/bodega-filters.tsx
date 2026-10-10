import { RotateCcw } from "lucide-react";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppInline } from "@/ui/components/app/primitives/app-inline";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import type { LegacyUserListItem } from "../api/bodega.types";

interface BodegaFiltersProps {
  search: string;
  activo: boolean | null;
  esPrincipal: boolean | null;
  responsableId: number | null;
  responsibleUsers: LegacyUserListItem[];
  responsibleUsersLoading?: boolean;
  showResponsibleFilter?: boolean;
  onSearchChange: (value: string) => void;
  onSearchDebouncedChange: (value: string) => void;
  onActivoChange: (value: boolean | null) => void;
  onPrincipalChange: (value: boolean | null) => void;
  onResponsableChange: (value: number | null) => void;
  onReset: () => void;
}

const statusOptions = [
  { value: "all", label: "Todos los estados" },
  { value: "active", label: "Activas" },
  { value: "inactive", label: "Inactivas" },
];

const principalOptions = [
  { value: "all", label: "Todas" },
  { value: "principal", label: "Principal" },
  { value: "secondary", label: "No principal" },
];

export function BodegaFilters({
  search,
  activo,
  esPrincipal,
  responsableId,
  responsibleUsers,
  responsibleUsersLoading,
  showResponsibleFilter = true,
  onSearchChange,
  onSearchDebouncedChange,
  onActivoChange,
  onPrincipalChange,
  onResponsableChange,
  onReset,
}: BodegaFiltersProps) {
  const statusValue =
    activo === null ? "all" : activo ? "active" : "inactive";

  const principalValue =
    esPrincipal === null
      ? "all"
      : esPrincipal
        ? "principal"
        : "secondary";

  const responsibleOptions = responsibleUsers.map((user) => ({
    value: user.id,
    label: user.nombre,
  }));

  const hasFilters =
    Boolean(search) ||
    activo !== null ||
    esPrincipal !== null ||
    responsableId !== null;

  return (
    <AppInline collapseBelow="lg" align="end" className="w-full gap-2">
      <AppSearchInput
        value={search}
        onValueChange={(value) => onSearchChange(value)}
        onDebouncedChange={(value) => onSearchDebouncedChange(value)}
        placeholder="Buscar bodega..."
        wrapperClassName="w-full lg:max-w-md"
      />

      <div className="w-full sm:w-44">
        <AppSingleSelect
          value={statusValue}
          options={statusOptions}
          isClearable={false}
          isSearchable={false}
          onChange={(value) => {
            if (value === "active") onActivoChange(true);
            else if (value === "inactive") onActivoChange(false);
            else onActivoChange(null);
          }}
        />
      </div>

      <div className="w-full sm:w-44">
        <AppSingleSelect
          value={principalValue}
          options={principalOptions}
          isClearable={false}
          isSearchable={false}
          onChange={(value) => {
            if (value === "principal") onPrincipalChange(true);
            else if (value === "secondary") onPrincipalChange(false);
            else onPrincipalChange(null);
          }}
        />
      </div>

      {showResponsibleFilter ? (
        <div className="w-full sm:w-52">
          <AppSingleSelect<number>
            value={responsableId}
            options={responsibleOptions}
            placeholder="Responsable"
            isLoading={responsibleUsersLoading}
            onChange={(value) => onResponsableChange(value)}
          />
        </div>
      ) : null}

      <AppButton
        variant="secondary"
        size="sm"
        leftIcon={<RotateCcw />}
        disabled={!hasFilters}
        onClick={onReset}
      >
        Limpiar
      </AppButton>
    </AppInline>
  );
}
