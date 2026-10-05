import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { getApiErrorMessage } from "@/lib/api-error";

import type {
  AdjustInventoryPayload,
  CancelReservationPayload,
  InventoryMutationResult,
  RegisterInventoryEntryPayload,
  RegisterInventoryReturnPayload,
  ReservationMutationPayload,
  ReserveInventoryPayload,
} from "./inventory.types";

function mutationError(error: unknown) {
  toast.error(getApiErrorMessage(error));
}

const inventoryInvalidations = [
  marcasQueryKeys.inventario.all,
  marcasQueryKeys.bodegas.all,
];

const reservationInvalidations = [
  marcasQueryKeys.inventario.all,
  marcasQueryKeys.bodegas.all,
  marcasQueryKeys.pedidos.all,
];

export function useRegisterInventoryEntry() {
  return API.useMutation<InventoryMutationResult, RegisterInventoryEntryPayload>({
    method: "POST",
    endpoint: marcasEndpoints.inventario.entries,
    invalidateKeys: inventoryInvalidations,
    options: {
      onSuccess: (result) =>
        toast.success(
          result.repeated
            ? "La entrada ya había sido registrada."
            : "Entrada de inventario registrada correctamente.",
        ),
      onError: mutationError,
    },
  });
}

export function useAdjustInventory() {
  return API.useMutation<InventoryMutationResult, AdjustInventoryPayload>({
    method: "POST",
    endpoint: marcasEndpoints.inventario.adjustments,
    invalidateKeys: inventoryInvalidations,
    options: {
      onSuccess: (result) =>
        toast.success(
          result.repeated
            ? "El ajuste ya había sido procesado."
            : "Ajuste de inventario registrado correctamente.",
        ),
      onError: mutationError,
    },
  });
}

export function useRegisterInventoryReturn() {
  return API.useMutation<
    InventoryMutationResult,
    RegisterInventoryReturnPayload
  >({
    method: "POST",
    endpoint: marcasEndpoints.inventario.returns,
    invalidateKeys: inventoryInvalidations,
    options: {
      onSuccess: (result) =>
        toast.success(
          result.repeated
            ? "La devolución ya había sido registrada."
            : "Devolución registrada correctamente.",
        ),
      onError: mutationError,
    },
  });
}

export function useReserveInventory() {
  return API.useMutation<InventoryMutationResult, ReserveInventoryPayload>({
    method: "POST",
    endpoint: marcasEndpoints.inventario.reservations,
    invalidateKeys: reservationInvalidations,
    options: {
      onSuccess: (result) =>
        toast.success(
          result.repeated
            ? "La reserva ya había sido registrada."
            : "Reserva de inventario creada correctamente.",
        ),
      onError: mutationError,
    },
  });
}

export function useApplyInventoryReservation() {
  return API.useMutation<
    InventoryMutationResult,
    { id: number; payload: ReservationMutationPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.inventario.applyReservation(id),
    body: ({ payload }) => payload,
    invalidateKeys: reservationInvalidations,
    options: {
      onSuccess: (result) =>
        toast.success(
          result.repeated
            ? "La aplicación ya había sido procesada."
            : "Reserva aplicada correctamente.",
        ),
      onError: mutationError,
    },
  });
}

export function useReleaseInventoryReservation() {
  return API.useMutation<
    InventoryMutationResult,
    { id: number; payload: ReservationMutationPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.inventario.releaseReservation(id),
    body: ({ payload }) => payload,
    invalidateKeys: reservationInvalidations,
    options: {
      onSuccess: (result) =>
        toast.success(
          result.repeated
            ? "La liberación ya había sido procesada."
            : "Reserva liberada correctamente.",
        ),
      onError: mutationError,
    },
  });
}

export function useCancelInventoryReservation() {
  return API.useMutation<
    InventoryMutationResult,
    { id: number; payload: CancelReservationPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.inventario.cancelReservation(id),
    body: ({ payload }) => payload,
    invalidateKeys: reservationInvalidations,
    options: {
      onSuccess: (result) =>
        toast.success(
          result.repeated
            ? "La cancelación ya había sido procesada."
            : "Reserva cancelada correctamente.",
        ),
      onError: mutationError,
    },
  });
}
