import { RotateCcw } from "lucide-react";

import { useCustomerDepartments, useCustomerMunicipalities } from
  "@/features/clientes/api/customer-location.queries";
import { customerTypeOptions } from "@/features/clientes/schemas/customer.schemas";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import type { ProspectHistoryFilters as Filters } from "../api/prospect-history.types";

type FilterName =
  "estado" | "tipoCliente" | "departamentoId" | "municipioId" |
  "vendedorId" | "convertido" | "desde" | "hasta";

interface Props {
  filters: Filters;
  searchDraft: string;
  onSearchDraft: (value: string) => void;
  onSearch: (value: string) => void;
  onFilter: (key: FilterName, value: string | number | null) => void;
  onClear: () => void;
}

const statusOptions = [
  { value: "EN_PROSPECTO", label: "En curso" },
  { value: "FINALIZADO", label: "Finalizados" },
  { value: "CERRADO", label: "Cancelados" },
];
const conversionOptions = [
  { value: "true", label: "Convertidos en clientes" },
  { value: "false", label: "Sin convertir" },
];
const labelClass = "mb-1 block text-xs font-medium text-[hsl(var(--app-muted-foreground))]";

export function ProspectHistoryFilters({
  filters, searchDraft, onSearchDraft, onSearch, onFilter, onClear,
}: Props) {
  const departments = useCustomerDepartments();
  const municipalities = useCustomerMunicipalities(filters.departamentoId ?? 0);
  const hasFilters = Boolean(
    filters.search || filters.estado || filters.tipoCliente || filters.departamentoId ||
    filters.municipioId || filters.convertido || filters.desde || filters.hasta ||
    filters.vendedorId,
  );

  return (
    <div className="min-w-0 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Filtros de prospectos</h2>
        <AppButton type="button" size="sm" variant="secondary" leftIcon={<RotateCcw />}
          disabled={!hasFilters} onClick={onClear}>
          Limpiar filtros
        </AppButton>
      </div>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="min-w-0 sm:col-span-2">
          <label htmlFor="prospect-history-search" className={labelClass}>
            Buscar por nombre, empresa, teléfono o dirección
          </label>
          <AppSearchInput id="prospect-history-search"
            value={searchDraft} onValueChange={onSearchDraft} onDebouncedChange={onSearch}
            placeholder="Buscar prospecto..." />
        </div>
        <div className="min-w-0">
          <label htmlFor="prospect-history-status" className={labelClass}>Estado</label>
          <AppSingleSelect<string>
            inputId="prospect-history-status" options={statusOptions}
            value={filters.estado ?? null}
            onChange={(value) => onFilter("estado", value)} placeholder="Todos los estados" />
        </div>
        <div className="min-w-0">
          <label htmlFor="prospect-history-converted" className={labelClass}>Vinculación</label>
          <AppSingleSelect<string>
            inputId="prospect-history-converted" options={conversionOptions}
            value={filters.convertido ?? null}
            onChange={(value) => onFilter("convertido", value)}
            placeholder="Todos los prospectos" />
        </div>
        <div className="min-w-0">
          <label htmlFor="prospect-history-department" className={labelClass}>Departamento</label>
          <AppSingleSelect<number>
            inputId="prospect-history-department"
            options={(departments.data ?? []).map((x) => ({ value: x.id, label: x.nombre }))}
            value={filters.departamentoId ?? null}
            onChange={(value) => onFilter("departamentoId", value)}
            placeholder="Todos los departamentos" isLoading={departments.isLoading} />
        </div>
        <div className="min-w-0">
          <label htmlFor="prospect-history-municipality" className={labelClass}>Municipio</label>
          <AppSingleSelect<number>
            inputId="prospect-history-municipality"
            options={(municipalities.data ?? []).map((x) => ({ value: x.id, label: x.nombre }))}
            value={filters.municipioId ?? null}
            onChange={(value) => onFilter("municipioId", value)}
            placeholder={filters.departamentoId ? "Todos los municipios" : "Selecciona departamento"}
            isDisabled={!filters.departamentoId || municipalities.isLoading}
            isLoading={municipalities.isLoading} />
        </div>
        <div className="min-w-0">
          <label htmlFor="prospect-history-type" className={labelClass}>Tipo de cliente</label>
          <AppSingleSelect<string>
            inputId="prospect-history-type" options={customerTypeOptions}
            value={filters.tipoCliente ?? null}
            onChange={(value) => onFilter("tipoCliente", value)}
            placeholder="Todos los tipos" />
        </div>
        <div className="min-w-0">
          <label htmlFor="prospect-history-from" className={labelClass}>Creado desde</label>
          <AppInput id="prospect-history-from" type="date" max={filters.hasta}
            value={filters.desde ?? ""} onChange={(event) =>
              onFilter("desde", event.target.value || null)} />
        </div>
        <div className="min-w-0">
          <label htmlFor="prospect-history-until" className={labelClass}>Creado hasta</label>
          <AppInput id="prospect-history-until" type="date" min={filters.desde}
            value={filters.hasta ?? ""} onChange={(event) =>
              onFilter("hasta", event.target.value || null)} />
        </div>
      </div>
      {(departments.isError || municipalities.isError) ? (
        <p role="alert" className="text-xs text-red-500">
          No se pudieron cargar todas las ubicaciones.
        </p>
      ) : null}
    </div>
  );
}
