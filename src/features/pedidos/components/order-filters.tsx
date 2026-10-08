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
  { value: "open", label: "Solo abiertos" },
];

const labelClass =
  "mb-1.5 block text-xs font-medium text-[hsl(var(--app-muted-foreground))]";

export function OrderFilters(props: OrderFiltersProps) {
  const hasFilters =
    Boolean(props.search.trim()) ||
    [
      props.estado,
      props.estadoPago,
      props.condicionPago,
      props.clienteId,
      props.vendedorId,
      props.visitaId,
      props.soloAbiertos,
    ].some((value) => value !== null) ||
    Boolean(props.fechaDesde || props.fechaHasta);

  const visitEnabled = props.clienteId !== null || props.vendedorId !== null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold">Filtros de pedidos</h3>
          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
            Encuentra pedidos por cliente, vendedor, estado o fecha de creación.
          </p>
        </div>
        <AppButton
          type="button"
          variant="secondary"
          size="sm"
          leftIcon={<RotateCcw />}
          disabled={!hasFilters}
          onClick={props.onReset}
        >
          Limpiar filtros
        </AppButton>
      </div>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="min-w-0">
          <label className={labelClass} htmlFor="orders-search">Buscar pedido</label>
          <AppSearchInput
            id="orders-search"
            value={props.search}
            onValueChange={props.onSearchChange}
            onDebouncedChange={props.onSearchDebouncedChange}
            placeholder="Número, cliente, vendedor o producto"
          />
        </div>

        <div className="min-w-0">
          <label className={labelClass} htmlFor="orders-state">Estado del pedido</label>
          <AppSingleSelect<OrderState>
            inputId="orders-state"
            value={props.estado}
            options={stateOptions}
            onChange={props.onEstadoChange}
            placeholder="Todos los estados"
          />
        </div>

        <div className="min-w-0">
          <label className={labelClass} htmlFor="orders-customer">Cliente</label>
          <OrderCustomerSelect
            inputId="orders-customer"
            value={props.clienteId}
            onChange={props.onClienteChange}
            placeholder="Todos los clientes"
          />
        </div>

        <div className="min-w-0">
          <label className={labelClass} htmlFor="orders-seller">Vendedor</label>
          <OrderSellerSelect
            inputId="orders-seller"
            value={props.vendedorId}
            onChange={props.onVendedorChange}
            placeholder="Todos los vendedores"
          />
        </div>
      </div>

      <fieldset className="min-w-0 rounded-md border border-[hsl(var(--app-border))] p-3">
        <legend className="px-1 text-xs font-semibold">Pago y seguimiento</legend>
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="min-w-0">
            <label className={labelClass} htmlFor="orders-payment-state">Estado de pago</label>
            <AppSingleSelect<OrderPaymentState>
              inputId="orders-payment-state"
              value={props.estadoPago}
              options={paymentStateOptions}
              onChange={props.onEstadoPagoChange}
              placeholder="Todos los estados de pago"
            />
          </div>

          <div className="min-w-0">
            <label className={labelClass} htmlFor="orders-payment-condition">Condición de pago</label>
            <AppSingleSelect<OrderPaymentCondition>
              inputId="orders-payment-condition"
              value={props.condicionPago}
              options={conditionOptions}
              onChange={props.onCondicionPagoChange}
              placeholder="Todas las condiciones"
            />
          </div>

          <div className="min-w-0">
            <label className={labelClass} htmlFor="orders-visit">Visita vinculada</label>
            <OrderVisitSelect
              inputId="orders-visit"
              value={props.visitaId}
              clienteId={props.clienteId}
              vendedorId={props.vendedorId}
              onChange={props.onVisitaChange}
              placeholder={visitEnabled ? "Todas las visitas" : "Selecciona cliente o vendedor"}
              isDisabled={!visitEnabled}
            />
          </div>

          <div className="min-w-0">
            <label className={labelClass} htmlFor="orders-only-open">Tipo de pedidos</label>
            <AppSingleSelect
              inputId="orders-only-open"
              value={props.soloAbiertos ? "open" : "all"}
              options={openOptions}
              isClearable={false}
              isSearchable={false}
              onChange={(value) =>
                props.onSoloAbiertosChange(value === "open" ? true : null)
              }
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-[hsl(var(--app-muted-foreground))]">
          Al elegir un nuevo cliente o vendedor, se restablece la visita vinculada.
          El filtro «Solo abiertos» reemplaza cualquier estado de pedido específico.
        </p>
      </fieldset>

      <fieldset className="min-w-0 rounded-md border border-[hsl(var(--app-border))] p-3">
        <legend className="px-1 text-xs font-semibold">Fecha de creación del pedido</legend>
        <p className="mb-2 text-xs text-[hsl(var(--app-muted-foreground))]">
          Filtra por el día en que se registró el pedido, no por su fecha de entrega o pago.
        </p>
        <div className="grid min-w-0 max-w-2xl gap-3 sm:grid-cols-2">
          <div className="min-w-0">
            <label className={labelClass} htmlFor="orders-created-from">Desde</label>
            <AppDatePicker
              id="orders-created-from"
              value={props.fechaDesde}
              outputFormat="iso"
              boundary="startOfDay"
              aria-label="Fecha de creación del pedido desde"
              maxDate={props.fechaHasta || undefined}
              onChange={(value) => props.onFechaDesdeChange(value ?? "")}
            />
          </div>
          <div className="min-w-0">
            <label className={labelClass} htmlFor="orders-created-to">Hasta</label>
            <AppDatePicker
              id="orders-created-to"
              value={props.fechaHasta}
              outputFormat="iso"
              boundary="endOfDay"
              aria-label="Fecha de creación del pedido hasta"
              minDate={props.fechaDesde || undefined}
              onChange={(value) => props.onFechaHastaChange(value ?? "")}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
}
