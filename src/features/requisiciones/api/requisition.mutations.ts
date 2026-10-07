import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { getApiErrorMessage } from "@/lib/api-error";

import type {
  CreateRequisitionPayload,
  RegisterRequisitionReceiptPayload,
  RegisterRequisitionReceiptResponse,
  RequisitionDetail,
  RequisitionReasonPayload,
  UpdateRequisitionPayload,
} from "./requisition.types";

const invalidations = [
  marcasQueryKeys.requisiciones.all,
  marcasQueryKeys.inventario.all,
  marcasQueryKeys.bodegas.all,
];

function mutationError(error: unknown) {
  toast.error(getApiErrorMessage(error));
}

export function useCreateRequisition() {
  return API.useMutation<RequisitionDetail, CreateRequisitionPayload>({
    method: "POST",
    endpoint: marcasEndpoints.requisiciones.root,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Requisición guardada en borrador."),
      onError: mutationError,
    },
  });
}

export function useUpdateRequisition() {
  return API.useMutation<
    RequisitionDetail,
    { id: number; payload: UpdateRequisitionPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.requisiciones.detail(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Requisición actualizada."),
      onError: mutationError,
    },
  });
}

export function useRequestRequisition() {
  return API.useMutation<RequisitionDetail, { id: number }>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.requisiciones.request(id),
    body: () => undefined,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Requisición enviada para aprobación."),
      onError: mutationError,
    },
  });
}

export function useApproveRequisition() {
  return API.useMutation<RequisitionDetail, { id: number }>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.requisiciones.approve(id),
    body: () => undefined,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Requisición aprobada."),
      onError: mutationError,
    },
  });
}

export function useRejectRequisition() {
  return API.useMutation<
    RequisitionDetail,
    { id: number; payload: RequisitionReasonPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.requisiciones.reject(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Requisición rechazada."),
      onError: mutationError,
    },
  });
}

export function useCancelRequisition() {
  return API.useMutation<
    RequisitionDetail,
    { id: number; payload: RequisitionReasonPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.requisiciones.cancel(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Requisición cancelada."),
      onError: mutationError,
    },
  });
}

export function useRegisterRequisitionReceipt() {
  const invalidate = API.useInvalidateQueries();

  return API.useMutation<
    RegisterRequisitionReceiptResponse,
    { id: number; payload: RegisterRequisitionReceiptPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.requisiciones.requisitionReceipts(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Recepción registrada e inventario actualizado."),
      onError: async (error) => {
        mutationError(error);
        await invalidate(invalidations);
      },
    },
  });
}
