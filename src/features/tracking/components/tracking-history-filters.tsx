import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppField } from "@/ui/components/app/primitives/app-field";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppInline } from "@/ui/components/app/primitives/app-inline";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import {
  AppSingleSelect,
  type AppSelectOption,
} from "@/ui/components/app/primitives/app-single-select";

import type { TrackingSessionStatus } from "../api/tracking.types";
import type { TrackingHistoryFiltersState } from "../api/tracking.filters";

const ESTADO_OPTIONS: Array<AppSelectOption<TrackingSessionStatus>> = [
  { value: "ACTIVA", label: "Con sesión activa" },
  { value: "FINALIZADA", label: "Con sesión finalizada" },
  { value: "EXPIRADA", label: "Con sesión expirada" },
];

type TecnicoOption = AppSelectOption<number>;

type TrackingHistoryFiltersProps = {
  search: string;
  filters: TrackingHistoryFiltersState;
  tecnicoOptions: TecnicoOption[];
  isLoadingTecnicos?: boolean;
  isSearching?: boolean;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onDebouncedSearchChange: (value: string) => void;
  onFilterChange: <TKey extends keyof TrackingHistoryFiltersState>(
    key: TKey,
    value: TrackingHistoryFiltersState[TKey],
  ) => void;
  onClear: () => void;
};

export function TrackingHistoryFilters({
  search,
  filters,
  tecnicoOptions,
  isLoadingTecnicos = false,
  isSearching = false,
  hasActiveFilters,
  onSearchChange,
  onDebouncedSearchChange,
  onFilterChange,
  onClear,
}: TrackingHistoryFiltersProps) {
  return (
    <AppCard size="xs" variant="outline" className="p-2">
      <AppGrid cols={{ base: 1, md: 2, xl: 6 }} gap="sm">
        <div className="md:col-span-2">
          <AppSearchInput
            value={search}
            onValueChange={onSearchChange}
            onDebouncedChange={onDebouncedSearchChange}
            debounceMs={450}
            placeholder="Buscar empleado por nombre o correo"
            aria-label="Buscar jornadas de empleados"
            isSearching={isSearching}
            clearable
          />
        </div>

        <AppField label="Empleado">
          {(fieldUi) => (
            <AppSingleSelect<number>
              inputId={fieldUi.id}
              aria-describedby={fieldUi.describedBy}
              aria-invalid={fieldUi.invalid}
              value={filters.usuarioId}
              options={tecnicoOptions}
              onChange={(value) => onFilterChange("usuarioId", value)}
              placeholder="Todos"
              noOptionsText="Sin técnicos"
              isLoading={isLoadingTecnicos}
              density="compact"
              isClearable
            />
          )}
        </AppField>

        <AppField label="Estado de sesión">
          {(fieldUi) => (
            <AppSingleSelect<TrackingSessionStatus>
              inputId={fieldUi.id}
              aria-describedby={fieldUi.describedBy}
              aria-invalid={fieldUi.invalid}
              value={filters.estadoSesion}
              options={ESTADO_OPTIONS}
              onChange={(value) => onFilterChange("estadoSesion", value)}
              placeholder="Todos"
              density="compact"
              isClearable
            />
          )}
        </AppField>

        <div className="md:col-span-2">
          <AppField label="Fecha de jornada">
            <AppDatePicker
              mode="range"
              value={filters.fecha}
              onChange={(value) => onFilterChange("fecha", value)}
              outputFormat="YYYY-MM-DD"
            />
          </AppField>
        </div>
      </AppGrid>

      <AppInline justify="end" gap="sm" fullWidth className="mt-2">
        <AppButton
          type="button"
          variant="outline"
          size="xs"
          disabled={!hasActiveFilters}
          onClick={onClear}
        >
          Limpiar filtros
        </AppButton>
      </AppInline>
    </AppCard>
  );
}
