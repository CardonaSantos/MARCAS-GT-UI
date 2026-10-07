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

export function PaymentFilters(props: Props) {
  const customers = useCustomerSelectables();
  const banks = usePaymentBanks();

  return (
    <div className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-4">
      <AppSearchInput
        value={props.search}
        onValueChange={props.onSearchChange}
        onDebouncedChange={props.onSearchDebouncedChange}
        placeholder="Buscar cliente, pedido o referencia..."
      />
      <AppSingleSelect<PaymentState>
        value={props.estado}
        options={PAYMENT_STATES.map((value) => ({
          value,
          label: PAYMENT_STATE_LABELS[value],
        }))}
        onChange={props.onEstadoChange}
        placeholder="Estado"
      />
      <AppSingleSelect<PaymentMethod>
        value={props.metodo}
        options={PAYMENT_METHODS.map((value) => ({
          value,
          label: PAYMENT_METHOD_LABELS[value],
        }))}
        onChange={props.onMetodoChange}
        placeholder="Método"
      />
      <AppSingleSelect<number>
        value={props.clienteId}
        options={(customers.data ?? []).map((customer) => ({
          value: customer.id,
          label: customer.nombreCompleto,
        }))}
        onChange={props.onClienteChange}
        isLoading={customers.isLoading}
        placeholder="Cliente"
      />
      <AppSingleSelect<number>
        value={props.bancoId}
        options={(banks.data ?? []).map((bank) => ({
          value: bank.id,
          label: bank.codigo
            ? bank.nombre + " · " + bank.codigo
            : bank.nombre,
        }))}
        onChange={props.onBancoChange}
        isLoading={banks.isLoading}
        placeholder="Banco"
      />
      <AppSingleSelect
        value={props.soloConSaldoDisponible ? "yes" : "all"}
        options={[
          { value: "all", label: "Todos los pagos" },
          { value: "yes", label: "Con saldo disponible" },
        ]}
        onChange={(value) =>
          props.onSaldoDisponibleChange(value === "yes" ? true : null)
        }
        isClearable={false}
        isSearchable={false}
      />
      <AppDatePicker
        value={props.fechaDesde}
        outputFormat="iso"
        boundary="startOfDay"
        aria-label="Pago desde"
        onChange={(value) => props.onFechaDesdeChange(value ?? "")}
      />
      <AppDatePicker
        value={props.fechaHasta}
        outputFormat="iso"
        boundary="endOfDay"
        aria-label="Pago hasta"
        onChange={(value) => props.onFechaHastaChange(value ?? "")}
      />
      <div className="flex justify-end xl:col-start-4">
        <AppButton
          variant="secondary"
          size="sm"
          leftIcon={<RotateCcw />}
          onClick={props.onReset}
        >
          Limpiar filtros
        </AppButton>
      </div>
    </div>
  );
}
