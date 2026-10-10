import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";
import type {
  VisitHistoryDetail, VisitHistoryFilters, VisitHistoryPage,
} from "./visit-history.types";

export function useVisitHistory(filters: VisitHistoryFilters) {
  return API.useQuery<VisitHistoryPage>({
    queryKey: marcasQueryKeys.visitas.list(filters),
    endpoint: marcasEndpoints.visits.history,
    params: { ...filters },
  });
}

export function useVisitHistoryDetail(id: number | null) {
  return API.useQuery<VisitHistoryDetail>({
    queryKey: marcasQueryKeys.visitas.detail(id ?? 0),
    endpoint: marcasEndpoints.visits.historyDetail(id ?? 0),
    options: { enabled: id !== null && id > 0 },
  });
}
