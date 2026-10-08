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
