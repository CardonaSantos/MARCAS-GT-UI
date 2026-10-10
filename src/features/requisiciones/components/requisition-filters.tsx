import { RotateCcw } from "lucide-react";

import type { BodegaSelectable } from "@/features/bodegas/api/bodega.types";
import type {
  ProviderSelectable,
  UserSelectable,
} from "@/features/common/catalogs/catalog.types";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import type { RequisitionState } from "../api/requisition.types";
import {
  REQUISITION_STATES,
  REQUISITION_STATE_LABELS,
} from "../common/requisition.constants";

export function RequisitionFilters({
  search,
  estado,
  bodegaDestinoId,
  proveedorId,
  solicitanteId,
  fechaDesde,
  fechaHasta,
  soloPendientesRecepcion,
  bodegas,
  proveedores,
  usuarios,
  onSearchChange,
  onSearchDebouncedChange,
  onEstadoChange,
  onBodegaChange,
  onProveedorChange,
  onSolicitanteChange,
  onFechaDesdeChange,
  onFechaHastaChange,
  onSoloPendientesChange,
  onReset,
}: {
  search: string;
  estado: RequisitionState | null;
  bodegaDestinoId: number | null;
  proveedorId: number | null;
  solicitanteId: number | null;
  fechaDesde: string;
  fechaHasta: string;
  soloPendientesRecepcion: boolean | null;
  bodegas: BodegaSelectable[];
  proveedores: ProviderSelectable[];
  usuarios: UserSelectable[];
  onSearchChange: (value: string) => void;
  onSearchDebouncedChange: (value: string) => void;
  onEstadoChange: (value: RequisitionState | null) => void;
  onBodegaChange: (value: number | null) => void;
  onProveedorChange: (value: number | null) => void;
  onSolicitanteChange: (value: number | null) => void;
  onFechaDesdeChange: (value: string) => void;
  onFechaHastaChange: (value: string) => void;
  onSoloPendientesChange: (value: boolean | null) => void;
  onReset: () => void;
}) {
  return (
    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
      <AppSearchInput
        value={search}
        onValueChange={(value) => onSearchChange(value)}
        onDebouncedChange={onSearchDebouncedChange}
        placeholder="Buscar bodega, proveedor, producto..."
        aria-label="Buscar requisiciones"
      />

      <AppSingleSelect<RequisitionState>
        value={estado}
        options={REQUISITION_STATES.map((value) => ({
          value,
          label: REQUISITION_STATE_LABELS[value],
        }))}
        onChange={onEstadoChange}
        placeholder="Estado"
      />

      <AppSingleSelect<number>
        value={bodegaDestinoId}
        options={bodegas.map((item) => ({
          value: item.id,
          label: item.codigo + " · " + item.nombre,
        }))}
        onChange={onBodegaChange}
        placeholder="Bodega destino"
      />

      <AppSingleSelect<number>
        value={proveedorId}
        options={proveedores.map((item) => ({
          value: item.id,
          label: item.nombre,
        }))}
        onChange={onProveedorChange}
        placeholder="Proveedor"
      />

      <AppSingleSelect<number>
        value={solicitanteId}
        options={usuarios.map((item) => ({
          value: item.id,
          label: item.nombre,
        }))}
        onChange={onSolicitanteChange}
        placeholder="Solicitante"
      />

      <AppSingleSelect<string>
        value={
          soloPendientesRecepcion === true
            ? "pending"
            : soloPendientesRecepcion === false
              ? "all"
              : null
        }
        options={[
          { value: "pending", label: "Sólo pendientes de recepción" },
          { value: "all", label: "Todas las requisiciones" },
        ]}
        onChange={(value) =>
          onSoloPendientesChange(
            value === "pending" ? true : value === "all" ? false : null,
          )
        }
        placeholder="Pendientes de recepción"
      />

      <AppInput
        type="date"
        value={fechaDesde}
        onChange={(event) => onFechaDesdeChange(event.target.value)}
        aria-label="Fecha desde"
      />
      <div className="flex gap-2">
        <AppInput
          type="date"
          value={fechaHasta}
          onChange={(event) => onFechaHastaChange(event.target.value)}
          aria-label="Fecha hasta"
        />
        <AppButton
          type="button"
          variant="secondary"
          size="sm"
          onClick={onReset}
          aria-label="Limpiar filtros"
        >
          <RotateCcw className="h-4 w-4" />
          Limpiar
        </AppButton>
      </div>
    </div>
  );
}
