import type { FieldValues } from "react-hook-form";

import { useStore } from "@/Context/ContextSucursal";

import {
  useCustomerSelectables,
  useProductSelectables,
  useUserSelectables,
  useVisitSelectables,
} from "@/features/common/catalogs/catalog.queries";
import { formatDateTime, formatMoney } from "@/features/common/formatters/value.formatters";
import {
  AppFormSingleSelect,
  type AppFormSingleSelectProps,
} from "@/ui/components/app/form/app-form-single-select";
import {
  AppSingleSelect,
  type AppSingleSelectProps,
} from "@/ui/components/app/primitives/app-single-select";

type RawSelectProps = Omit<
  AppSingleSelectProps<number>,
  "options" | "isLoading"
>;

type FormSelectProps<TFieldValues extends FieldValues> = Omit<
  AppFormSingleSelectProps<TFieldValues, number>,
  "options" | "isLoading"
>;

export function OrderCustomerSelect(props: RawSelectProps) {
  const query = useCustomerSelectables();

  return (
    <AppSingleSelect<number>
      {...props}
      options={(query.data ?? []).map((customer) => ({
        value: customer.id,
        label: customer.nombreCompleto,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay clientes disponibles"
    />
  );
}

export function OrderCustomerFormSelect<
  TFieldValues extends FieldValues,
>(props: FormSelectProps<TFieldValues>) {
  const query = useCustomerSelectables();

  return (
    <AppFormSingleSelect<TFieldValues, number>
      {...props}
      options={(query.data ?? []).map((customer) => ({
        value: customer.id,
        label: customer.nombreCompleto,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay clientes disponibles"
    />
  );
}

function useSellerOptions() {
  const query = useUserSelectables();
  const empresaId = useStore((state) => state.empresaId);
  const sellers = (query.data ?? []).filter(
    (user) =>
      ["ADMIN", "VENDEDOR"].includes(user.rol) &&
      (!empresaId || user.empresaId === empresaId),
  );

  return { query, sellers };
}

export function OrderSellerSelect(props: RawSelectProps) {
  const { query, sellers } = useSellerOptions();

  return (
    <AppSingleSelect<number>
      {...props}
      options={sellers.map((seller) => ({
        value: seller.id,
        label: seller.nombre,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay vendedores disponibles"
    />
  );
}

export function OrderSellerFormSelect<
  TFieldValues extends FieldValues,
>(props: FormSelectProps<TFieldValues>) {
  const { query, sellers } = useSellerOptions();

  return (
    <AppFormSingleSelect<TFieldValues, number>
      {...props}
      options={sellers.map((seller) => ({
        value: seller.id,
        label: seller.nombre,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay vendedores disponibles"
    />
  );
}

export function OrderVisitSelect({
  clienteId,
  vendedorId,
  ...props
}: RawSelectProps & {
  clienteId?: number | null;
  vendedorId?: number | null;
}) {
  const query = useVisitSelectables(
    { clienteId, vendedorId },
    Boolean(clienteId || vendedorId),
  );

  return (
    <AppSingleSelect<number>
      {...props}
      options={(query.data ?? []).map((visit) => ({
        value: visit.id,
        label: `#${visit.id} · ${formatDateTime(visit.inicio)} · ${visit.estado}`,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay visitas compatibles"
    />
  );
}

export function OrderVisitFormSelect<
  TFieldValues extends FieldValues,
>({
  clienteId,
  vendedorId,
  ...props
}: FormSelectProps<TFieldValues> & {
  clienteId?: number | null;
  vendedorId?: number | null;
}) {
  const query = useVisitSelectables(
    { clienteId, vendedorId },
    Boolean(clienteId && vendedorId),
  );

  return (
    <AppFormSingleSelect<TFieldValues, number>
      {...props}
      options={(query.data ?? []).map((visit) => ({
        value: visit.id,
        label: `#${visit.id} · ${formatDateTime(visit.inicio)} · ${visit.estado}`,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay visitas compatibles"
    />
  );
}

export function useOrderProductOptions() {
  const query = useProductSelectables();

  return {
    ...query,
    options: (query.data ?? []).map((product) => ({
      value: product.id,
      label: `${product.codigo} · ${product.nombre} · ${formatMoney(product.precio)}`,
    })),
  };
}
