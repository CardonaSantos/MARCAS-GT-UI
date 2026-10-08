import { useFormContext, useWatch } from "react-hook-form";
import { formatMoney } from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

import { useProductCategories } from "../api/product.queries";
import type { CreateProductFormValues } from "../schemas/product.schemas";

export function ProductPreview({ images }: { images: readonly string[] }) {
  const { control } = useFormContext<CreateProductFormValues>();
  const values = useWatch({ control });
  const categoryQuery = useProductCategories();
  const categoryNames = (categoryQuery.data ?? [])
    .filter((item) => values.categoriaIds?.includes(item.id))
    .map((item) => item.nombre)
    .join(", ");

  return (
    <AppCard title="Vista previa del producto" size="sm">
      <AppStack gap="md">
        <div>
          <h2 className="text-base font-semibold">{values.nombre || "Nombre del producto"}</h2>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {values.codigoProducto || "Sin código"}
          </p>
        </div>
        {images.length ? (
          <img src={images[0]} alt="Imagen principal del producto"
            className="max-h-56 w-full rounded-md object-contain" />
        ) : (
          <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-[hsl(var(--app-border))] text-xs text-[hsl(var(--app-muted-foreground))]">
            Sin imágenes
          </div>
        )}
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
          <dt className="font-medium">Descripción</dt>
          <dd className="break-words">{values.descripcion || "—"}</dd>
          <dt className="font-medium">Categorías</dt>
          <dd className="break-words">{categoryNames || "—"}</dd>
          <dt className="font-medium">Venta</dt>
          <dd>{formatMoney(values.precio ? Number(values.precio) : 0)}</dd>
          <dt className="font-medium">Costo de referencia</dt>
          <dd>{formatMoney(values.precioCosto ? Number(values.precioCosto) : 0)}</dd>
          <dt className="font-medium">Imágenes</dt>
          <dd>{images.length}</dd>
        </dl>
        <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
          Las existencias se registran posteriormente en Inventario.
        </p>
      </AppStack>
    </AppCard>
  );
}
