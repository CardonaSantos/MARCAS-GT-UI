import { RotateCcw } from "lucide-react";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import {
  CreditCustomerSelect,
  CreditSellerSelect,
} from "./credit-selects";

export function CreditPortfolioFilters({
  search,
  estado,
  clienteId,
  vendedorId,
  fechaDesde,
  fechaHasta,
  conSaldoPendiente,
  onSearchChange,
  onSearchDebouncedChange,
  onEstadoChange,
  onClienteChange,
  onVendedorChange,
  onFechaDesdeChange,
  onFechaHastaChange,
  onSaldoChange,
  onReset,
}: {
  search: string;
  estado: "ACTIVO" | "CERRADO" | null;
  clienteId: number | null;
  vendedorId: number | null;
  fechaDesde: string;
  fechaHasta: string;
  conSaldoPendiente: boolean | null;
  onSearchChange: (value: string) => void;
  onSearchDebouncedChange: (value: string) => void;
  onEstadoChange: (value: "ACTIVO" | "CERRADO" | null) => void;
  onClienteChange: (value: number | null) => void;
  onVendedorChange: (value: number | null) => void;
  onFechaDesdeChange: (value: string) => void;
  onFechaHastaChange: (value: string) => void;
  onSaldoChange: (value: boolean | null) => void;
  onReset: () => void;
}) {
  const hasFilters =
    Boolean(search) ||
    estado !== null ||
    clienteId !== null ||
    vendedorId !== null ||
    Boolean(fechaDesde) ||
    Boolean(fechaHasta) ||
    conSaldoPendiente !== null;

  return (
    <div className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-4">
      <AppSearchInput
        value={search}
        onValueChange={onSearchChange}
        onDebouncedChange={onSearchDebouncedChange}
        placeholder="Buscar crédito, solicitud, pedido o cliente..."
      />

      <AppSingleSelect<"ACTIVO" | "CERRADO">
        value={estado}
        options={[
          { value: "ACTIVO", label: "Activo" },
          { value: "CERRADO", label: "Cerrado" },
        ]}
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

      <AppDatePicker
        value={fechaDesde}
        outputFormat="iso"
        boundary="startOfDay"
        aria-label="Desde"
        onChange={(value) => onFechaDesdeChange(value ?? "")}
      />

      <AppDatePicker
        value={fechaHasta}
        outputFormat="iso"
        boundary="endOfDay"
        aria-label="Hasta"
        onChange={(value) => onFechaHastaChange(value ?? "")}
      />

      <AppSingleSelect
        value={conSaldoPendiente ? "pending" : "all"}
        options={[
          { value: "all", label: "Todos los saldos" },
          { value: "pending", label: "Con saldo pendiente" },
        ]}
        isClearable={false}
        isSearchable={false}
        onChange={(value) =>
          onSaldoChange(value === "pending" ? true : null)
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
