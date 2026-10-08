import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { getApiErrorMessage } from "@/lib/api-error";

import type {
  DeleteProviderVariables,
  Provider,
  ProviderPayload,
  UpdateProviderVariables,
} from "./provider.types";

const invalidate = [
  marcasQueryKeys.proveedores.all,
  marcasQueryKeys.inventario.all,
  marcasQueryKeys.requisiciones.all,
];

export function useCreateProvider() {
  return API.useMutation<Provider, ProviderPayload>({
    method: "POST",
    endpoint: marcasEndpoints.providers.root,
    invalidateKeys: invalidate,
    options: {
      onSuccess: () => toast.success("Proveedor registrado correctamente."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    },
  });
}

export function useUpdateProvider() {
  return API.useMutation<Provider, UpdateProviderVariables>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.providers.detail(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidate,
    options: {
      onSuccess: () => toast.success("Proveedor actualizado correctamente."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    },
  });
}

export function useDeleteProvider() {
  return API.useMutation<Provider, DeleteProviderVariables>({
    method: "DELETE",
    endpoint: ({ id }) => marcasEndpoints.providers.deleteOne(id),
    body: () => undefined,
    invalidateKeys: invalidate,
    options: {
      onSuccess: () => toast.success("Proveedor eliminado correctamente."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    },
  });
}
