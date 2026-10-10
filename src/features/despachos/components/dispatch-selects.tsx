import type { FieldValues } from "react-hook-form";

import { useStore } from "@/Context/ContextSucursal";
import { useBodegaSelectables } from "@/features/bodegas/api/bodega.queries";
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

  return {
    query,
    users: (query.data ?? []).filter(
      (user) => !empresaId || user.empresaId === empresaId,
    ),
  };
}

export function DispatchBodegaSelect(props: RawSelectProps) {
  const query = useBodegaSelectables({ limit: 100 });

  return (
    <AppSingleSelect<number>
      {...props}
      options={(query.data ?? []).map((bodega) => ({
        value: bodega.id,
        label: bodega.codigo + " · " + bodega.nombre,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay bodegas operativas"
    />
  );
}

export function DispatchBodegaFormSelect<
  TFieldValues extends FieldValues,
>(props: FormSelectProps<TFieldValues>) {
  const query = useBodegaSelectables({ limit: 100 });

  return (
    <AppFormSingleSelect<TFieldValues, number>
      {...props}
      options={(query.data ?? []).map((bodega) => ({
        value: bodega.id,
        label: bodega.codigo + " · " + bodega.nombre,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay bodegas operativas"
    />
  );
}

export function DispatchCustomerSelect(props: RawSelectProps) {
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

export function DispatchSellerSelect(props: RawSelectProps) {
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

export function DispatchUserSelect(props: RawSelectProps) {
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
