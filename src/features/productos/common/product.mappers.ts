import type { CreateProductFormValues } from "../schemas/product.schemas";
import type { CreateProductPayload } from "../api/product.types";

/** Mapear una sola vez, después de la validación; no guardar fotos duplicadas en React Hook Form. */
export function toCreateProductPayload(
  values: CreateProductFormValues,
  imageUrls: readonly string[],
): CreateProductPayload {
  return {
    nombre: values.nombre.trim(),
    codigoProducto: values.codigoProducto.trim(),
    descripcion: values.descripcion.trim(),
    categoriaIds: [...values.categoriaIds],
    precio: Number(values.precio),
    precioCosto: Number(values.precioCosto),
    fotos: [...imageUrls],
  };
}
