import { RotateCcw } from "lucide-react";

import {
  useCustomerSelectables,
  useUserSelectables,
} from "@/features/common/catalogs/catalog.queries";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import type {
  FiscalDocumentState,
  InvoiceState,
  PaymentCondition,
} from "../api/billing.types";
import {
  FISCAL_STATES,
  FISCAL_STATE_LABELS,
  INVOICE_STATES,
  INVOICE_STATE_LABELS,
  PAYMENT_CONDITIONS,
  PAYMENT_CONDITION_LABELS,
} from "../common/billing.constants";

interface Props {
  search: string;
  estado: InvoiceState | null;
  estadoFiscal: FiscalDocumentState | null;
  clienteId: number | null;
  vendedorId: number | null;
  condicionPago: PaymentCondition | null;
  soloPendientesFel: boolean | null;
  soloErroresFel: boolean | null;
  soloInciertas: boolean | null;
  fechaDesde: string;
  fechaHasta: string;
  showSellerFilter: boolean;
  onSearchChange: (value: string) => void;
  onSearchDebouncedChange: (value: string) => void;
  onEstadoChange: (value: InvoiceState | null) => void;
  onEstadoFiscalChange: (value: FiscalDocumentState | null) => void;
  onClienteChange: (value: number | null) => void;
  onVendedorChange: (value: number | null) => void;
  onCondicionPagoChange: (value: PaymentCondition | null) => void;
  onSoloPendientesFelChange: (value: boolean | null) => void;
  onSoloErroresFelChange: (value: boolean | null) => void;
  onSoloInciertasChange: (value: boolean | null) => void;
  onFechaDesdeChange: (value: string) => void;
  onFechaHastaChange: (value: string) => void;
  onReset: () => void;
}

const boolOptions = [
  { value: "all", label: "Todos" },
  { value: "yes", label: "Sí" },
];

export function InvoiceFilters(props: Props) {
  const customers = useCustomerSelectables();
  const users = useUserSelectables();

  return (
    <div className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-4">
      <AppSearchInput
        value={props.search}
        onValueChange={props.onSearchChange}
        onDebouncedChange={props.onSearchDebouncedChange}
        placeholder="Buscar factura, cliente, pedido o UUID..."
      />
      <AppSingleSelect<InvoiceState>
        value={props.estado}
        options={INVOICE_STATES.map((value) => ({
          value,
          label: INVOICE_STATE_LABELS[value],
        }))}
        onChange={props.onEstadoChange}
        placeholder="Estado factura"
      />
      <AppSingleSelect<FiscalDocumentState>
        value={props.estadoFiscal}
        options={FISCAL_STATES.map((value) => ({
          value,
          label: FISCAL_STATE_LABELS[value],
        }))}
        onChange={props.onEstadoFiscalChange}
        placeholder="Estado fiscal"
      />
      <AppSingleSelect<PaymentCondition>
        value={props.condicionPago}
        options={PAYMENT_CONDITIONS.map((value) => ({
          value,
          label: PAYMENT_CONDITION_LABELS[value],
        }))}
        onChange={props.onCondicionPagoChange}
        placeholder="Condición de pago"
      />
      <AppSingleSelect<number>
        value={props.clienteId}
        options={(customers.data ?? []).map((customer) => ({
          value: customer.id,
          label: customer.nombreCompleto,
        }))}
        onChange={props.onClienteChange}
        placeholder="Cliente"
        isLoading={customers.isLoading}
      />
      {props.showSellerFilter ? (
        <AppSingleSelect<number>
          value={props.vendedorId}
          options={(users.data ?? [])
            .filter((user) => user.rol === "VENDEDOR")
            .map((user) => ({
              value: user.id,
              label: user.nombre,
            }))}
          onChange={props.onVendedorChange}
          placeholder="Vendedor"
          isLoading={users.isLoading}
        />
      ) : null}
      <AppSingleSelect
        value={props.soloPendientesFel ? "yes" : "all"}
        options={boolOptions}
        isClearable={false}
        isSearchable={false}
        onChange={(value) =>
          props.onSoloPendientesFelChange(value === "yes" ? true : null)
        }
        placeholder="Pendientes FEL"
      />
      <AppSingleSelect
        value={props.soloErroresFel ? "yes" : "all"}
        options={boolOptions}
        isClearable={false}
        isSearchable={false}
        onChange={(value) =>
          props.onSoloErroresFelChange(value === "yes" ? true : null)
        }
        placeholder="Errores FEL"
      />
      <AppSingleSelect
        value={props.soloInciertas ? "yes" : "all"}
        options={boolOptions}
        isClearable={false}
        isSearchable={false}
        onChange={(value) =>
          props.onSoloInciertasChange(value === "yes" ? true : null)
        }
        placeholder="Certificación incierta"
      />
      <AppDatePicker
        value={props.fechaDesde}
        outputFormat="iso"
        boundary="startOfDay"
        aria-label="Desde"
        onChange={(value) => props.onFechaDesdeChange(value ?? "")}
      />
      <AppDatePicker
        value={props.fechaHasta}
        outputFormat="iso"
        boundary="endOfDay"
        aria-label="Hasta"
        onChange={(value) => props.onFechaHastaChange(value ?? "")}
      />
      <div className="flex justify-end">
        <AppButton
          variant="secondary"
          size="sm"
          leftIcon={<RotateCcw />}
          onClick={props.onReset}
        >
          Limpiar
        </AppButton>
      </div>
    </div>
  );
}
