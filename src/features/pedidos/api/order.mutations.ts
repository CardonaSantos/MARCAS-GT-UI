import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { getApiErrorMessage } from "@/lib/api-error";

import type {
  CancelOrderPayload,
  CreateOrderPayload,
  OrderDetail,
  UpdateOrderPayload,
} from "./order.types";

function mutationError(error: unknown) {
  toast.error(getApiErrorMessage(error));
}

const orderInvalidations = [
  marcasQueryKeys.pedidos.all,
];

export function useCreateOrder() {
  return API.useMutation<OrderDetail, CreateOrderPayload>({
    method: "POST",
    endpoint: marcasEndpoints.pedidos.root,
    invalidateKeys: orderInvalidations,
    options: {
      onSuccess: () => toast.success("Pedido creado correctamente."),
      onError: mutationError,
    },
  });
}

export function useUpdateOrder() {
  return API.useMutation<
    OrderDetail,
    { id: number; payload: UpdateOrderPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.pedidos.detail(id),
    body: ({ payload }) => payload,
    invalidateKeys: orderInvalidations,
    options: {
      onSuccess: () => toast.success("Pedido actualizado correctamente."),
      onError: mutationError,
    },
  });
}

export function useRequestOrderValidation() {
  return API.useMutation<OrderDetail, { id: number }>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.pedidos.requestValidation(id),
    body: () => undefined,
    invalidateKeys: orderInvalidations,
    options: {
      onSuccess: () => toast.success("Pedido enviado a validación."),
      onError: mutationError,
    },
  });
}

export function useConfirmOrder() {
  return API.useMutation<OrderDetail, { id: number }>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.pedidos.confirm(id),
    body: () => undefined,
    invalidateKeys: orderInvalidations,
    options: {
      onSuccess: () => toast.success("Pedido confirmado correctamente."),
      onError: mutationError,
    },
  });
}

export function useCancelOrder() {
  return API.useMutation<
    OrderDetail,
    { id: number; payload: CancelOrderPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.pedidos.cancel(id),
    body: ({ payload }) => payload,
    invalidateKeys: orderInvalidations,
    options: {
      onSuccess: () => toast.success("Pedido cancelado correctamente."),
      onError: mutationError,
    },
  });
}
