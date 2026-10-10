import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";

import type {
  ShipmentCandidateFilters,
  ShipmentCandidatePageResponse,
  ShipmentDetail,
  ShipmentEventPageResponse,
  ShipmentHistoryFilters,
  ShipmentIncidentFilters,
  ShipmentIncidentPageResponse,
  ShipmentListFilters,
  ShipmentPageResponse,
  ShipmentSummary,
  TransportCarrier,
  TransportCatalogFilters,
  TransportDriver,
  TransportOperationalReport,
  TransportRangeFilters,
  TransportVehicle,
} from "./transport.types";

export function useShipments(filters: ShipmentListFilters) {
  return API.useQuery<ShipmentPageResponse>({
    queryKey: marcasQueryKeys.transporte.list(filters),
    endpoint: marcasEndpoints.transporte.shipments.root,
    params: { ...filters },
  });
}

export function useShipmentCandidates(filters: ShipmentCandidateFilters) {
  return API.useQuery<ShipmentCandidatePageResponse>({
    queryKey: marcasQueryKeys.transporte.custom("candidates", filters),
    endpoint: marcasEndpoints.transporte.shipments.candidates,
    params: { ...filters },
  });
}

export function useTransportSummary(
  filters: TransportRangeFilters,
  enabled = true,
) {
  return API.useQuery<ShipmentSummary>({
    queryKey: marcasQueryKeys.transporte.summary(filters),
    endpoint: marcasEndpoints.transporte.shipments.summary,
    params: { ...filters },
    options: { enabled },
  });
}

export function useShipment(id: number) {
  return API.useQuery<ShipmentDetail>({
    queryKey: marcasQueryKeys.transporte.detail(id),
    endpoint: marcasEndpoints.transporte.shipments.detail(id),
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useShipmentEvents(
  id: number,
  filters: ShipmentHistoryFilters,
) {
  return API.useQuery<ShipmentEventPageResponse>({
    queryKey: marcasQueryKeys.transporte.custom(
      "detail",
      id,
      "events",
      filters,
    ),
    endpoint: marcasEndpoints.transporte.shipments.events(id),
    params: { ...filters },
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useShipmentIncidents(
  id: number,
  filters: ShipmentIncidentFilters,
) {
  return API.useQuery<ShipmentIncidentPageResponse>({
    queryKey: marcasQueryKeys.transporte.custom(
      "detail",
      id,
      "incidents",
      filters,
    ),
    endpoint: marcasEndpoints.transporte.shipments.incidents(id),
    params: { ...filters },
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useTransportOperationalReport(
  filters: TransportRangeFilters,
) {
  return API.useQuery<TransportOperationalReport>({
    queryKey: marcasQueryKeys.transporte.custom("operational-report", filters),
    endpoint: marcasEndpoints.transporte.shipments.operationalReport,
    params: { ...filters },
  });
}

export function useTransportCarriers(
  filters: TransportCatalogFilters = {},
  enabled = true,
) {
  return API.useQuery<TransportCarrier[]>({
    queryKey: marcasQueryKeys.transporte.custom("carriers", filters),
    endpoint: marcasEndpoints.transporte.carriers.root,
    params: {
      search: filters.search,
      tipo: filters.tipo,
    },
    options: { enabled },
  });
}

export function useTransportVehicles(
  filters: TransportCatalogFilters = {},
  enabled = true,
) {
  return API.useQuery<TransportVehicle[]>({
    queryKey: marcasQueryKeys.transporte.custom("vehicles", filters),
    endpoint: marcasEndpoints.transporte.vehicles.root,
    params: {
      search: filters.search,
      estado: filters.estado,
    },
    options: { enabled },
  });
}

export function useTransportDrivers(
  filters: TransportCatalogFilters = {},
  enabled = true,
) {
  return API.useQuery<TransportDriver[]>({
    queryKey: marcasQueryKeys.transporte.custom("drivers", filters),
    endpoint: marcasEndpoints.transporte.drivers.root,
    params: {
      search: filters.search,
      estado: filters.estado,
    },
    options: { enabled },
  });
}
