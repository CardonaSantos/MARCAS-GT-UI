import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";

import type {
  TransferDetail,
  TransferEventFilters,
  TransferEventPage,
  TransferListFilters,
  TransferOperationFilters,
  TransferOperationPage,
  TransferPage,
  TransferSummary,
  TransferSummaryFilters,
} from "./transfer.types";

export function useTransfers(filters: TransferListFilters) {
  return API.useQuery<TransferPage>({
    queryKey: marcasQueryKeys.transferencias.list(filters),
    endpoint: marcasEndpoints.transferencias.root,
    params: { ...filters },
  });
}

export function useTransferSummary(filters: TransferSummaryFilters) {
  return API.useQuery<TransferSummary>({
    queryKey: marcasQueryKeys.transferencias.summary(filters),
    endpoint: marcasEndpoints.transferencias.summary,
    params: { ...filters },
  });
}

export function useTransfer(id: number) {
  return API.useQuery<TransferDetail>({
    queryKey: marcasQueryKeys.transferencias.detail(id),
    endpoint: marcasEndpoints.transferencias.detail(id),
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useTransferEvents(
  id: number,
  filters: TransferEventFilters,
) {
  return API.useQuery<TransferEventPage>({
    queryKey: marcasQueryKeys.transferencias.custom(
      "detail",
      id,
      "events",
      filters,
    ),
    endpoint: marcasEndpoints.transferencias.events(id),
    params: { ...filters },
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useTransferOperations(
  id: number,
  filters: Omit<TransferOperationFilters, "transferenciaId">,
) {
  return API.useQuery<TransferOperationPage>({
    queryKey: marcasQueryKeys.transferencias.custom(
      "detail",
      id,
      "operations",
      filters,
    ),
    endpoint: marcasEndpoints.transferencias.transferOperations(id),
    params: { ...filters },
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useTransferOperationList(filters: TransferOperationFilters) {
  return API.useQuery<TransferOperationPage>({
    queryKey: marcasQueryKeys.transferencias.custom("operations", filters),
    endpoint: marcasEndpoints.transferencias.operations,
    params: { ...filters },
  });
}
