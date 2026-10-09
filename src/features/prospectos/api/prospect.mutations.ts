import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
  CancelProspectPayload, FinishProspectPayload, ProspectRecord, StartProspectPayload,
} from "./prospect.types";
const invalidates = [marcasQueryKeys.prospectos.all, marcasQueryKeys.visitas.all];

export function useStartProspect() {
  return API.useMutation<ProspectRecord, StartProspectPayload>({
    method: "POST",
    endpoint: marcasEndpoints.prospects.workflowStart,
    invalidateKeys: invalidates,
    options: {
      onSuccess: () => toast.success("Prospecto iniciado."),
      onError: (e) => toast.error(getApiErrorMessage(e, "No se pudo iniciar el prospecto.")),
    },
  });
}
export function useFinishProspect() {
  return API.useMutation<ProspectRecord, { id: number; payload: FinishProspectPayload }>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.prospects.workflowFinish(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidates,
    options: {
      onSuccess: () => toast.success("Prospecto finalizado."),
      onError: (e) => toast.error(getApiErrorMessage(e, "No se pudo finalizar el prospecto.")),
    },
  });
}
export function useCancelProspect() {
  return API.useMutation<ProspectRecord, { id: number; payload: CancelProspectPayload }>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.prospects.workflowCancel(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidates,
    options: {
      onSuccess: () => toast.success("Prospecto cancelado."),
      onError: (e) => toast.error(getApiErrorMessage(e, "No se pudo cancelar el prospecto.")),
    },
  });
}
