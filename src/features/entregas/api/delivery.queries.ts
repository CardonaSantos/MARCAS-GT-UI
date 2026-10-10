import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";

import type {
  DeliveryCandidateFilters,
  DeliveryCandidatePageResponse,
  DeliveryEventFilters,
  DeliveryEventPageResponse,
  DeliveryEvidence,
  DeliveryListFilters,
  DeliveryPageResponse,
  DeliveryOperationalReport,
  DeliveryRangeFilters,
  DeliverySummary,
  DeliveryView,
} from "./delivery.types";

export function useDeliveries(filters: DeliveryListFilters) {
  return API.useQuery<DeliveryPageResponse>({
    queryKey: marcasQueryKeys.entregas.list(filters),
    endpoint: marcasEndpoints.entregas.root,
    params: { ...filters },
  });
}

export function useDeliveryCandidates(filters: DeliveryCandidateFilters) {
  return API.useQuery<DeliveryCandidatePageResponse>({
    queryKey: marcasQueryKeys.entregas.custom("candidates", filters),
    endpoint: marcasEndpoints.entregas.candidates,
    params: { ...filters },
  });
}

export function useDelivery(id: number) {
  return API.useQuery<DeliveryView>({
    queryKey: marcasQueryKeys.entregas.detail(id),
    endpoint: marcasEndpoints.entregas.detail(id),
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useDeliveryEvents(id: number, filters: DeliveryEventFilters) {
  return API.useQuery<DeliveryEventPageResponse>({
    queryKey: marcasQueryKeys.entregas.custom("detail", id, "events", filters),
    endpoint: marcasEndpoints.entregas.events(id),
    params: { ...filters },
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useDeliveryEvidence(id: number) {
  return API.useQuery<DeliveryEvidence[]>({
    queryKey: marcasQueryKeys.entregas.custom("detail", id, "evidence"),
    endpoint: marcasEndpoints.entregas.evidences(id),
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useDeliverySummary(filters: DeliveryRangeFilters, enabled = true) {
  return API.useQuery<DeliverySummary>({
    queryKey: marcasQueryKeys.entregas.summary(filters),
    endpoint: marcasEndpoints.entregas.summary,
    params: { ...filters },
    options: { enabled },
  });
}

export function useDeliveryOperationalReport(filters: DeliveryRangeFilters) {
  return API.useQuery<DeliveryOperationalReport>({
    queryKey: marcasQueryKeys.entregas.custom("operational-report", filters),
    endpoint: marcasEndpoints.entregas.operationalReport,
    params: { ...filters },
  });
}
