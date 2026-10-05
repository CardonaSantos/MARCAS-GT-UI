import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { getApiErrorMessage } from "@/lib/api-error";

import type {
  AssignBodegaResponsiblePayload,
  BodegaDetail,
  CreateBodegaPayload,
  DeactivateBodegaPayload,
  UpdateBodegaPayload,
} from "./bodega.types";

function mutationError(error: unknown) {
  toast.error(getApiErrorMessage(error));
}

export function useCreateBodega() {
  return API.useMutation<BodegaDetail, CreateBodegaPayload>({
    method: "POST",
    endpoint: marcasEndpoints.bodegas.root,
    invalidateKeys: [marcasQueryKeys.bodegas.all],
    options: {
      onSuccess: () => toast.success("Bodega creada correctamente."),
      onError: mutationError,
    },
  });
}

export function useUpdateBodega() {
  return API.useMutation<
    BodegaDetail,
    { id: number; payload: UpdateBodegaPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.bodegas.detail(id),
    body: ({ payload }) => payload,
    invalidateKeys: [marcasQueryKeys.bodegas.all],
    options: {
      onSuccess: () => toast.success("Cambios guardados correctamente."),
      onError: mutationError,
    },
  });
}

export function useAssignBodegaResponsible() {
  return API.useMutation<
    BodegaDetail,
    { id: number; payload: AssignBodegaResponsiblePayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.bodegas.responsible(id),
    body: ({ payload }) => payload,
    invalidateKeys: [marcasQueryKeys.bodegas.all],
    options: {
      onSuccess: () => toast.success("Responsable actualizado correctamente."),
      onError: mutationError,
    },
  });
}

export function useActivateBodega() {
  return API.useMutation<BodegaDetail, { id: number }>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.bodegas.activate(id),
    body: () => undefined,
    invalidateKeys: [marcasQueryKeys.bodegas.all],
    options: {
      onSuccess: () => toast.success("Bodega activada correctamente."),
      onError: mutationError,
    },
  });
}

export function useDeactivateBodega() {
  return API.useMutation<
    BodegaDetail,
    { id: number; payload: DeactivateBodegaPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.bodegas.deactivate(id),
    body: ({ payload }) => payload,
    invalidateKeys: [marcasQueryKeys.bodegas.all],
    options: {
      onSuccess: () => toast.success("Bodega desactivada correctamente."),
      onError: mutationError,
    },
  });
}

export function useSetPrincipalBodega() {
  return API.useMutation<BodegaDetail, { id: number }>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.bodegas.setPrincipal(id),
    body: () => undefined,
    invalidateKeys: [marcasQueryKeys.bodegas.all],
    options: {
      onSuccess: () =>
        toast.success("Bodega establecida como principal."),
      onError: mutationError,
    },
  });
}
