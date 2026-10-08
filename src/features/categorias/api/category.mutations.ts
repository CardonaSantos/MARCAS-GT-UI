import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";
import { getApiErrorMessage } from "@/lib/api-error";

import type {
  Category,
  CategoryPayload,
  DeleteCategoryVariables,
  UpdateCategoryVariables,
} from "./category.types";

const invalidateCatalogs = [
  marcasQueryKeys.categorias.all,
  marcasQueryKeys.productos.all,
];

export function useCreateCategory() {
  return API.useMutation<Category, CategoryPayload>({
    method: "POST",
    endpoint: marcasEndpoints.categories.root,
    invalidateKeys: invalidateCatalogs,
    options: {
      onSuccess: () => toast.success("Categoría creada correctamente."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    },
  });
}

export function useUpdateCategory() {
  return API.useMutation<Category, UpdateCategoryVariables>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.categories.detail(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidateCatalogs,
    options: {
      onSuccess: () => toast.success("Categoría actualizada correctamente."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    },
  });
}

export function useDeleteCategory() {
  return API.useMutation<Category, DeleteCategoryVariables>({
    method: "DELETE",
    endpoint: ({ id }) => marcasEndpoints.categories.detail(id),
    body: () => undefined,
    invalidateKeys: invalidateCatalogs,
    options: {
      onSuccess: () => toast.success("Categoría eliminada correctamente."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    },
  });
}
