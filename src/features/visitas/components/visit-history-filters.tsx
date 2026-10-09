import { RotateCcw } from "lucide-react";
import { useCustomerDepartments, useCustomerMunicipalities } from "@/features/clientes/api/customer-location.queries";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";
import { visitReasons, visitTypes } from "../schemas/visit-workflow.schemas";
import type { VisitHistoryFilters } from "../api/visit-history.types";
import type { VisitFilterKey } from "../common/use-visit-history-state";

const statusOptions = [
  { value: "INICIADA", label: "En curso" },
  { value: "FINALIZADA", label: "Finalizadas" },
  { value: "CANCELADA", label: "Canceladas" },
];
const labelStyle = "mb-1 block text-xs font-medium text-[hsl(var(--app-muted-foreground))]";
interface Props {
  filters: VisitHistoryFilters;
  searchDraft: string;
  onSearchDraft: (value: string) => void;
  onSearch: (value: string) => void;
  onFilter: (key: VisitFilterKey, value: string | number | null) => void;
  onClear: () => void;
}
export function VisitHistoryFilters({
  filters, searchDraft, onSearchDraft, onSearch, onFilter, onClear,
}: Props) {
  const departments = useCustomerDepartments();
  const municipalities = useCustomerMunicipalities(filters.departamentoId ?? 0);
  const hasFilters = Boolean(
    filters.search || filters.estadoVisita || filters.tipoVisita || filters.motivoVisita ||
    filters.departamentoId || filters.municipioId || filters.clienteId ||
    filters.vendedorId || filters.desde || filters.hasta,
  );

  return (
    <section className="min-w-0 space-y-3" aria-label="Filtros del historial de visitas">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Filtrar visitas</h2>
        <AppButton type="button" size="sm" variant="secondary"
          leftIcon={<RotateCcw />} disabled={!hasFilters} onClick={onClear}>
          Limpiar filtros
        </AppButton>
      </div>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="min-w-0 sm:col-span-2">
          <label htmlFor="visit-history-search" className={labelStyle}>
            Cliente, teléfono, correo, vendedor o número de visita
          </label>
          <AppSearchInput
            id="visit-history-search"
            placeholder="Buscar visita..."
            value={searchDraft}
            onValueChange={onSearchDraft}
            onDebouncedChange={onSearch}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="visit-history-status" className={labelStyle}>Estado</label>
          <AppSingleSelect<string>
            inputId="visit-history-status" options={statusOptions}
            value={filters.estadoVisita ?? null}
            onChange={(v) => onFilter("estadoVisita", v)}
            placeholder="Todos los estados"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="visit-history-type" className={labelStyle}>Tipo de visita</label>
          <AppSingleSelect<string>
            inputId="visit-history-type" options={[...visitTypes]}
            value={filters.tipoVisita ?? null}
            onChange={(v) => onFilter("tipoVisita", v)}
            placeholder="Presencial o virtual"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="visit-history-reason" className={labelStyle}>Motivo de visita</label>
          <AppSingleSelect<string>
            inputId="visit-history-reason" options={[...visitReasons]}
            value={filters.motivoVisita ?? null}
            onChange={(v) => onFilter("motivoVisita", v)}
            placeholder="Todos los motivos"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="visit-history-department" className={labelStyle}>
            Departamento del cliente
          </label>
          <AppSingleSelect<number>
            inputId="visit-history-department"
            options={(departments.data ?? []).map((d) => ({ value: d.id, label: d.nombre }))}
            value={filters.departamentoId ?? null}
            onChange={(v) => onFilter("departamentoId", v)}
            isLoading={departments.isLoading}
            placeholder="Todos los departamentos"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="visit-history-municipality" className={labelStyle}>
            Municipio del cliente
          </label>
          <AppSingleSelect<number>
            inputId="visit-history-municipality"
            options={(municipalities.data ?? []).map((m) => ({ value: m.id, label: m.nombre }))}
            value={filters.municipioId ?? null}
            onChange={(v) => onFilter("municipioId", v)}
            isDisabled={!filters.departamentoId || municipalities.isLoading}
            isLoading={municipalities.isLoading}
            placeholder={filters.departamentoId ? "Todos los municipios" : "Selecciona departamento"}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="visit-history-from" className={labelStyle}>Inicio desde</label>
          <AppInput id="visit-history-from" type="date" value={filters.desde ?? ""}
            max={filters.hasta} onChange={(e) => onFilter("desde", e.target.value || null)} />
        </div>
        <div className="min-w-0">
          <label htmlFor="visit-history-to" className={labelStyle}>Inicio hasta</label>
          <AppInput id="visit-history-to" type="date" value={filters.hasta ?? ""}
            min={filters.desde} onChange={(e) => onFilter("hasta", e.target.value || null)} />
        </div>
      </div>
      {(departments.isError || municipalities.isError) && (
        <p role="alert" className="text-xs text-red-500">
          No fue posible cargar las ubicaciones. Reintenta al actualizar la página.
        </p>
      )}
    </section>
  );
}
