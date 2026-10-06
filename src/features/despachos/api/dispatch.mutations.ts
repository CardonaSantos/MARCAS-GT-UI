import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { getApiErrorMessage } from "@/lib/api-error";

import type {
  CancelDispatchPayload,
  CreateDispatchPayload,
  DispatchDetail,
  DispatchObservationPayload,
  DispatchOperationMutationResponse,
  RegisterDispatchOutputPayload,
  StartDispatchPreparationPayload,
  UpdateDispatchPayload,
  UpdateDispatchPreparationPayload,
} from "./dispatch.types";

const invalidations = [
  marcasQueryKeys.despachos.all,
  marcasQueryKeys.pedidos.all,
  marcasQueryKeys.inventario.all,
  marcasQueryKeys.bodegas.all,
];

function mutationError(error: unknown) {
  toast.error(getApiErrorMessage(error));
}

export function useCreateDispatch() {
  return API.useMutation<DispatchDetail, CreateDispatchPayload>({
    method: "POST",
    endpoint: marcasEndpoints.despachos.root,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Orden de despacho creada."),
      onError: mutationError,
    },
  });
}

export function useUpdateDispatch() {
  return API.useMutation<
    DispatchDetail,
    { id: number; payload: UpdateDispatchPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.despachos.detail(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Planificación actualizada."),
      onError: mutationError,
    },
  });
}

export function useStartDispatchPreparation() {
  const invalidate = API.useInvalidateQueries();
  return API.useMutation<
    DispatchOperationMutationResponse,
    { id: number; payload: StartDispatchPreparationPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.despachos.startPreparation(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Preparación iniciada e inventario reservado."),
      onError: async (error) => {
        mutationError(error);
        await invalidate(invalidations);
      },
    },
  });
}

export function useUpdateDispatchPreparation() {
  return API.useMutation<
    DispatchDetail,
    { id: number; payload: UpdateDispatchPreparationPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.despachos.preparation(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Cantidades preparadas actualizadas."),
      onError: mutationError,
    },
  });
}

export function useCompleteDispatchPreparation() {
  return API.useMutation<DispatchDetail, { id: number }>({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.despachos.finishPreparation(id),
    body: () => undefined,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Preparación finalizada."),
      onError: mutationError,
    },
  });
}

export function useRegisterDispatchOutput() {
  const invalidate = API.useInvalidateQueries();
  return API.useMutation<
    DispatchOperationMutationResponse,
    { id: number; payload: RegisterDispatchOutputPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.despachos.outputs(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Salida física registrada."),
      onError: async (error) => {
        mutationError(error);
        await invalidate(invalidations);
      },
    },
  });
}

export function useCancelDispatch() {
  const invalidate = API.useInvalidateQueries();
  return API.useMutation<
    DispatchOperationMutationResponse,
    { id: number; payload: CancelDispatchPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.despachos.cancel(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Despacho cancelado."),
      onError: async (error) => {
        mutationError(error);
        await invalidate(invalidations);
      },
    },
  });
}

export function useRetryDispatchOperation() {
  const invalidate = API.useInvalidateQueries();
  return API.useMutation<
    DispatchOperationMutationResponse,
    { operationId: number }
  >({
    method: "POST",
    endpoint: ({ operationId }) =>
      marcasEndpoints.despachos.retryOperation(operationId),
    body: () => undefined,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Operación reintentada."),
      onError: async (error) => {
        mutationError(error);
        await invalidate(invalidations);
      },
    },
  });
}

export function useAddDispatchObservation() {
  return API.useMutation<
    DispatchDetail,
    { id: number; payload: DispatchObservationPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.despachos.observations(id),
    body: ({ payload }) => payload,
    invalidateKeys: [marcasQueryKeys.despachos.all],
    options: {
      onSuccess: () => toast.success("Observación registrada."),
      onError: mutationError,
    },
  });
}
