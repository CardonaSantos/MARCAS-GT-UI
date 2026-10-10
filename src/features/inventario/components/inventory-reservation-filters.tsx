import { RotateCcw } from "lucide-react";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import {
  INVENTORY_RESERVATION_LABELS,
} from "../common/inventory.constants";
import type { InventoryReservationState } from "../api/inventory.types";
import {
  InventoryBodegaSelect,
  InventoryProductSelect,
} from "./inventory-selects";

interface InventoryReservationFiltersProps {
  bodegaId: number | null;
  productoId: number | null;
  pedidoDetalleId: number | null;
  estado: InventoryReservationState | null;
  onBodegaChange: (value: number | null) => void;
  onProductoChange: (value: number | null) => void;
  onPedidoDetalleChange: (value: number | null) => void;
  onEstadoChange: (value: InventoryReservationState | null) => void;
  onReset: () => void;
}

const stateOptions = Object.entries(INVENTORY_RESERVATION_LABELS).map(
  ([value, label]) => ({
    value: value as InventoryReservationState,
    label,
  }),
);

export function InventoryReservationFilters({
  bodegaId,
  productoId,
  pedidoDetalleId,
  estado,
  onBodegaChange,
  onProductoChange,
  onPedidoDetalleChange,
  onEstadoChange,
  onReset,
}: InventoryReservationFiltersProps) {
  const hasFilters =
    bodegaId !== null ||
    productoId !== null ||
    pedidoDetalleId !== null ||
    estado !== null;

  return (
    <div className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-[1fr_1.2fr_1fr_170px_auto]">
      <InventoryBodegaSelect
        value={bodegaId}
        onChange={(value) => onBodegaChange(value)}
        placeholder="Bodega"
      />

      <InventoryProductSelect
        value={productoId}
        onChange={(value) => onProductoChange(value)}
        placeholder="Producto"
      />

      <AppSingleSelect<InventoryReservationState>
        value={estado}
        options={stateOptions}
        onChange={(value) => onEstadoChange(value)}
        placeholder="Estado"
      />

      <AppInput
        type="number"
        min={1}
        inputMode="numeric"
        value={pedidoDetalleId ?? ""}
        placeholder="Detalle pedido"
        aria-label="ID de detalle de pedido"
        onChange={(event) => {
          const value = event.target.value;
          onPedidoDetalleChange(value ? Number(value) : null);
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
  );
}
