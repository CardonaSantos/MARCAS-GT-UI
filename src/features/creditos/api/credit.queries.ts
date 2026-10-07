import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";
import type { OrderPageResponse } from "@/features/pedidos/api/order.types";

import type {
  CreditDetail,
  CreditEventFilters,
  CreditEventPageResponse,
  CreditListFilters,
  CreditPageResponse,
  CreditPolicy,
  CreditPolicyFilters,
  CreditPolicyPageResponse,
  CreditPortfolioDetail,
  CreditPortfolioFilters,
  CreditPortfolioPageResponse,
  CreditSummary,
  CreditSummaryFilters,
} from "./credit.types";

export function useCreditApplications(filters: CreditListFilters) {
  return API.useQuery<CreditPageResponse>({
    queryKey: marcasQueryKeys.creditos.list(filters),
    endpoint: marcasEndpoints.creditos.applications.root,
    params: { ...filters },
  });
}

export function useCreditSummary(
  filters: CreditSummaryFilters,
  enabled = true,
) {
  return API.useQuery<CreditSummary>({
    queryKey: marcasQueryKeys.creditos.summary(filters),
    endpoint: marcasEndpoints.creditos.applications.summary,
    params: { ...filters },
    options: { enabled },
  });
}

export function useCreditApplication(id: number) {
  return API.useQuery<CreditDetail>({
    queryKey: marcasQueryKeys.creditos.detail(id),
    endpoint: marcasEndpoints.creditos.applications.detail(id),
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useCreditEvents(id: number, filters: CreditEventFilters) {
  return API.useQuery<CreditEventPageResponse>({
    queryKey: marcasQueryKeys.creditos.custom(
      "application",
      id,
      "events",
      filters,
    ),
    endpoint: marcasEndpoints.creditos.applications.events(id),
    params: { ...filters },
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useCreditPolicies(filters: CreditPolicyFilters) {
  return API.useQuery<CreditPolicyPageResponse>({
    queryKey: marcasQueryKeys.creditos.custom("policies", filters),
    endpoint: marcasEndpoints.creditos.policies.root,
    params: { ...filters },
  });
}

export function useCreditPolicy(id: number) {
  return API.useQuery<CreditPolicy>({
    queryKey: marcasQueryKeys.creditos.custom("policy", id),
    endpoint: marcasEndpoints.creditos.policies.detail(id),
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useCreditPortfolio(filters: CreditPortfolioFilters) {
  return API.useQuery<CreditPortfolioPageResponse>({
    queryKey: marcasQueryKeys.creditos.custom("portfolio", filters),
    endpoint: marcasEndpoints.creditos.portfolio,
    params: { ...filters },
  });
}

export function useCreditPortfolioDetail(id: number) {
  return API.useQuery<CreditPortfolioDetail>({
    queryKey: marcasQueryKeys.creditos.custom("portfolio", "detail", id),
    endpoint: marcasEndpoints.creditos.portfolioDetail(id),
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useCreditOrderOptions(search = "") {
  const normalized = search.trim();

  return API.useQuery<OrderPageResponse>({
    queryKey: marcasQueryKeys.pedidos.custom(
      "credit-application-options",
      normalized,
    ),
    endpoint: marcasEndpoints.pedidos.root,
    params: {
      page: 1,
      limit: 100,
      search: normalized || undefined,
      estado: "PENDIENTE_VALIDACION",
      condicionPago: "CREDITO",
      soloAbiertos: true,
      sortBy: "creadoEn",
      sortDir: "desc",
    },
  });
}
