import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { getApiErrorMessage } from "@/lib/api-error";

import type {
  AddDeliveryEvidencePayload,
  CreateDeliveryPayload,
  DeliveryObservationPayload,
  DeliveryView,
  FinalizeDeliveryPayload,
  StartDeliveryPayload,
  UpdateDeliveryResultPayload,
} from "./delivery.types";

const deliveryInvalidations = [
  marcasQueryKeys.entregas.all,
  marcasQueryKeys.transporte.all,
  marcasQueryKeys.pedidos.all,
  marcasQueryKeys.despachos.all,
];

function mutationError(error: unknown) {
  toast.error(getApiErrorMessage(error));
}

export function useCreateDelivery() {
  return API.useMutation<DeliveryView, CreateDeliveryPayload>({
    method: "POST",
    endpoint: marcasEndpoints.entregas.root,
    invalidateKeys: deliveryInvalidations,
    options: {
      onSuccess: () => toast.success("Entrega creada."),
      onError: mutationError,
    },
  });
}

export function useStartDelivery() {
  return API.useMutation<DeliveryView, { id: number; payload: StartDeliveryPayload }>({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.entregas.start(id),
    body: ({ payload }) => payload,
    invalidateKeys: deliveryInvalidations,
    options: {
      onSuccess: () => toast.success("Atención de entrega iniciada."),
      onError: mutationError,
    },
  });
}

export function useUpdateDeliveryResult() {
  return API.useMutation<
    DeliveryView,
    { id: number; payload: UpdateDeliveryResultPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.entregas.result(id),
    body: ({ payload }) => payload,
    invalidateKeys: deliveryInvalidations,
    options: {
      onSuccess: () => toast.success("Resultado de entrega actualizado."),
      onError: mutationError,
    },
  });
}

export function useAddDeliveryEvidence() {
  return API.useMutation<
    { evidence: unknown; entrega: DeliveryView },
    { id: number; payload: AddDeliveryEvidencePayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.entregas.evidences(id),
    body: ({ payload }) => payload,
    invalidateKeys: [marcasQueryKeys.entregas.all],
    options: {
      onSuccess: () => toast.success("Evidencia agregada."),
      onError: mutationError,
    },
  });
}

/** Usa el cargador privado de Archivos (multipart, JPG/PNG/WebP/PDF). */
export function useUploadDeliveryEvidence() {
  return API.useMutation<
    { evidence: { id: number }; entrega: DeliveryView },
    { id: number; file: File; tipo: string; descripcion?: string; claveIdempotencia: string }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.entregas.evidenceUpload(id),
    body: ({ file, tipo, descripcion, claveIdempotencia }) => {
      const form = new FormData();
      form.append("archivo", file, file.name);
      form.append("tipo", tipo);
      form.append("descripcion", descripcion ?? "");
      form.append("claveIdempotencia", claveIdempotencia);
      return form;
    },
    invalidateKeys: [marcasQueryKeys.entregas.all],
    options: {
      onSuccess: () => toast.success("Evidencia cargada a Spaces."),
      onError: mutationError,
    },
  });
}

export function useRemoveDeliveryEvidence() {
  return API.useMutation<DeliveryView, { id: number; evidenceId: number }>({
    method: "DELETE",
    endpoint: ({ id, evidenceId }) =>
      marcasEndpoints.entregas.evidence(id, evidenceId),
    invalidateKeys: [marcasQueryKeys.entregas.all],
    options: {
      onSuccess: () => toast.success("Evidencia eliminada."),
      onError: mutationError,
    },
  });
}

export function useFinalizeDelivery() {
  return API.useMutation<
    DeliveryView,
    { id: number; payload: FinalizeDeliveryPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.entregas.finish(id),
    body: ({ payload }) => payload,
    invalidateKeys: deliveryInvalidations,
    options: {
      onSuccess: () => toast.success("Entrega finalizada."),
      onError: mutationError,
    },
  });
}

export function useAddDeliveryObservation() {
  return API.useMutation<
    DeliveryView,
    { id: number; payload: DeliveryObservationPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.entregas.observations(id),
    body: ({ payload }) => payload,
    invalidateKeys: [marcasQueryKeys.entregas.all],
    options: {
      onSuccess: () => toast.success("Observación registrada."),
      onError: mutationError,
    },
  });
}
