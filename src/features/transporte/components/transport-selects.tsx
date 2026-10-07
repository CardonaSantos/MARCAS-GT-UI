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

import type { ShipmentMode } from "../api/transport.types";
import {
  useTransportCarriers,
  useTransportDrivers,
  useTransportVehicles,
} from "../api/transport.queries";

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

export function TransportBodegaSelect(props: RawSelectProps) {
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

export function TransportBodegaFormSelect<
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

export function TransportCustomerSelect(props: RawSelectProps) {
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

export function TransportCarrierSelect({
  mode,
  activeOnly = false,
  ...props
}: RawSelectProps & { mode?: ShipmentMode; activeOnly?: boolean }) {
  const query = useTransportCarriers(mode ? { tipo: mode } : {});
  const data = (query.data ?? []).filter(
    (item) => !activeOnly || item.activo,
  );
  return (
    <AppSingleSelect<number>
      {...props}
      options={data.map((carrier) => ({
        value: carrier.id,
        label:
          (carrier.codigo ? carrier.codigo + " · " : "") + carrier.nombre,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay transportistas disponibles"
    />
  );
}

export function TransportCarrierFormSelect<
  TFieldValues extends FieldValues,
>({
  mode,
  activeOnly = false,
  ...props
}: FormSelectProps<TFieldValues> & {
  mode?: ShipmentMode;
  activeOnly?: boolean;
}) {
  const query = useTransportCarriers(mode ? { tipo: mode } : {});
  const data = (query.data ?? []).filter(
    (item) => !activeOnly || item.activo,
  );
  return (
    <AppFormSingleSelect<TFieldValues, number>
      {...props}
      options={data.map((carrier) => ({
        value: carrier.id,
        label:
          (carrier.codigo ? carrier.codigo + " · " : "") + carrier.nombre,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay transportistas disponibles"
    />
  );
}

export function TransportVehicleSelect({
  availableOnly = false,
  ...props
}: RawSelectProps & { availableOnly?: boolean }) {
  const query = useTransportVehicles();
  const data = (query.data ?? []).filter(
    (item) =>
      (!availableOnly || item.estado === "DISPONIBLE") &&
      (!availableOnly || item.activo),
  );
  return (
    <AppSingleSelect<number>
      {...props}
      options={data.map((vehicle) => ({
        value: vehicle.id,
        label:
          vehicle.placa +
          (vehicle.marca ? " · " + vehicle.marca : "") +
          (vehicle.modelo ? " " + vehicle.modelo : ""),
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay vehículos disponibles"
    />
  );
}

export function TransportVehicleFormSelect<
  TFieldValues extends FieldValues,
>({
  availableOnly = false,
  ...props
}: FormSelectProps<TFieldValues> & { availableOnly?: boolean }) {
  const query = useTransportVehicles();
  const data = (query.data ?? []).filter(
    (item) =>
      (!availableOnly || item.estado === "DISPONIBLE") &&
      (!availableOnly || item.activo),
  );
  return (
    <AppFormSingleSelect<TFieldValues, number>
      {...props}
      options={data.map((vehicle) => ({
        value: vehicle.id,
        label:
          vehicle.placa +
          (vehicle.marca ? " · " + vehicle.marca : "") +
          (vehicle.modelo ? " " + vehicle.modelo : ""),
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay vehículos disponibles"
    />
  );
}

export function TransportDriverSelect({
  availableOnly = false,
  ...props
}: RawSelectProps & { availableOnly?: boolean }) {
  const query = useTransportDrivers();
  const data = (query.data ?? []).filter(
    (item) =>
      (!availableOnly || item.estado === "DISPONIBLE") &&
      (!availableOnly || item.activo),
  );
  return (
    <AppSingleSelect<number>
      {...props}
      options={data.map((driver) => ({
        value: driver.id,
        label:
          driver.nombre +
          (driver.licencia ? " · Lic. " + driver.licencia : ""),
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay conductores disponibles"
    />
  );
}

export function TransportDriverFormSelect<
  TFieldValues extends FieldValues,
>({
  availableOnly = false,
  ...props
}: FormSelectProps<TFieldValues> & { availableOnly?: boolean }) {
  const query = useTransportDrivers();
  const data = (query.data ?? []).filter(
    (item) =>
      (!availableOnly || item.estado === "DISPONIBLE") &&
      (!availableOnly || item.activo),
  );
  return (
    <AppFormSingleSelect<TFieldValues, number>
      {...props}
      options={data.map((driver) => ({
        value: driver.id,
        label:
          driver.nombre +
          (driver.licencia ? " · Lic. " + driver.licencia : ""),
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay conductores disponibles"
    />
  );
}

export function TransportResponsibleSelect(props: RawSelectProps) {
  const { query, users } = useCompanyUsers();
  const responsible = users.filter((user) =>
    ["ADMIN", "REPARTIDOR"].includes(user.rol),
  );
  return (
    <AppSingleSelect<number>
      {...props}
      options={responsible.map((user) => ({
        value: user.id,
        label: user.nombre + " · " + user.rol,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay responsables disponibles"
    />
  );
}

export function TransportResponsibleFormSelect<
  TFieldValues extends FieldValues,
>(props: FormSelectProps<TFieldValues>) {
  const { query, users } = useCompanyUsers();
  const responsible = users.filter((user) =>
    ["ADMIN", "REPARTIDOR"].includes(user.rol),
  );
  return (
    <AppFormSingleSelect<TFieldValues, number>
      {...props}
      options={responsible.map((user) => ({
        value: user.id,
        label: user.nombre + " · " + user.rol,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay responsables disponibles"
    />
  );
}
