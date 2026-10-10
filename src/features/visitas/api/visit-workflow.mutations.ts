import { toast } from "sonner";
import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
  VisitRecord, StartVisitPayload, FinishVisitPayload, CancelVisitPayload,
} from "./visit-workflow.types";

const invalidates = [marcasQueryKeys.visitas.all, marcasQueryKeys.clientes.all];

export function useStartVisit() {
  return API.useMutation<VisitRecord, StartVisitPayload>({
    method: "POST",
    endpoint: marcasEndpoints.visits.workflowStart,
    invalidateKeys: invalidates,
    options: {
      onSuccess: () => toast.success("Visita iniciada correctamente."),
      onError: (e) => toast.error(getApiErrorMessage(e, "No se pudo iniciar la visita.")),
    },
  });
}
export function useFinishVisit() {
  return API.useMutation<VisitRecord, { id: number; payload: FinishVisitPayload }>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.visits.workflowFinish(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidates,
    options: {
      onSuccess: () => toast.success("Visita finalizada correctamente."),
      onError: (e) => toast.error(getApiErrorMessage(e, "No se pudo finalizar la visita.")),
    },
  });
}
export function useCancelVisit() {
  return API.useMutation<VisitRecord, { id: number; payload: CancelVisitPayload }>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.visits.workflowCancel(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidates,
    options: {
      onSuccess: () => toast.success("Visita cancelada."),
      onError: (e) => toast.error(getApiErrorMessage(e, "No se pudo cancelar la visita.")),
    },
  });
}
