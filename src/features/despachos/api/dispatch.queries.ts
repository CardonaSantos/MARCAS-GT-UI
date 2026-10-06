import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";

import type {
  DispatchCandidateFilters,
  DispatchCandidatePageResponse,
  DispatchDetail,
  DispatchEventFilters,
  DispatchEventPageResponse,
  DispatchListFilters,
  DispatchOperationalReport,
  DispatchOperationalReportFilters,
  DispatchOperationFilters,
  DispatchOperationPageResponse,
  DispatchPageResponse,
  DispatchSummary,
  DispatchSummaryFilters,
} from "./dispatch.types";

export function useDispatches(filters: DispatchListFilters) {
  return API.useQuery<DispatchPageResponse>({
    queryKey: marcasQueryKeys.despachos.list(filters),
    endpoint: marcasEndpoints.despachos.root,
    params: { ...filters },
  });
}

export function useDispatchCandidates(filters: DispatchCandidateFilters) {
  return API.useQuery<DispatchCandidatePageResponse>({
    queryKey: marcasQueryKeys.despachos.custom("candidates", filters),
    endpoint: marcasEndpoints.despachos.candidates,
    params: { ...filters },
  });
}

export function useDispatchSummary(
  filters: DispatchSummaryFilters,
  enabled = true,
) {
  return API.useQuery<DispatchSummary>({
    queryKey: marcasQueryKeys.despachos.summary(filters),
    endpoint: marcasEndpoints.despachos.summary,
    params: { ...filters },
    options: { enabled },
  });
}

export function useDispatch(id: number) {
  return API.useQuery<DispatchDetail>({
    queryKey: marcasQueryKeys.despachos.detail(id),
    endpoint: marcasEndpoints.despachos.detail(id),
    options: { enabled: Number.isInteger(id) && id > 0 },
  });
}

export function useDispatchEvents(id: number, filters: DispatchEventFilters) {
  return API.useQuery<DispatchEventPageResponse>({
    queryKey: marcasQueryKeys.despachos.custom("detail", id, "events", filters),
    endpoint: marcasEndpoints.despachos.events(id),
    params: { ...filters },
    options: { enabled: Number.isInteger(id) && id > 0 },
  });
}

export function useDispatchOperations(filters: DispatchOperationFilters) {
  return API.useQuery<DispatchOperationPageResponse>({
    queryKey: marcasQueryKeys.despachos.custom("operations", filters),
    endpoint: marcasEndpoints.despachos.operations,
    params: { ...filters },
  });
}

export function useDispatchOperationsByDispatch(
  id: number,
  filters: Omit<DispatchOperationFilters, "dispatchId">,
) {
  return API.useQuery<DispatchOperationPageResponse>({
    queryKey: marcasQueryKeys.despachos.custom(
      "detail",
      id,
      "operations",
      filters,
    ),
    endpoint: marcasEndpoints.despachos.dispatchOperations(id),
    params: { ...filters },
    options: { enabled: Number.isInteger(id) && id > 0 },
  });
}

export function useDispatchOperationalReport(
  filters: DispatchOperationalReportFilters,
) {
  return API.useQuery<DispatchOperationalReport>({
    queryKey: marcasQueryKeys.despachos.custom("operational-report", filters),
    endpoint: marcasEndpoints.despachos.operationalReport,
    params: { ...filters },
  });
}
