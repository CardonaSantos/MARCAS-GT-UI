import { RotateCcw } from "lucide-react";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import {
  ORDER_PAYMENT_CONDITION_LABELS,
  ORDER_PAYMENT_CONDITIONS,
  ORDER_PAYMENT_STATE_LABELS,
  ORDER_PAYMENT_STATES,
  ORDER_STATE_LABELS,
  ORDER_STATES,
} from "../common/order.constants";
import type {
  OrderPaymentCondition,
  OrderPaymentState,
  OrderState,
} from "../api/order.types";
import {
  OrderCustomerSelect,
  OrderSellerSelect,
  OrderVisitSelect,
} from "./order-selects";

interface OrderFiltersProps {
  search: string;
  estado: OrderState | null;
  estadoPago: OrderPaymentState | null;
  condicionPago: OrderPaymentCondition | null;
  clienteId: number | null;
  vendedorId: number | null;
  visitaId: number | null;
  fechaDesde: string;
  fechaHasta: string;
  soloAbiertos: boolean | null;
  onSearchChange: (value: string) => void;
  onSearchDebouncedChange: (value: string) => void;
  onEstadoChange: (value: OrderState | null) => void;
  onEstadoPagoChange: (value: OrderPaymentState | null) => void;
  onCondicionPagoChange: (value: OrderPaymentCondition | null) => void;
  onClienteChange: (value: number | null) => void;
  onVendedorChange: (value: number | null) => void;
  onVisitaChange: (value: number | null) => void;
  onFechaDesdeChange: (value: string) => void;
  onFechaHastaChange: (value: string) => void;
  onSoloAbiertosChange: (value: boolean | null) => void;
  onReset: () => void;
}

const stateOptions = ORDER_STATES.map((value) => ({
  value,
  label: ORDER_STATE_LABELS[value],
}));

const paymentStateOptions = ORDER_PAYMENT_STATES.map((value) => ({
  value,
  label: ORDER_PAYMENT_STATE_LABELS[value],
}));

const conditionOptions = ORDER_PAYMENT_CONDITIONS.map((value) => ({
  value,
  label: ORDER_PAYMENT_CONDITION_LABELS[value],
}));

const openOptions = [
  { value: "all", label: "Todos los pedidos" },
  { value: "open", label: "Sólo abiertos" },
];

export function OrderFilters({
  search,
  estado,
  estadoPago,
  condicionPago,
  clienteId,
  vendedorId,
  visitaId,
  fechaDesde,
  fechaHasta,
  soloAbiertos,
  onSearchChange,
  onSearchDebouncedChange,
  onEstadoChange,
  onEstadoPagoChange,
  onCondicionPagoChange,
  onClienteChange,
  onVendedorChange,
  onVisitaChange,
  onFechaDesdeChange,
  onFechaHastaChange,
  onSoloAbiertosChange,
  onReset,
}: OrderFiltersProps) {
  const hasFilters =
    Boolean(search) ||
    estado !== null ||
    estadoPago !== null ||
    condicionPago !== null ||
    clienteId !== null ||
    vendedorId !== null ||
    visitaId !== null ||
    Boolean(fechaDesde) ||
    Boolean(fechaHasta) ||
    soloAbiertos !== null;

  return (
    <div className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-4">
      <AppSearchInput
        value={search}
        onValueChange={onSearchChange}
        onDebouncedChange={onSearchDebouncedChange}
        placeholder="Buscar número, cliente, vendedor o producto..."
      />

      <AppSingleSelect<OrderState>
        value={estado}
        options={stateOptions}
        onChange={onEstadoChange}
        placeholder="Estado del pedido"
      />

      <AppSingleSelect<OrderPaymentState>
        value={estadoPago}
        options={paymentStateOptions}
        onChange={onEstadoPagoChange}
        placeholder="Estado de pago"
      />

      <AppSingleSelect<OrderPaymentCondition>
        value={condicionPago}
        options={conditionOptions}
        onChange={onCondicionPagoChange}
        placeholder="Condición de pago"
      />

      <OrderCustomerSelect
        value={clienteId}
        onChange={onClienteChange}
        placeholder="Cliente"
      />

      <OrderSellerSelect
        value={vendedorId}
        onChange={onVendedorChange}
        placeholder="Vendedor"
      />

      <OrderVisitSelect
        value={visitaId}
        clienteId={clienteId}
        vendedorId={vendedorId}
        onChange={onVisitaChange}
        placeholder={
          clienteId || vendedorId ? "Visita" : "Selecciona cliente o vendedor"
        }
        isDisabled={!clienteId && !vendedorId}
      />

      <AppSingleSelect
        value={soloAbiertos ? "open" : "all"}
        options={openOptions}
        isClearable={false}
        isSearchable={false}
        onChange={(value) =>
          onSoloAbiertosChange(value === "open" ? true : null)
        }
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

      <div className="md:col-span-2 flex justify-end">
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
