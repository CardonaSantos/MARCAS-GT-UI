import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";

import type {
  PaymentApplicationPageResponse,
  PaymentBankAdmin,
  PaymentBankOption,
  PaymentDetail,
  PaymentEventPageResponse,
  PaymentListFilters,
  PaymentPageResponse,
  PaymentRangeFilters,
  PaymentSummary,
  ReceivableCandidatePageResponse,
} from "./payment.types";

export function usePayments(filters: PaymentListFilters) {
  return API.useQuery<PaymentPageResponse>({
    queryKey: marcasQueryKeys.pagos.list(filters),
    endpoint: marcasEndpoints.pagos.root,
    params: { ...filters },
  });
}

export function usePayment(id: number) {
  return API.useQuery<PaymentDetail>({
    queryKey: marcasQueryKeys.pagos.detail(id),
    endpoint: marcasEndpoints.pagos.detail(id),
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function usePaymentBanks() {
  return API.useQuery<PaymentBankOption[]>({
    queryKey: marcasQueryKeys.pagos.custom("banks"),
    endpoint: marcasEndpoints.pagos.banks,
  });
}

export function usePaymentBanksAdmin() {
  return API.useQuery<PaymentBankAdmin[]>({
    queryKey: marcasQueryKeys.pagos.custom("banks", "admin"),
    endpoint: marcasEndpoints.pagos.banksAdmin,
  });
}

export function usePaymentSummary(
  filters: PaymentRangeFilters,
  enabled = true,
) {
  return API.useQuery<PaymentSummary>({
    queryKey: marcasQueryKeys.pagos.summary(filters),
    endpoint: marcasEndpoints.pagos.summary,
    params: { ...filters },
    options: { enabled },
  });
}

export function usePaymentEvents(id: number, page = 1, limit = 50) {
  return API.useQuery<PaymentEventPageResponse>({
    queryKey: marcasQueryKeys.pagos.custom("detail", id, "events", page, limit),
    endpoint: marcasEndpoints.pagos.events(id),
    params: { page, limit },
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function usePaymentApplications(id: number, page = 1, limit = 50) {
  return API.useQuery<PaymentApplicationPageResponse>({
    queryKey: marcasQueryKeys.pagos.custom(
      "detail",
      id,
      "applications",
      page,
      limit,
    ),
    endpoint: marcasEndpoints.pagos.applications(id),
    params: { page, limit },
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function usePaymentReceivableCandidates(
  id: number,
  page = 1,
  limit = 100,
) {
  return API.useQuery<ReceivableCandidatePageResponse>({
    queryKey: marcasQueryKeys.pagos.custom(
      "detail",
      id,
      "receivable-candidates",
      page,
      limit,
    ),
    endpoint: marcasEndpoints.pagos.candidateReceivables(id),
    params: { page, limit },
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}
