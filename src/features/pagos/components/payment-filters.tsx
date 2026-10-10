import { RotateCcw } from "lucide-react";

import { useCustomerSelectables } from "@/features/common/catalogs/catalog.queries";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import type {
  PaymentMethod,
  PaymentState,
} from "../api/payment.types";
import { usePaymentBanks } from "../api/payment.queries";
import {
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATES,
  PAYMENT_STATE_LABELS,
} from "../common/payment.constants";

interface Props {
  search: string;
  estado: PaymentState | null;
  metodo: PaymentMethod | null;
  clienteId: number | null;
  bancoId: number | null;
  soloConSaldoDisponible: boolean | null;
  fechaDesde: string;
  fechaHasta: string;
  onSearchChange: (value: string) => void;
  onSearchDebouncedChange: (value: string) => void;
  onEstadoChange: (value: PaymentState | null) => void;
  onMetodoChange: (value: PaymentMethod | null) => void;
  onClienteChange: (value: number | null) => void;
  onBancoChange: (value: number | null) => void;
  onSaldoDisponibleChange: (value: boolean | null) => void;
  onFechaDesdeChange: (value: string) => void;
  onFechaHastaChange: (value: string) => void;
  onReset: () => void;
}

const labelClass =
  "mb-1.5 block text-xs font-medium text-[hsl(var(--app-muted-foreground))]";

export function PaymentFilters(props: Props) {
  const customers = useCustomerSelectables();
  const banks = usePaymentBanks();

  const activeCount = [
    props.search.trim(),
    props.estado,
    props.metodo,
    props.clienteId,
    props.bancoId,
    props.soloConSaldoDisponible === true ? "saldo" : null,
    props.fechaDesde,
    props.fechaHasta,
  ].filter((value) => value !== null && value !== "").length;

  return (
    <section
      aria-label="Filtros de pagos"
      className="flex w-full min-w-0 flex-col gap-3"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold">Filtros de pagos</h3>
          <p className="mt-0.5 text-xs text-[hsl(var(--app-muted-foreground))]">
            Busca cobros por cliente, pedido o referencia y acota los resultados.
            {activeCount > 0 ? ` ${activeCount} filtro${activeCount === 1 ? "" : "s"} activo${activeCount === 1 ? "" : "s"}.` : ""}
          </p>
        </div>
        <AppButton
          type="button"
          variant="secondary"
          size="sm"
          leftIcon={<RotateCcw />}
          disabled={activeCount === 0}
          onClick={props.onReset}
        >
          Limpiar filtros
        </AppButton>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="min-w-0">
          <label htmlFor="payment-filter-search" className={labelClass}>
            Buscar pago
          </label>
          <AppSearchInput
            id="payment-filter-search"
            value={props.search}
            onValueChange={props.onSearchChange}
            onDebouncedChange={props.onSearchDebouncedChange}
            placeholder="Cliente, pedido o referencia"
            aria-label="Buscar pagos"
          />
        </div>

        <div className="min-w-0">
          <label htmlFor="payment-filter-state" className={labelClass}>
            Estado del pago
          </label>
          <AppSingleSelect<PaymentState>
            inputId="payment-filter-state"
            value={props.estado}
            options={PAYMENT_STATES.map((value) => ({
              value,
              label: PAYMENT_STATE_LABELS[value],
            }))}
            onChange={props.onEstadoChange}
            placeholder="Todos los estados"
          />
        </div>

        <div className="min-w-0">
          <label htmlFor="payment-filter-method" className={labelClass}>
            Método de pago
          </label>
          <AppSingleSelect<PaymentMethod>
            inputId="payment-filter-method"
            value={props.metodo}
            options={PAYMENT_METHODS.map((value) => ({
              value,
              label: PAYMENT_METHOD_LABELS[value],
            }))}
            onChange={props.onMetodoChange}
            placeholder="Todos los métodos"
          />
        </div>

        <div className="min-w-0">
          <label htmlFor="payment-filter-customer" className={labelClass}>
            Cliente
          </label>
          <AppSingleSelect<number>
            inputId="payment-filter-customer"
            value={props.clienteId}
            options={(customers.data ?? []).map((customer) => ({
              value: customer.id,
              label: customer.nombreCompleto,
            }))}
            onChange={props.onClienteChange}
            isLoading={customers.isLoading}
            placeholder="Todos los clientes"
          />
        </div>

        <div className="min-w-0">
          <label htmlFor="payment-filter-bank" className={labelClass}>
            Banco
          </label>
          <AppSingleSelect<number>
            inputId="payment-filter-bank"
            value={props.bancoId}
            options={(banks.data ?? []).map((bank) => ({
              value: bank.id,
              label: bank.codigo
                ? bank.nombre + " · " + bank.codigo
                : bank.nombre,
            }))}
            onChange={props.onBancoChange}
            isLoading={banks.isLoading}
            placeholder="Todos los bancos"
          />
        </div>

        <div className="min-w-0">
          <label htmlFor="payment-filter-balance" className={labelClass}>
            Saldo para cartera
          </label>
          <AppSingleSelect<string>
            inputId="payment-filter-balance"
            value={props.soloConSaldoDisponible ? "yes" : "all"}
            options={[
              { value: "all", label: "Todos los pagos" },
              { value: "yes", label: "Solo libre para aplicar a CxC" },
            ]}
            onChange={(value) =>
              props.onSaldoDisponibleChange(value === "yes" ? true : null)
            }
            isClearable={false}
            isSearchable={false}
          />
        </div>

        <fieldset className="min-w-0 rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border))] px-3 pb-3 pt-1 sm:col-span-2">
          <legend className="px-1 text-xs font-semibold">
            Fecha del pago
          </legend>
          <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="min-w-0">
              <label htmlFor="payment-filter-date-from" className={labelClass}>
                Desde
              </label>
              <AppDatePicker
                id="payment-filter-date-from"
                value={props.fechaDesde}
                outputFormat="iso"
                boundary="startOfDay"
                maxDate={props.fechaHasta || undefined}
                aria-label="Fecha de pago desde"
                onChange={(value) => props.onFechaDesdeChange(value ?? "")}
              />
            </div>
            <div className="min-w-0">
              <label htmlFor="payment-filter-date-to" className={labelClass}>
                Hasta
              </label>
              <AppDatePicker
                id="payment-filter-date-to"
                value={props.fechaHasta}
                outputFormat="iso"
                boundary="endOfDay"
                minDate={props.fechaDesde || undefined}
                aria-label="Fecha de pago hasta"
                onChange={(value) => props.onFechaHastaChange(value ?? "")}
              />
            </div>
          </div>
        </fieldset>
      </div>
    </section>
  );
}
