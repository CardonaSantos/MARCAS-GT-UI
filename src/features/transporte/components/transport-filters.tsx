import { RotateCcw } from "lucide-react";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import type {
  ShipmentMode,
  ShipmentState,
} from "../api/transport.types";
import {
  SHIPMENT_MODES,
  SHIPMENT_MODE_LABELS,
  SHIPMENT_STATES,
  SHIPMENT_STATE_LABELS,
} from "../common/transport.constants";
import {
  TransportBodegaSelect,
  TransportCarrierSelect,
  TransportCustomerSelect,
  TransportDriverSelect,
  TransportResponsibleSelect,
  TransportVehicleSelect,
} from "./transport-selects";

interface Props {
  search: string;
  estado: ShipmentState | null;
  modalidad: ShipmentMode | null;
  bodegaId: number | null;
  transportistaId: number | null;
  vehiculoId: number | null;
  conductorId: number | null;
  responsableId: number | null;
  clienteId: number | null;
  conIncidencia: boolean | null;
  soloAtrasados: boolean | null;
  fechaDesde: string;
  fechaHasta: string;
  showCatalogFilters: boolean;
  onSearchChange: (value: string) => void;
  onSearchDebouncedChange: (value: string) => void;
  onEstadoChange: (value: ShipmentState | null) => void;
  onModalidadChange: (value: ShipmentMode | null) => void;
  onBodegaChange: (value: number | null) => void;
  onTransportistaChange: (value: number | null) => void;
  onVehiculoChange: (value: number | null) => void;
  onConductorChange: (value: number | null) => void;
  onResponsableChange: (value: number | null) => void;
  onClienteChange: (value: number | null) => void;
  onConIncidenciaChange: (value: boolean | null) => void;
  onSoloAtrasadosChange: (value: boolean | null) => void;
  onFechaDesdeChange: (value: string) => void;
  onFechaHastaChange: (value: string) => void;
  onReset: () => void;
}

const stateOptions = SHIPMENT_STATES.map((value) => ({
  value,
  label: SHIPMENT_STATE_LABELS[value],
}));

const modeOptions = SHIPMENT_MODES.map((value) => ({
  value,
  label: SHIPMENT_MODE_LABELS[value],
}));

function boolValue(value: boolean | null) {
  return value ? "yes" : "all";
}

export function TransportFilters(props: Props) {
  const hasFilters =
    Boolean(props.search) ||
    props.estado !== null ||
    props.modalidad !== null ||
    props.bodegaId !== null ||
    props.transportistaId !== null ||
    props.vehiculoId !== null ||
    props.conductorId !== null ||
    props.responsableId !== null ||
    props.clienteId !== null ||
    props.conIncidencia !== null ||
    props.soloAtrasados !== null ||
    Boolean(props.fechaDesde) ||
    Boolean(props.fechaHasta);

  return (
    <div className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-4">
      <AppSearchInput
        value={props.search}
        onValueChange={props.onSearchChange}
        onDebouncedChange={props.onSearchDebouncedChange}
        placeholder="Buscar envío, guía o destinatario..."
      />

      <AppSingleSelect<ShipmentState>
        value={props.estado}
        options={stateOptions}
        onChange={props.onEstadoChange}
        placeholder="Estado"
      />

      <AppSingleSelect<ShipmentMode>
        value={props.modalidad}
        options={modeOptions}
        onChange={props.onModalidadChange}
        placeholder="Modalidad"
      />

      <TransportBodegaSelect
        value={props.bodegaId}
        onChange={props.onBodegaChange}
        placeholder="Bodega"
      />

      <TransportCustomerSelect
        value={props.clienteId}
        onChange={props.onClienteChange}
        placeholder="Cliente"
      />

      {props.showCatalogFilters ? (
        <>
          <TransportCarrierSelect
            value={props.transportistaId}
            onChange={props.onTransportistaChange}
            placeholder="Transportista"
          />
          <TransportVehicleSelect
            value={props.vehiculoId}
            onChange={props.onVehiculoChange}
            placeholder="Vehículo"
          />
          <TransportDriverSelect
            value={props.conductorId}
            onChange={props.onConductorChange}
            placeholder="Conductor"
          />
          <TransportResponsibleSelect
            value={props.responsableId}
            onChange={props.onResponsableChange}
            placeholder="Responsable"
          />
        </>
      ) : null}

      <AppSingleSelect
        value={boolValue(props.conIncidencia)}
        options={[
          { value: "all", label: "Todas las incidencias" },
          { value: "yes", label: "Con incidencia abierta" },
        ]}
        isClearable={false}
        isSearchable={false}
        onChange={(value) =>
          props.onConIncidenciaChange(value === "yes" ? true : null)
        }
      />

      <AppSingleSelect
        value={boolValue(props.soloAtrasados)}
        options={[
          { value: "all", label: "Todas las salidas" },
          { value: "yes", label: "Sólo salidas atrasadas" },
        ]}
        isClearable={false}
        isSearchable={false}
        onChange={(value) =>
          props.onSoloAtrasadosChange(value === "yes" ? true : null)
        }
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
