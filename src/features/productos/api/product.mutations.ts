import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { getApiErrorMessage } from "@/lib/api-error";

import type { CreatedProduct, CreateProductPayload } from "./product.types";

export function useCreateProduct() {
  return API.useMutation<CreatedProduct, CreateProductPayload>({
    method: "POST",
    endpoint: marcasEndpoints.products.root,
    invalidateKeys: [
      marcasQueryKeys.productos.all,
      marcasQueryKeys.inventario.all,
    ],
    options: {
      onSuccess: () => toast.success("Producto creado correctamente."),
      onError: (error) =>
        toast.error(getApiErrorMessage(error, "No se pudo crear el producto.")),
    },
  });
}

import type {
  UpdateCatalogProductVariables,
  ProductImagesVariables,
  DeleteProductImageVariables,
} from "./catalog.types";

const afterProductChange = [
  marcasQueryKeys.productos.all,
  marcasQueryKeys.inventario.all,
];

export function useUpdateCatalogProduct() {
  return API.useMutation<unknown, UpdateCatalogProductVariables>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.products.detail(id),
    body: ({ payload }) => payload,
    invalidateKeys: afterProductChange,
    options: {
      onSuccess: () => toast.success("Producto actualizado correctamente."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    },
  });
}

export function useUploadCatalogProductImages() {
  return API.useMutation<unknown, ProductImagesVariables>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.products.uploadImages(id),
    body: ({ images }) => ({ images }),
    invalidateKeys: afterProductChange,
    options: {
      onSuccess: () => toast.success("Imágenes agregadas correctamente."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    },
  });
}

export function useDeleteCatalogProductImage() {
  return API.useMutation<unknown, DeleteProductImageVariables>({
    method: "DELETE",
    endpoint: ({ productId, imageId }) =>
      marcasEndpoints.products.deleteImage(productId, imageId),
    params: ({ publicId }) => ({ publicId }),
    body: () => undefined,
    invalidateKeys: afterProductChange,
    options: {
      onSuccess: () => toast.success("Imagen eliminada correctamente."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    },
  });
}
