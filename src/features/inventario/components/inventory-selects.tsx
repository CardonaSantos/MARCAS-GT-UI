import type { FieldValues } from "react-hook-form";

import { useBodegaSelectables } from "@/features/bodegas/api/bodega.queries";
import {
  useProductSelectables,
  useProviderSelectables,
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

export function InventoryBodegaSelect(props: RawSelectProps) {
  const query = useBodegaSelectables({ limit: 100 });

  return (
    <AppSingleSelect<number>
      {...props}
      options={(query.data ?? []).map((bodega) => ({
        value: bodega.id,
        label: `${bodega.codigo} · ${bodega.nombre}`,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay bodegas disponibles"
    />
  );
}

export function InventoryBodegaFormSelect<
  TFieldValues extends FieldValues,
>(props: FormSelectProps<TFieldValues>) {
  const query = useBodegaSelectables({ limit: 100 });

  return (
    <AppFormSingleSelect<TFieldValues, number>
      {...props}
      options={(query.data ?? []).map((bodega) => ({
        value: bodega.id,
        label: `${bodega.codigo} · ${bodega.nombre}`,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay bodegas disponibles"
    />
  );
}

export function InventoryProductSelect(props: RawSelectProps) {
  const query = useProductSelectables();

  return (
    <AppSingleSelect<number>
      {...props}
      options={(query.data ?? []).map((product) => ({
        value: product.id,
        label: `${product.codigo} · ${product.nombre}`,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay productos disponibles"
    />
  );
}

export function InventoryProductFormSelect<
  TFieldValues extends FieldValues,
>(props: FormSelectProps<TFieldValues>) {
  const query = useProductSelectables();

  return (
    <AppFormSingleSelect<TFieldValues, number>
      {...props}
      options={(query.data ?? []).map((product) => ({
        value: product.id,
        label: `${product.codigo} · ${product.nombre}`,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay productos disponibles"
    />
  );
}

export function InventoryProviderFormSelect<
  TFieldValues extends FieldValues,
>(props: FormSelectProps<TFieldValues>) {
  const query = useProviderSelectables();

  return (
    <AppFormSingleSelect<TFieldValues, number>
      {...props}
      options={(query.data ?? []).map((provider) => ({
        value: provider.id,
        label: provider.nombre,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay proveedores disponibles"
    />
  );
}

export function InventoryUserSelect(props: RawSelectProps) {
  const query = useUserSelectables();

  return (
    <AppSingleSelect<number>
      {...props}
      options={(query.data ?? []).map((user) => ({
        value: user.id,
        label: user.nombre,
      }))}
      isLoading={query.isLoading}
      noOptionsText="No hay usuarios disponibles"
    />
  );
}
