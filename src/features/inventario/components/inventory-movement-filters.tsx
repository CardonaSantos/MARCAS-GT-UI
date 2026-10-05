import { RotateCcw } from "lucide-react";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import { INVENTORY_MOVEMENT_LABELS } from "../common/inventory.constants";
import type { InventoryMovementType } from "../api/inventory.types";
import {
  InventoryBodegaSelect,
  InventoryProductSelect,
  InventoryUserSelect,
} from "./inventory-selects";

interface InventoryMovementFiltersProps {
  bodegaId: number | null;
  productoId: number | null;
  tipo: InventoryMovementType | null;
  referenciaTipo: string;
  referenciaId: number | null;
  creadoPorId: number | null;
  fechaDesde: string;
  fechaHasta: string;
  onBodegaChange: (value: number | null) => void;
  onProductoChange: (value: number | null) => void;
  onTipoChange: (value: InventoryMovementType | null) => void;
  onReferenciaTipoChange: (value: string) => void;
  onReferenciaIdChange: (value: number | null) => void;
  onCreadoPorChange: (value: number | null) => void;
  onFechaDesdeChange: (value: string) => void;
  onFechaHastaChange: (value: string) => void;
  onReset: () => void;
}

const movementOptions = Object.entries(INVENTORY_MOVEMENT_LABELS).map(
  ([value, label]) => ({
    value: value as InventoryMovementType,
    label,
  }),
);

export function InventoryMovementFilters({
  bodegaId,
  productoId,
  tipo,
  referenciaTipo,
  referenciaId,
  creadoPorId,
  fechaDesde,
  fechaHasta,
  onBodegaChange,
  onProductoChange,
  onTipoChange,
  onReferenciaTipoChange,
  onReferenciaIdChange,
  onCreadoPorChange,
  onFechaDesdeChange,
  onFechaHastaChange,
  onReset,
}: InventoryMovementFiltersProps) {
  const hasFilters =
    bodegaId !== null ||
    productoId !== null ||
    tipo !== null ||
    Boolean(referenciaTipo) ||
    referenciaId !== null ||
    creadoPorId !== null ||
    Boolean(fechaDesde) ||
    Boolean(fechaHasta);

  return (
    <div className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-4">
      <InventoryBodegaSelect
        value={bodegaId}
        onChange={(value) => onBodegaChange(value)}
        placeholder="Bodega *"
      />

      <InventoryProductSelect
        value={productoId}
        onChange={(value) => onProductoChange(value)}
        placeholder="Producto *"
      />

      <AppSingleSelect<InventoryMovementType>
        value={tipo}
        options={movementOptions}
        onChange={(value) => onTipoChange(value)}
        placeholder="Tipo de movimiento"
      />

      <InventoryUserSelect
        value={creadoPorId}
        onChange={(value) => onCreadoPorChange(value)}
        placeholder="Usuario"
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

      <AppInput
        value={referenciaTipo}
        placeholder="Tipo de referencia"
        aria-label="Tipo de referencia"
        onChange={(event) => onReferenciaTipoChange(event.target.value)}
      />

      <div className="flex gap-2">
        <AppInput
          value={referenciaId ?? ""}
          type="number"
          min={1}
          inputMode="numeric"
          placeholder="ID referencia"
          aria-label="ID de referencia"
          onChange={(event) => {
            const value = event.target.value;
            onReferenciaIdChange(value ? Number(value) : null);
          }}
        />

        <AppButton
          variant="secondary"
          size="sm"
          leftIcon={<RotateCcw />}
          disabled={!hasFilters}
          onClick={onReset}
        >
          Limpiar
        </AppButton>
      </div>
    </div>
  );
}
