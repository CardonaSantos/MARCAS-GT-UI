import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";
import type {
  ProspectHistoryDetail, ProspectHistoryFilters, ProspectHistoryPage,
} from "./prospect-history.types";

export function useProspectHistory(filters: ProspectHistoryFilters) {
  return API.useQuery<ProspectHistoryPage>({
    queryKey: marcasQueryKeys.prospectos.list(filters),
    endpoint: marcasEndpoints.prospects.history,
    params: { ...filters },
  });
}
export function useProspectHistoryDetail(id: number | null) {
  return API.useQuery<ProspectHistoryDetail>({
    queryKey: marcasQueryKeys.prospectos.detail(id ?? 0),
    endpoint: marcasEndpoints.prospects.historyDetail(id ?? 0),
    options: { enabled: id !== null && id > 0 },
  });
}
