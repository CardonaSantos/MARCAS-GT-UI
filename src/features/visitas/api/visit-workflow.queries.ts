import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";
import type { VisitRecord } from "./visit-workflow.types";

export function useOpenVisit() {
  return API.useQuery<VisitRecord | null>({
    queryKey: marcasQueryKeys.visitas.custom("jornada", "abierta"),
    endpoint: marcasEndpoints.visits.workflowOpen,
    emptyResponseValue: null,
    options: { retry: false, staleTime: 0 },
  });
}
