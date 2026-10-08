import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import type { DispatchState } from "../api/dispatch.types";
import { DISPATCH_STATES, DISPATCH_STATE_LABELS } from "../common/dispatch.constants";
import {
  DispatchBodegaSelect,
  DispatchCustomerSelect,
  DispatchSellerSelect,
  DispatchUserSelect,
} from "./dispatch-selects";

interface Props {
  search: string;
  estado: DispatchState | null;
  bodegaId: number | null;
  clienteId: number | null;
  vendedorId: number | null;
  creadoPorId: number | null;
  preparadoPorId: number | null;
  despachadoPorId: number | null;
  fechaDesde: string;
  fechaHasta: string;
  programadoDesde: string;
  programadoHasta: string;
  soloPendientes: boolean | null;
  soloAtrasados: boolean | null;
  conPendientePreparacion: boolean | null;
  conPendienteDespacho: boolean | null;
  onSearchChange: (value: string) => void;
  onSearchDebouncedChange: (value: string) => void;
  onEstadoChange: (value: DispatchState | null) => void;
  onBodegaChange: (value: number | null) => void;
  onClienteChange: (value: number | null) => void;
  onVendedorChange: (value: number | null) => void;
  onCreadoPorChange: (value: number | null) => void;
  onPreparadoPorChange: (value: number | null) => void;
  onDespachadoPorChange: (value: number | null) => void;
  onFechaDesdeChange: (value: string) => void;
  onFechaHastaChange: (value: string) => void;
  onProgramadoDesdeChange: (value: string) => void;
  onProgramadoHastaChange: (value: string) => void;
  onSoloPendientesChange: (value: boolean | null) => void;
  onSoloAtrasadosChange: (value: boolean | null) => void;
  onPendientePreparacionChange: (value: boolean | null) => void;
  onPendienteDespachoChange: (value: boolean | null) => void;
  onReset: () => void;
}

const stateOptions = DISPATCH_STATES.map((value) => ({
  value,
  label: DISPATCH_STATE_LABELS[value],
}));

const boolValue = (value: boolean | null) => (value ? "yes" : "all");

const labelClass = "mb-1.5 block text-xs font-medium text-[hsl(var(--app-muted-foreground))]";
const groupClass = "min-w-0 rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border))] p-3";

