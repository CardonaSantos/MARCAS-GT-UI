import { RotateCcw } from "lucide-react";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import type {
  DeliveryFailureReason,
  DeliveryState,
} from "../api/delivery.types";
import {
  DELIVERY_FAILURE_REASONS,
  DELIVERY_FAILURE_REASON_LABELS,
  DELIVERY_STATES,
  DELIVERY_STATE_LABELS,
} from "../common/delivery.constants";
import {
  DeliveryCustomerSelect,
  DeliveryUserSelect,
} from "./delivery-selects";

interface Props {
  search: string;
  estado: DeliveryState | null;
  clienteId: number | null;
  registradoPorId: number | null;
  motivoNoEntrega: DeliveryFailureReason | null;
  soloPendientes: boolean | null;
  soloSinFactura: boolean | null;
  fechaDesde: string;
  fechaHasta: string;
  showUserFilter: boolean;
  onSearchChange: (value: string) => void;
  onSearchDebouncedChange: (value: string) => void;
  onEstadoChange: (value: DeliveryState | null) => void;
  onClienteChange: (value: number | null) => void;
  onRegistradoPorChange: (value: number | null) => void;
  onMotivoChange: (value: DeliveryFailureReason | null) => void;
  onSoloPendientesChange: (value: boolean | null) => void;
  onSoloSinFacturaChange: (value: boolean | null) => void;
  onFechaDesdeChange: (value: string) => void;
  onFechaHastaChange: (value: string) => void;
  onReset: () => void;
}

const stateOptions = DELIVERY_STATES.map((value) => ({
  value,
  label: DELIVERY_STATE_LABELS[value],
}));

const reasonOptions = DELIVERY_FAILURE_REASONS.map((value) => ({
  value,
  label: DELIVERY_FAILURE_REASON_LABELS[value],
}));

function boolValue(value: boolean | null) {
  return value ? "yes" : "all";
}

export function DeliveryFilters(props: Props) {
  const hasFilters =
    Boolean(props.search) ||
    props.estado !== null ||
    props.clienteId !== null ||
    props.registradoPorId !== null ||
    props.motivoNoEntrega !== null ||
    props.soloPendientes !== null ||
    props.soloSinFactura !== null ||
    Boolean(props.fechaDesde) ||
    Boolean(props.fechaHasta);

  return (
    <div className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-4">
      <AppSearchInput
        value={props.search}
        onValueChange={props.onSearchChange}
        onDebouncedChange={props.onSearchDebouncedChange}
        placeholder="Buscar cliente, pedido, despacho o envío..."
      />
      <AppSingleSelect<DeliveryState>
        value={props.estado}
        options={stateOptions}
        onChange={props.onEstadoChange}
        placeholder="Estado"
      />
      <DeliveryCustomerSelect
        value={props.clienteId}
        onChange={props.onClienteChange}
        placeholder="Cliente"
      />
      {props.showUserFilter ? (
        <DeliveryUserSelect
          value={props.registradoPorId}
          onChange={props.onRegistradoPorChange}
          placeholder="Registrado por"
        />
      ) : null}
      <AppSingleSelect<DeliveryFailureReason>
        value={props.motivoNoEntrega}
        options={reasonOptions}
        onChange={props.onMotivoChange}
        placeholder="Motivo de no entrega"
      />
      <AppSingleSelect
        value={boolValue(props.soloPendientes)}
        options={[
          { value: "all", label: "Todas las entregas" },
          { value: "yes", label: "Sólo activas" },
        ]}
        isClearable={false}
        isSearchable={false}
        onChange={(value) =>
          props.onSoloPendientesChange(value === "yes" ? true : null)
        }
      />
      <AppSingleSelect
        value={boolValue(props.soloSinFactura)}
        options={[
          { value: "all", label: "Todas las facturas" },
          { value: "yes", label: "Listas sin facturar" },
        ]}
        isClearable={false}
        isSearchable={false}
        onChange={(value) =>
          props.onSoloSinFacturaChange(value === "yes" ? true : null)
        }
      />
      <AppDatePicker
        value={props.fechaDesde}
        outputFormat="iso"
        boundary="startOfDay"
        aria-label="Creada desde"
        onChange={(value) => props.onFechaDesdeChange(value ?? "")}
      />
      <AppDatePicker
        value={props.fechaHasta}
        outputFormat="iso"
        boundary="endOfDay"
        aria-label="Creada hasta"
        onChange={(value) => props.onFechaHastaChange(value ?? "")}
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
