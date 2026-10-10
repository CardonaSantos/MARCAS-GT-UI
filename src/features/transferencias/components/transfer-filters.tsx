import { RotateCcw } from "lucide-react";

import type { BodegaSelectable } from "@/features/bodegas/api/bodega.types";
import type { UserSelectable } from "@/features/common/catalogs/catalog.types";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import type { TransferState } from "../api/transfer.types";
import {
  TRANSFER_STATES,
  TRANSFER_STATE_LABELS,
} from "../common/transfer.constants";

export function TransferFilters({
  search,
  estado,
  bodegaOrigenId,
  bodegaDestinoId,
  creadoPorId,
  fechaDesde,
  fechaHasta,
  soloPendientes,
  bodegas,
  usuarios,
  onSearchChange,
  onSearchDebouncedChange,
  onEstadoChange,
  onBodegaOrigenChange,
  onBodegaDestinoChange,
  onCreadoPorChange,
  onFechaDesdeChange,
  onFechaHastaChange,
  onSoloPendientesChange,
  onReset,
}: {
  search: string;
  estado: TransferState | null;
  bodegaOrigenId: number | null;
  bodegaDestinoId: number | null;
  creadoPorId: number | null;
  fechaDesde: string;
  fechaHasta: string;
  soloPendientes: boolean | null;
  bodegas: BodegaSelectable[];
  usuarios: UserSelectable[];
  onSearchChange: (value: string) => void;
  onSearchDebouncedChange: (value: string) => void;
  onEstadoChange: (value: TransferState | null) => void;
  onBodegaOrigenChange: (value: number | null) => void;
  onBodegaDestinoChange: (value: number | null) => void;
  onCreadoPorChange: (value: number | null) => void;
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
        placeholder="Buscar bodega, producto, usuario..."
        aria-label="Buscar transferencias"
      />

      <AppSingleSelect<TransferState>
        value={estado}
        options={TRANSFER_STATES.map((value) => ({
          value,
          label: TRANSFER_STATE_LABELS[value],
        }))}
        onChange={onEstadoChange}
        placeholder="Estado"
      />

      <AppSingleSelect<number>
        value={bodegaOrigenId}
        options={bodegas.map((item) => ({
          value: item.id,
          label: item.codigo + " · " + item.nombre,
        }))}
        onChange={onBodegaOrigenChange}
        placeholder="Bodega origen"
      />

      <AppSingleSelect<number>
        value={bodegaDestinoId}
        options={bodegas.map((item) => ({
          value: item.id,
          label: item.codigo + " · " + item.nombre,
        }))}
        onChange={onBodegaDestinoChange}
        placeholder="Bodega destino"
      />

      <AppSingleSelect<number>
        value={creadoPorId}
        options={usuarios
          .filter((item) => item.rol === "ADMIN" || item.rol === "BODEGA")
          .map((item) => ({
            value: item.id,
            label: item.nombre,
          }))}
        onChange={onCreadoPorChange}
        placeholder="Creado por"
      />

      <AppSingleSelect<string>
        value={
          soloPendientes === true
            ? "pending"
            : soloPendientes === false
              ? "all"
              : null
        }
        options={[
          { value: "pending", label: "Sólo pendientes" },
          { value: "all", label: "Todas las transferencias" },
        ]}
        onChange={(value) =>
          onSoloPendientesChange(
            value === "pending" ? true : value === "all" ? false : null,
          )
        }
        placeholder="Pendientes"
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
