import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { getApiErrorMessage } from "@/lib/api-error";

import type {
  CreateTransferPayload,
  RegisterTransferOutboundPayload,
  RegisterTransferReceiptPayload,
  TransferDetail,
  TransferOperationMutationResponse,
  TransferReasonPayload,
  UpdateTransferPayload,
} from "./transfer.types";

const invalidations = [
  marcasQueryKeys.transferencias.all,
  marcasQueryKeys.inventario.all,
  marcasQueryKeys.bodegas.all,
];

function mutationError(error: unknown) {
  toast.error(getApiErrorMessage(error));
}

export function useCreateTransfer() {
  return API.useMutation<TransferDetail, CreateTransferPayload>({
    method: "POST",
    endpoint: marcasEndpoints.transferencias.root,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Transferencia guardada en borrador."),
      onError: mutationError,
    },
  });
}

export function useUpdateTransfer() {
  return API.useMutation<
    TransferDetail,
    { id: number; payload: UpdateTransferPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.transferencias.detail(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Transferencia actualizada."),
      onError: mutationError,
    },
  });
}

export function usePrepareTransfer() {
  return API.useMutation<TransferDetail, { id: number }>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.transferencias.prepare(id),
    body: () => undefined,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () =>
        toast.success("Transferencia preparada y disponibilidad validada."),
      onError: mutationError,
    },
  });
}

export function useCancelTransfer() {
  return API.useMutation<
    TransferDetail,
    { id: number; payload: TransferReasonPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.transferencias.cancel(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidations,
    options: {
      onSuccess: () => toast.success("Transferencia cancelada."),
      onError: mutationError,
    },
  });
}

export function useRegisterTransferOutbound() {
  return API.useMutation<
    TransferOperationMutationResponse,
    { id: number; payload: RegisterTransferOutboundPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.transferencias.outputs(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidations,
    options: {
      onSuccess: (response) =>
        toast.success(
          response.result.repeated
            ? "La salida ya había sido aplicada; no se duplicó inventario."
            : "Salida física registrada.",
        ),
      onError: mutationError,
    },
  });
}

export function useRegisterTransferReceipt() {
  const invalidate = API.useInvalidateQueries();

  return API.useMutation<
    TransferOperationMutationResponse,
    { id: number; payload: RegisterTransferReceiptPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.transferencias.receipts(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidations,
    options: {
      onSuccess: (response) =>
        toast.success(
          response.result.repeated
            ? "La recepción ya había sido aplicada; no se duplicó inventario."
            : "Recepción física registrada.",
        ),
      onError: async (error) => {
        mutationError(error);
        await invalidate(invalidations);
      },
    },
  });
}
