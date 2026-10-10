import { RotateCcw } from "lucide-react";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppInline } from "@/ui/components/app/primitives/app-inline";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import {
  InventoryBodegaSelect,
  InventoryProductSelect,
} from "./inventory-selects";

interface InventoryStockFiltersProps {
  search: string;
  bodegaId: number | null;
  productoId: number | null;
  conExistencia: boolean | null;
  conReservas: boolean | null;
  onSearchChange: (value: string) => void;
  onSearchDebouncedChange: (value: string) => void;
  onBodegaChange: (value: number | null) => void;
  onProductoChange: (value: number | null) => void;
  onExistenciaChange: (value: boolean | null) => void;
  onReservasChange: (value: boolean | null) => void;
  onReset: () => void;
}

const existenceOptions = [
  { value: "all", label: "Toda existencia" },
  { value: "yes", label: "Con existencia" },
  { value: "no", label: "Sin existencia" },
];

const reservationOptions = [
  { value: "all", label: "Todas las reservas" },
  { value: "yes", label: "Con reservas" },
  { value: "no", label: "Sin reservas" },
];

export function InventoryStockFilters({
  search,
  bodegaId,
  productoId,
  conExistencia,
  conReservas,
  onSearchChange,
  onSearchDebouncedChange,
  onBodegaChange,
  onProductoChange,
  onExistenciaChange,
  onReservasChange,
  onReset,
}: InventoryStockFiltersProps) {
  const hasFilters =
    Boolean(search) ||
    bodegaId !== null ||
    productoId !== null ||
    conExistencia !== null ||
    conReservas !== null;

  return (
    <div className="grid w-full gap-2 lg:grid-cols-2 xl:grid-cols-[minmax(240px,1.5fr)_minmax(190px,1fr)_minmax(220px,1.2fr)_170px_170px_auto]">
      <AppSearchInput
        value={search}
        onValueChange={onSearchChange}
        onDebouncedChange={onSearchDebouncedChange}
        placeholder="Buscar producto o bodega..."
      />

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

      <AppSingleSelect
        value={
          conExistencia === null ? "all" : conExistencia ? "yes" : "no"
        }
        options={existenceOptions}
        isClearable={false}
        isSearchable={false}
        onChange={(value) =>
          onExistenciaChange(
            value === "yes" ? true : value === "no" ? false : null,
          )
        }
      />

      <AppSingleSelect
        value={conReservas === null ? "all" : conReservas ? "yes" : "no"}
        options={reservationOptions}
        isClearable={false}
        isSearchable={false}
        onChange={(value) =>
          onReservasChange(
            value === "yes" ? true : value === "no" ? false : null,
          )
        }
      />

      <AppInline align="center">
        <AppButton
          variant="secondary"
          size="sm"
          leftIcon={<RotateCcw />}
          disabled={!hasFilters}
          onClick={onReset}
        >
          Limpiar
        </AppButton>
      </AppInline>
    </div>
  );
}
