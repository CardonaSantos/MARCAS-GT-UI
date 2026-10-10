import type { FieldValues } from "react-hook-form";

import { useStore } from "@/Context/ContextSucursal";
import {
  useCustomerSelectables,
  useUserSelectables,
} from "@/features/common/catalogs/catalog.queries";
import {
  AppFormSingleSelect,
  type AppFormSingleSelectProps,
} from "@/ui/components/app/form/app-form-single-select";
import {
  AppSingleSelect,
  type AppSingleSelectProps,
} from "@/ui/components/app/primitives/app-single-select";

import { useCreditPolicies } from "../api/credit.queries";

type RawSelectProps = Omit<
  AppSingleSelectProps<number>,
  "options" | "isLoading"
>;

type FormSelectProps<TFieldValues extends FieldValues> = Omit<
  AppFormSingleSelectProps<TFieldValues, number>,
  "options" | "isLoading"
>;

function useCompanyUsers() {
  const query = useUserSelectables();
  const empresaId = useStore((state) => state.empresaId);

  const users = (query.data ?? []).filter(
    (user) => !empresaId || user.empresaId === empresaId,
  );

  return { query, users };
}

export function CreditCustomerSelect(props: RawSelectProps) {
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

export function CreditSellerSelect(props: RawSelectProps) {
  const { query, users } = useCompanyUsers();
  const sellers = users.filter((user) =>
    ["ADMIN", "VENDEDOR"].includes(user.rol),
  );

  return (
    <AppSingleSelect<number>
      {...props}
      options={sellers.map((user) => ({
        value: user.id,
        label: user.nombre,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay vendedores disponibles"
    />
  );
}

export function CreditRequesterSelect(props: RawSelectProps) {
  const { query, users } = useCompanyUsers();
  const requesters = users.filter((user) =>
    ["ADMIN", "VENDEDOR"].includes(user.rol),
  );

  return (
    <AppSingleSelect<number>
      {...props}
      options={requesters.map((user) => ({
        value: user.id,
        label: user.nombre,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay solicitantes disponibles"
    />
  );
}

export function CreditUserSelect(props: RawSelectProps) {
  const { query, users } = useCompanyUsers();

  return (
    <AppSingleSelect<number>
      {...props}
      options={users.map((user) => ({
        value: user.id,
        label: user.nombre,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay usuarios disponibles"
    />
  );
}

export function CreditPolicySelect({
  activeOnly = false,
  ...props
}: RawSelectProps & { activeOnly?: boolean }) {
  const query = useCreditPolicies({
    page: 1,
    limit: 100,
    activo: activeOnly ? true : undefined,
  });

  return (
    <AppSingleSelect<number>
      {...props}
      options={(query.data?.data ?? []).map((policy) => ({
        value: policy.id,
        label: policy.nombre,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay políticas disponibles"
    />
  );
}

export function CreditPolicyFormSelect<
  TFieldValues extends FieldValues,
>({
  activeOnly = false,
  ...props
}: FormSelectProps<TFieldValues> & { activeOnly?: boolean }) {
  const query = useCreditPolicies({
    page: 1,
    limit: 100,
    activo: activeOnly ? true : undefined,
  });

  const compatiblePolicies = (query.data?.data ?? []).filter(
    (policy) => Number(policy.porcentajeAnticipo ?? 0) === 0,
  );

  return (
    <AppFormSingleSelect<TFieldValues, number>
      {...props}
      options={compatiblePolicies.map((policy) => ({
        value: policy.id,
        label: policy.nombre,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay políticas disponibles"
    />
  );
}
