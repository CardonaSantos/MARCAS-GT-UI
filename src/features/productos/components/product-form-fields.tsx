import {
  AppFormInput, AppFormMultiSelect, AppFormTextarea,
} from "@/ui/components/app/form";
import { AppGrid, AppGridItem } from "@/ui/components/app/primitives/app-grid";

import { useProductCategories } from "../api/product.queries";
import type { CreateProductFormValues } from "../schemas/product.schemas";

export function ProductFormFields() {
  const categories = useProductCategories();

  return (
    <AppGrid cols={{ base: 1, md: 2 }} gap="md">
      <AppFormInput<CreateProductFormValues>
        name="nombre" label="Nombre del producto" required
        placeholder="Nombre comercial" maxLength={200}
      />
      <AppFormInput<CreateProductFormValues>
        name="codigoProducto" label="Código único" required
        placeholder="Ej. SKU-001" maxLength={120} autoComplete="off"
      />
      <AppGridItem span="full">
        <AppFormTextarea<CreateProductFormValues>
          name="descripcion" label="Descripción" rows={3}
          maxLength={1500} placeholder="Características del producto (opcional)"
        />
      </AppGridItem>
      <AppGridItem span="full">
        <AppFormMultiSelect<CreateProductFormValues, number>
          name="categoriaIds" label="Categorías" required
          options={(categories.data ?? []).map((item) => ({
            value: item.id, label: item.nombre,
          }))}
          isLoading={categories.isLoading}
          placeholder="Seleccionar categorías"
          noOptionsText="No hay categorías registradas"
        />
        {categories.isError ? (
          <p role="alert" className="mt-1 text-xs text-red-500">
            No se pudieron cargar las categorías. Actualiza la página.
          </p>
        ) : null}
      </AppGridItem>
      <AppFormInput<CreateProductFormValues>
        name="precio" label="Precio de venta (Q)" required
        inputMode="decimal" placeholder="0.00" autoComplete="off"
      />
      <AppFormInput<CreateProductFormValues>
        name="precioCosto" label="Costo de referencia (Q)" required
        inputMode="decimal" placeholder="0.00" autoComplete="off"
      />
    </AppGrid>
  );
}
