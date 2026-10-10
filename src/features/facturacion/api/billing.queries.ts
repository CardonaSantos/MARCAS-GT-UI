import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";

import type {
  BillingCandidatePageResponse,
  BillingOperationalReport,
  BillingRangeFilters,
  BillingSummary,
  CandidateFilters,
  FelOperationPageResponse,
  InvoiceDetail,
  InvoiceEventPageResponse,
  InvoiceListFilters,
  InvoicePageResponse,
  ReceivableFilters,
  ReceivablePageResponse,
  ReceivableSummary,
} from "./billing.types";

export function useInvoices(filters: InvoiceListFilters) {
  return API.useQuery<InvoicePageResponse>({
    queryKey: marcasQueryKeys.facturacion.list(filters),
    endpoint: marcasEndpoints.facturacion.invoices.root,
    params: { ...filters },
  });
}

export function useBillingCandidates(filters: CandidateFilters) {
  return API.useQuery<BillingCandidatePageResponse>({
    queryKey: marcasQueryKeys.facturacion.custom("candidates", filters),
    endpoint: marcasEndpoints.facturacion.invoices.candidates,
    params: { ...filters },
  });
}

export function useInvoice(id: number) {
  return API.useQuery<InvoiceDetail>({
    queryKey: marcasQueryKeys.facturacion.detail(id),
    endpoint: marcasEndpoints.facturacion.invoices.detail(id),
    options: { enabled: Number.isInteger(id) && id > 0 },
  });
}

export function useInvoiceEvents(id: number, page = 1, limit = 50) {
  return API.useQuery<InvoiceEventPageResponse>({
    queryKey: marcasQueryKeys.facturacion.custom("detail", id, "events", page, limit),
    endpoint: marcasEndpoints.facturacion.invoices.events(id),
    params: { page, limit },
    options: { enabled: Number.isInteger(id) && id > 0 },
  });
}

export function useFelOperations(id: number, page = 1, limit = 50) {
  return API.useQuery<FelOperationPageResponse>({
    queryKey: marcasQueryKeys.facturacion.custom("detail", id, "fel-operations", page, limit),
    endpoint: marcasEndpoints.facturacion.invoices.felOperations(id),
    params: { page, limit },
    options: { enabled: Number.isInteger(id) && id > 0 },
  });
}

export function useBillingSummary(filters: BillingRangeFilters, enabled = true) {
  return API.useQuery<BillingSummary>({
    queryKey: marcasQueryKeys.facturacion.summary(filters),
    endpoint: marcasEndpoints.facturacion.invoices.summary,
    params: { ...filters },
    options: { enabled },
  });
}

export function useBillingOperationalReport(filters: BillingRangeFilters) {
  return API.useQuery<BillingOperationalReport>({
    queryKey: marcasQueryKeys.facturacion.custom("operational-report", filters),
    endpoint: marcasEndpoints.facturacion.invoices.operationalReport,
    params: { ...filters },
  });
}

export function useReceivables(filters: ReceivableFilters) {
  return API.useQuery<ReceivablePageResponse>({
    queryKey: marcasQueryKeys.facturacion.custom("receivables", filters),
    endpoint: marcasEndpoints.facturacion.receivables.root,
    params: { ...filters },
  });
}

export function useReceivableSummary(filters: BillingRangeFilters) {
  return API.useQuery<ReceivableSummary>({
    queryKey: marcasQueryKeys.facturacion.custom("receivables-summary", filters),
    endpoint: marcasEndpoints.facturacion.receivables.summary,
    params: { ...filters },
  });
}
