import { RotateCcw } from "lucide-react";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import type { DispatchState } from "../api/dispatch.types";
import {
  DISPATCH_STATES,
  DISPATCH_STATE_LABELS,
} from "../common/dispatch.constants";
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

const yesNo = [
  { value: "all", label: "Todos" },
  { value: "yes", label: "Sí" },
];

function boolValue(value: boolean | null) {
  return value ? "yes" : "all";
}

export function DispatchFilters(props: Props) {
  const hasFilters =
    Boolean(props.search) ||
    props.estado !== null ||
    props.bodegaId !== null ||
    props.clienteId !== null ||
    props.vendedorId !== null ||
    props.creadoPorId !== null ||
    props.preparadoPorId !== null ||
    props.despachadoPorId !== null ||
    Boolean(props.fechaDesde) ||
    Boolean(props.fechaHasta) ||
    Boolean(props.programadoDesde) ||
    Boolean(props.programadoHasta) ||
    props.soloPendientes !== null ||
    props.soloAtrasados !== null ||
    props.conPendientePreparacion !== null ||
    props.conPendienteDespacho !== null;

  return (
    <div className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-4">
      <AppSearchInput
        value={props.search}
        onValueChange={props.onSearchChange}
        onDebouncedChange={props.onSearchDebouncedChange}
        placeholder="Buscar despacho, pedido o cliente..."
      />

      <AppSingleSelect<DispatchState>
        value={props.estado}
        options={stateOptions}
        onChange={props.onEstadoChange}
        placeholder="Estado"
      />

      <DispatchBodegaSelect
        value={props.bodegaId}
        onChange={props.onBodegaChange}
        placeholder="Bodega"
      />

      <DispatchCustomerSelect
        value={props.clienteId}
        onChange={props.onClienteChange}
        placeholder="Cliente"
      />

      <DispatchSellerSelect
        value={props.vendedorId}
        onChange={props.onVendedorChange}
        placeholder="Vendedor"
      />

      <DispatchUserSelect
        value={props.creadoPorId}
        onChange={props.onCreadoPorChange}
        placeholder="Creado por"
      />

      <DispatchUserSelect
        value={props.preparadoPorId}
        onChange={props.onPreparadoPorChange}
        placeholder="Preparado por"
      />

      <DispatchUserSelect
        value={props.despachadoPorId}
        onChange={props.onDespachadoPorChange}
        placeholder="Despachado por"
      />

      <AppDatePicker
        value={props.fechaDesde}
        outputFormat="iso"
        boundary="startOfDay"
        aria-label="Creado desde"
        onChange={(value) => props.onFechaDesdeChange(value ?? "")}
      />

      <AppDatePicker
        value={props.fechaHasta}
        outputFormat="iso"
        boundary="endOfDay"
        aria-label="Creado hasta"
        onChange={(value) => props.onFechaHastaChange(value ?? "")}
      />

      <AppDatePicker
        value={props.programadoDesde}
        outputFormat="iso"
        boundary="startOfDay"
        aria-label="Programado desde"
        onChange={(value) => props.onProgramadoDesdeChange(value ?? "")}
      />

      <AppDatePicker
        value={props.programadoHasta}
        outputFormat="iso"
        boundary="endOfDay"
        aria-label="Programado hasta"
        onChange={(value) => props.onProgramadoHastaChange(value ?? "")}
      />

      <AppSingleSelect
        value={boolValue(props.soloPendientes)}
        options={[
          { value: "all", label: "Todas las órdenes" },
          { value: "yes", label: "Sólo abiertas" },
        ]}
        isClearable={false}
        isSearchable={false}
        onChange={(value) =>
          props.onSoloPendientesChange(value === "yes" ? true : null)
        }
      />

      <AppSingleSelect
        value={boolValue(props.soloAtrasados)}
        options={[
          { value: "all", label: "Programación" },
          { value: "yes", label: "Sólo atrasados" },
        ]}
        isClearable={false}
        isSearchable={false}
        onChange={(value) =>
          props.onSoloAtrasadosChange(value === "yes" ? true : null)
        }
      />

      <AppSingleSelect
        value={boolValue(props.conPendientePreparacion)}
        options={yesNo}
        isClearable={false}
        isSearchable={false}
        placeholder="Pendiente preparación"
        onChange={(value) =>
          props.onPendientePreparacionChange(value === "yes" ? true : null)
        }
      />

      <AppSingleSelect
        value={boolValue(props.conPendienteDespacho)}
        options={yesNo}
        isClearable={false}
        isSearchable={false}
        placeholder="Pendiente despacho"
        onChange={(value) =>
          props.onPendienteDespachoChange(value === "yes" ? true : null)
        }
      />

      <div className="flex justify-end xl:col-start-4">
        <AppButton
          variant="secondary"
          size="sm"
          leftIcon={<RotateCcw />}
          disabled={!hasFilters}
          onClick={props.onReset}
        >
          Limpiar filtros
        </AppButton>
      </div>
    </div>
  );
}
