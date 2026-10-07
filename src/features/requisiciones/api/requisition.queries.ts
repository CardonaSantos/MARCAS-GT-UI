import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";

import type {
  RequisitionDetail,
  RequisitionEventFilters,
  RequisitionEventPage,
  RequisitionListFilters,
  RequisitionPage,
  RequisitionReceiptFilters,
  RequisitionReceiptPage,
  RequisitionSummary,
  RequisitionSummaryFilters,
} from "./requisition.types";

export function useRequisitions(filters: RequisitionListFilters) {
  return API.useQuery<RequisitionPage>({
    queryKey: marcasQueryKeys.requisiciones.list(filters),
    endpoint: marcasEndpoints.requisiciones.root,
    params: { ...filters },
  });
}

export function useRequisitionSummary(filters: RequisitionSummaryFilters) {
  return API.useQuery<RequisitionSummary>({
    queryKey: marcasQueryKeys.requisiciones.summary(filters),
    endpoint: marcasEndpoints.requisiciones.summary,
    params: { ...filters },
  });
}

export function useRequisition(id: number) {
  return API.useQuery<RequisitionDetail>({
    queryKey: marcasQueryKeys.requisiciones.detail(id),
    endpoint: marcasEndpoints.requisiciones.detail(id),
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useRequisitionEvents(
  id: number,
  filters: RequisitionEventFilters,
) {
  return API.useQuery<RequisitionEventPage>({
    queryKey: marcasQueryKeys.requisiciones.custom(
      "detail",
      id,
      "events",
      filters,
    ),
    endpoint: marcasEndpoints.requisiciones.events(id),
    params: { ...filters },
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useRequisitionReceipts(
  id: number,
  filters: Omit<RequisitionReceiptFilters, "requisicionId">,
) {
  return API.useQuery<RequisitionReceiptPage>({
    queryKey: marcasQueryKeys.requisiciones.custom(
      "detail",
      id,
      "receipts",
      filters,
    ),
    endpoint: marcasEndpoints.requisiciones.requisitionReceipts(id),
    params: { ...filters },
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useRequisitionReceiptList(filters: RequisitionReceiptFilters) {
  return API.useQuery<RequisitionReceiptPage>({
    queryKey: marcasQueryKeys.requisiciones.custom("receipts", filters),
    endpoint: marcasEndpoints.requisiciones.receipts,
    params: { ...filters },
  });
}
