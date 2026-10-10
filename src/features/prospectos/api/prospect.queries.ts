import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";
import type { ProspectRecord } from "./prospect.types";

export function useOpenProspect() {
  return API.useQuery<ProspectRecord | null>({
    queryKey: marcasQueryKeys.prospectos.custom("jornada", "abierto"),
    endpoint: marcasEndpoints.prospects.workflowOpen,
    emptyResponseValue: null,
    options: { retry: false, staleTime: 0 },
  });
}
