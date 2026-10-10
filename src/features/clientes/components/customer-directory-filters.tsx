import { RotateCcw } from "lucide-react";

import { useCustomerDepartments, useCustomerMunicipalities } from "../api/customer-location.queries";
import {
  customerInterestOptions, customerMonthlyBudgetOptions,
  customerPurchaseVolumeOptions, customerTypeOptions,
} from "../schemas/customer.schemas";
import type { CustomerDirectoryFilters as Filters } from "../api/customer-directory.types";
import { AppMultiSelect } from "@/ui/components/app/primitives/app-multi-select";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppButton } from "@/ui/components/app/primitives/app-button";

interface Props {
  filters: Filters;
  searchDraft: string;
  setSearchDraft: (value: string) => void;
  onSearch: (value: string) => void;
  onFilter: (key: "departamentoId" | "municipioId" | "tipoCliente" | "volumenCompra" | "presupuestoMensual" | "intereses", value: number | string | null) => void;
  onClear: () => void;
}

const labelClass = "mb-1 block text-xs font-medium text-[hsl(var(--app-muted-foreground))]";

export function CustomerDirectoryFilters({ filters, searchDraft, setSearchDraft, onSearch, onFilter, onClear }: Props) {
  const departments = useCustomerDepartments();
  const municipalities = useCustomerMunicipalities(filters.departamentoId ?? 0);
  const selectedInterests = filters.intereses?.split(",").filter(Boolean) ?? [];
  const hasFilters = Boolean(filters.search || filters.departamentoId || filters.municipioId ||
    filters.tipoCliente || filters.volumenCompra || filters.presupuestoMensual || filters.intereses);

  return (
    <div className="min-w-0 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Filtros de clientes</h2>
        <AppButton type="button" size="sm" variant="secondary"
          leftIcon={<RotateCcw />} disabled={!hasFilters} onClick={onClear}>
          Limpiar filtros
        </AppButton>
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="min-w-0 sm:col-span-2">
          <label className={labelClass} htmlFor="customer-search">Buscar cliente</label>
          <AppSearchInput
            id="customer-search" placeholder="Nombre, apellido, correo o teléfono"
            value={searchDraft}
            onValueChange={setSearchDraft}
            onDebouncedChange={onSearch}
          />
        </div>
        <div className="min-w-0">
          <label className={labelClass} htmlFor="customer-department">Departamento</label>
          <AppSingleSelect<number>
            inputId="customer-department"
            value={filters.departamentoId ?? null}
            options={(departments.data ?? []).map((x) => ({ value: x.id, label: x.nombre }))}
            onChange={(v) => onFilter("departamentoId", v)}
            placeholder="Todos los departamentos"
            isLoading={departments.isLoading}
          />
        </div>
        <div className="min-w-0">
          <label className={labelClass} htmlFor="customer-municipality">Municipio</label>
          <AppSingleSelect<number>
            inputId="customer-municipality"
            value={filters.municipioId ?? null}
            options={(municipalities.data ?? []).map((x) => ({ value: x.id, label: x.nombre }))}
            onChange={(v) => onFilter("municipioId", v)}
            placeholder={filters.departamentoId ? "Todos los municipios" : "Selecciona departamento"}
            isDisabled={!filters.departamentoId || municipalities.isLoading}
            isLoading={municipalities.isLoading}
          />
        </div>
        <div className="min-w-0">
          <label className={labelClass} htmlFor="customer-type">Tipo de cliente</label>
          <AppSingleSelect<string>
            inputId="customer-type" value={filters.tipoCliente ?? null}
            options={customerTypeOptions}
            onChange={(v) => onFilter("tipoCliente", v)}
            placeholder="Todos los tipos"
          />
        </div>
        <div className="min-w-0">
          <label className={labelClass} htmlFor="customer-volume">Volumen de compra</label>
          <AppSingleSelect<string>
            inputId="customer-volume" value={filters.volumenCompra ?? null}
            options={customerPurchaseVolumeOptions}
            onChange={(v) => onFilter("volumenCompra", v)}
            placeholder="Todos los volúmenes"
          />
        </div>
        <div className="min-w-0">
          <label className={labelClass} htmlFor="customer-budget">Presupuesto mensual</label>
          <AppSingleSelect<string>
            inputId="customer-budget" value={filters.presupuestoMensual ?? null}
            options={customerMonthlyBudgetOptions}
            onChange={(v) => onFilter("presupuestoMensual", v)}
            placeholder="Todos los presupuestos"
          />
        </div>
        <div className="min-w-0">
          <label className={labelClass} htmlFor="customer-interests">Categorías de interés</label>
          <AppMultiSelect<string>
            inputId="customer-interests"
            value={selectedInterests}
            options={customerInterestOptions}
            onChange={(values) => onFilter("intereses", values.join(",") || null)}
            placeholder="Todos los intereses"
            noOptionsText="Sin opciones"
            density="compact"
            closeMenuOnSelect={false}
          />
        </div>
      </div>
      {departments.isError || municipalities.isError ? (
        <p role="alert" className="text-xs text-red-500">
          No se pudieron cargar algunas ubicaciones. Puedes seguir utilizando los demás filtros.
        </p>
      ) : null}
    </div>
  );
}
