import { RotateCcw } from "lucide-react";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import {
  CREDIT_APPLICATION_STATE_LABELS,
  CREDIT_APPLICATION_STATES,
  CREDIT_DECISION_LABELS,
  CREDIT_DECISION_TYPES,
  CREDIT_INTEGRATION_LABELS,
  CREDIT_INTEGRATION_STATES,
} from "../common/credit.constants";
import type {
  CreditApplicationState,
  CreditDecisionType,
  CreditIntegrationState,
} from "../api/credit.types";
import {
  CreditCustomerSelect,
  CreditPolicySelect,
  CreditRequesterSelect,
  CreditSellerSelect,
} from "./credit-selects";

interface CreditFiltersProps {
  search: string;
  estado: CreditApplicationState | null;
  clienteId: number | null;
  solicitanteId: number | null;
  vendedorId: number | null;
  politicaId: number | null;
  tipoDecision: CreditDecisionType | null;
  integracionEstado: CreditIntegrationState | null;
  fechaDesde: string;
  fechaHasta: string;
  soloPendientes: boolean | null;
  onSearchChange: (value: string) => void;
  onSearchDebouncedChange: (value: string) => void;
  onEstadoChange: (value: CreditApplicationState | null) => void;
  onClienteChange: (value: number | null) => void;
  onSolicitanteChange: (value: number | null) => void;
  onVendedorChange: (value: number | null) => void;
  onPoliticaChange: (value: number | null) => void;
  onTipoDecisionChange: (value: CreditDecisionType | null) => void;
  onIntegracionChange: (value: CreditIntegrationState | null) => void;
  onFechaDesdeChange: (value: string) => void;
  onFechaHastaChange: (value: string) => void;
  onSoloPendientesChange: (value: boolean | null) => void;
  onReset: () => void;
}

const stateOptions = CREDIT_APPLICATION_STATES.map((value) => ({
  value,
  label: CREDIT_APPLICATION_STATE_LABELS[value],
}));

const decisionOptions = CREDIT_DECISION_TYPES.map((value) => ({
  value,
  label: CREDIT_DECISION_LABELS[value],
}));

const integrationOptions = CREDIT_INTEGRATION_STATES.map((value) => ({
  value,
  label: CREDIT_INTEGRATION_LABELS[value],
}));

const pendingOptions = [
  { value: "all", label: "Todas las solicitudes" },
  { value: "pending", label: "Sólo pendientes" },
];

export function CreditFilters({
  search,
  estado,
  clienteId,
  solicitanteId,
  vendedorId,
  politicaId,
  tipoDecision,
  integracionEstado,
  fechaDesde,
  fechaHasta,
  soloPendientes,
  onSearchChange,
  onSearchDebouncedChange,
  onEstadoChange,
  onClienteChange,
  onSolicitanteChange,
  onVendedorChange,
  onPoliticaChange,
  onTipoDecisionChange,
  onIntegracionChange,
  onFechaDesdeChange,
  onFechaHastaChange,
  onSoloPendientesChange,
  onReset,
}: CreditFiltersProps) {
  const hasFilters =
    Boolean(search) ||
    estado !== null ||
    clienteId !== null ||
    solicitanteId !== null ||
    vendedorId !== null ||
    politicaId !== null ||
    tipoDecision !== null ||
    integracionEstado !== null ||
    Boolean(fechaDesde) ||
    Boolean(fechaHasta) ||
    soloPendientes !== null;

  return (
    <div className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-4">
      <AppSearchInput
        value={search}
        onValueChange={onSearchChange}
        onDebouncedChange={onSearchDebouncedChange}
        placeholder="Buscar solicitud, cliente, pedido o usuario..."
      />

      <AppSingleSelect<CreditApplicationState>
        value={estado}
        options={stateOptions}
        onChange={onEstadoChange}
        placeholder="Estado"
      />

      <CreditCustomerSelect
        value={clienteId}
        onChange={onClienteChange}
        placeholder="Cliente"
      />

      <CreditSellerSelect
        value={vendedorId}
        onChange={onVendedorChange}
        placeholder="Vendedor"
      />

      <CreditRequesterSelect
        value={solicitanteId}
        onChange={onSolicitanteChange}
        placeholder="Solicitante"
      />

      <CreditPolicySelect
        value={politicaId}
        onChange={onPoliticaChange}
        placeholder="Política"
      />

      <AppSingleSelect<CreditDecisionType>
        value={tipoDecision}
        options={decisionOptions}
        onChange={onTipoDecisionChange}
        placeholder="Decisión"
      />

      <AppSingleSelect<CreditIntegrationState>
        value={integracionEstado}
        options={integrationOptions}
        onChange={onIntegracionChange}
        placeholder="Integración"
      />

      <AppDatePicker
        value={fechaDesde}
        outputFormat="iso"
        boundary="startOfDay"
        aria-label="Fecha inicial"
        onChange={(value) => onFechaDesdeChange(value ?? "")}
      />

      <AppDatePicker
        value={fechaHasta}
        outputFormat="iso"
        boundary="endOfDay"
        aria-label="Fecha final"
        onChange={(value) => onFechaHastaChange(value ?? "")}
      />

      <AppSingleSelect
        value={soloPendientes ? "pending" : "all"}
        options={pendingOptions}
        isClearable={false}
        isSearchable={false}
        onChange={(value) =>
          onSoloPendientesChange(value === "pending" ? true : null)
        }
      />

      <div className="flex justify-end">
        <AppButton
          variant="secondary"
          size="sm"
          leftIcon={<RotateCcw />}
          disabled={!hasFilters}
          onClick={onReset}
        >
          Limpiar filtros
        </AppButton>
      </div>
    </div>
  );
}