export function DispatchFilters(props: Props) {
  const advancedCount = [
    props.creadoPorId,
    props.preparadoPorId,
    props.despachadoPorId,
    props.soloPendientes,
    props.soloAtrasados,
    props.conPendientePreparacion,
    props.conPendienteDespacho,
  ].filter((value) => value !== null).length;

  const hasFilters =
    Boolean(props.search.trim()) ||
    [
      props.estado,
      props.bodegaId,
      props.clienteId,
      props.vendedorId,
      props.creadoPorId,
      props.preparadoPorId,
      props.despachadoPorId,
      props.soloPendientes,
      props.soloAtrasados,
      props.conPendientePreparacion,
      props.conPendienteDespacho,
    ].some((value) => value !== null) ||
    Boolean(props.fechaDesde || props.fechaHasta || props.programadoDesde || props.programadoHasta);

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">Filtros de despachos</h3>
          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
            Busca órdenes y acota por estado, responsables o fechas.
          </p>
        </div>
        <AppButton
          type="button"
          variant="secondary"
          size="sm"
          leftIcon={<RotateCcw />}
          disabled={!hasFilters}
          onClick={props.onReset}
        >
          Limpiar filtros
        </AppButton>
      </div>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.7fr)_repeat(4,minmax(0,1fr))]">
        <div className="min-w-0">
          <label htmlFor="dispatch-search" className={labelClass}>Buscar</label>
          <AppSearchInput
            id="dispatch-search"
            value={props.search}
            onValueChange={props.onSearchChange}
            onDebouncedChange={props.onSearchDebouncedChange}
            placeholder="Despacho, pedido o cliente"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="dispatch-state" className={labelClass}>Estado</label>
          <AppSingleSelect<DispatchState>
            inputId="dispatch-state"
            value={props.estado}
            options={stateOptions}
            onChange={props.onEstadoChange}
            placeholder="Todos los estados"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="dispatch-warehouse" className={labelClass}>Bodega</label>
          <DispatchBodegaSelect
            inputId="dispatch-warehouse"
            value={props.bodegaId}
            onChange={props.onBodegaChange}
            placeholder="Todas las bodegas"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="dispatch-customer" className={labelClass}>Cliente</label>
          <DispatchCustomerSelect
            inputId="dispatch-customer"
            value={props.clienteId}
            onChange={props.onClienteChange}
            placeholder="Todos los clientes"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="dispatch-seller" className={labelClass}>Vendedor</label>
          <DispatchSellerSelect
            inputId="dispatch-seller"
            value={props.vendedorId}
            onChange={props.onVendedorChange}
            placeholder="Todos los vendedores"
          />
        </div>
      </div>

      <div className="grid min-w-0 gap-3 lg:grid-cols-2">
        <fieldset className={groupClass}>
          <legend className="px-1 text-xs font-semibold">Fecha de creación</legend>
          <p className="mb-2 text-xs text-[hsl(var(--app-muted-foreground))]">
            Cuándo se creó la orden de despacho.
          </p>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2">
            <div className="min-w-0">
              <label htmlFor="dispatch-created-from" className={labelClass}>Desde</label>
              <AppDatePicker
                id="dispatch-created-from"
                value={props.fechaDesde}
                outputFormat="iso"
                boundary="startOfDay"
                aria-label="Fecha de creación desde"
                maxDate={props.fechaHasta || undefined}
                onChange={(value) => props.onFechaDesdeChange(value ?? "")}
              />
            </div>
            <div className="min-w-0">
              <label htmlFor="dispatch-created-to" className={labelClass}>Hasta</label>
              <AppDatePicker
                id="dispatch-created-to"
                value={props.fechaHasta}
                outputFormat="iso"
                boundary="endOfDay"
                aria-label="Fecha de creación hasta"
                minDate={props.fechaDesde || undefined}
                onChange={(value) => props.onFechaHastaChange(value ?? "")}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className={groupClass}>
          <legend className="px-1 text-xs font-semibold">Fecha programada</legend>
          <p className="mb-2 text-xs text-[hsl(var(--app-muted-foreground))]">
            Para cuándo estaba programado el despacho.
          </p>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2">
            <div className="min-w-0">
              <label htmlFor="dispatch-scheduled-from" className={labelClass}>Desde</label>
              <AppDatePicker
                id="dispatch-scheduled-from"
                value={props.programadoDesde}
                outputFormat="iso"
                boundary="startOfDay"
                aria-label="Fecha programada desde"
                maxDate={props.programadoHasta || undefined}
                onChange={(value) => props.onProgramadoDesdeChange(value ?? "")}
              />
            </div>
            <div className="min-w-0">
              <label htmlFor="dispatch-scheduled-to" className={labelClass}>Hasta</label>
              <AppDatePicker
                id="dispatch-scheduled-to"
                value={props.programadoHasta}
                outputFormat="iso"
                boundary="endOfDay"
                aria-label="Fecha programada hasta"
                minDate={props.programadoDesde || undefined}
                onChange={(value) => props.onProgramadoHastaChange(value ?? "")}
              />
            </div>
          </div>
        </fieldset>
      </div>

      <details
        key={advancedCount > 0 ? "with-advanced-filters" : "without-advanced-filters"}
        open={advancedCount > 0 ? true : undefined}
        className="group min-w-0 rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border))]"
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-xs font-semibold [&::-webkit-details-marker]:hidden">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filtros avanzados
          {advancedCount > 0 ? (
            <span className="rounded-full bg-[hsl(var(--app-primary)/0.12)] px-2 py-0.5 text-[hsl(var(--app-primary))]">
              {advancedCount} activos
            </span>
          ) : (
            <span className="font-normal text-[hsl(var(--app-muted-foreground))]">
              Responsables y pendientes
            </span>
          )}
          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>

        <div className="grid gap-4 border-t border-[hsl(var(--app-border))] p-3 lg:grid-cols-2">
          <fieldset className="min-w-0">
            <legend className="mb-2 text-xs font-semibold">Responsables de la operación</legend>
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              <div className="min-w-0">
                <label htmlFor="dispatch-created-by" className={labelClass}>Creado por</label>
                <DispatchUserSelect
                  inputId="dispatch-created-by"
                  value={props.creadoPorId}
                  onChange={props.onCreadoPorChange}
                  placeholder="Cualquier usuario"
                />
              </div>
              <div className="min-w-0">
                <label htmlFor="dispatch-prepared-by" className={labelClass}>Preparado por</label>
                <DispatchUserSelect
                  inputId="dispatch-prepared-by"
                  value={props.preparadoPorId}
                  onChange={props.onPreparadoPorChange}
                  placeholder="Cualquier usuario"
                />
              </div>
              <div className="min-w-0 sm:col-span-2">
                <label htmlFor="dispatch-output-by" className={labelClass}>Despachado por</label>
                <DispatchUserSelect
                  inputId="dispatch-output-by"
                  value={props.despachadoPorId}
                  onChange={props.onDespachadoPorChange}
                  placeholder="Cualquier usuario"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="mb-2 text-xs font-semibold">Condiciones operativas</legend>
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              <div className="min-w-0">
                <label htmlFor="dispatch-only-open" className={labelClass}>Órdenes abiertas</label>
                <AppSingleSelect
                  inputId="dispatch-only-open"
                  value={boolValue(props.soloPendientes)}
                  options={[
                    { value: "all", label: "Todas las órdenes" },
                    { value: "yes", label: "Solo abiertas" },
                  ]}
                  isClearable={false}
                  isSearchable={false}
                  onChange={(value) => props.onSoloPendientesChange(value === "yes" ? true : null)}
                />
              </div>
              <div className="min-w-0">
                <label htmlFor="dispatch-only-late" className={labelClass}>Programación vencida</label>
                <AppSingleSelect
                  inputId="dispatch-only-late"
                  value={boolValue(props.soloAtrasados)}
                  options={[
                    { value: "all", label: "Todos los plazos" },
                    { value: "yes", label: "Solo atrasados" },
                  ]}
                  isClearable={false}
                  isSearchable={false}
                  onChange={(value) => props.onSoloAtrasadosChange(value === "yes" ? true : null)}
                />
              </div>
              <div className="min-w-0">
                <label htmlFor="dispatch-pending-preparation" className={labelClass}>Preparación pendiente</label>
                <AppSingleSelect
                  inputId="dispatch-pending-preparation"
                  value={boolValue(props.conPendientePreparacion)}
                  options={[
                    { value: "all", label: "Todas las órdenes" },
                    { value: "yes", label: "Con unidades pendientes" },
                  ]}
                  isClearable={false}
                  isSearchable={false}
                  onChange={(value) => props.onPendientePreparacionChange(value === "yes" ? true : null)}
                />
              </div>
              <div className="min-w-0">
                <label htmlFor="dispatch-pending-output" className={labelClass}>Despacho pendiente</label>
                <AppSingleSelect
                  inputId="dispatch-pending-output"
                  value={boolValue(props.conPendienteDespacho)}
                  options={[
                    { value: "all", label: "Todas las órdenes" },
                    { value: "yes", label: "Con unidades pendientes" },
                  ]}
                  isClearable={false}
                  isSearchable={false}
                  onChange={(value) => props.onPendienteDespachoChange(value === "yes" ? true : null)}
                />
              </div>
            </div>
          </fieldset>
        </div>
      </details>
    </div>
  );
}
