import { useStore } from "@/Context/ContextSucursal";
import {
  useCustomerSelectables,
  useUserSelectables,
} from "@/features/common/catalogs/catalog.queries";
import {
  AppSingleSelect,
  type AppSingleSelectProps,
} from "@/ui/components/app/primitives/app-single-select";

type SelectProps = Omit<
  AppSingleSelectProps<number>,
  "options" | "isLoading"
>;

export function DeliveryCustomerSelect(props: SelectProps) {
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

export function DeliveryUserSelect(props: SelectProps) {
  const query = useUserSelectables();
  const empresaId = useStore((state) => state.empresaId);
  const users = (query.data ?? []).filter(
    (user) => !empresaId || user.empresaId === empresaId,
  );

  return (
    <AppSingleSelect<number>
      {...props}
      options={users.map((user) => ({
        value: user.id,
        label: user.nombre + " · " + user.rol,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay usuarios disponibles"
    />
  );
}
