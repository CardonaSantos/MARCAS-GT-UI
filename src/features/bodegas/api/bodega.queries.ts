import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";

import type {
  BodegaDetail,
  BodegaEventFilters,
  BodegaEventsResponse,
  BodegaListFilters,
  BodegaListResponse,
  BodegaOverview,
  BodegaSelectable,
  BodegaSelectFilters,
  LegacyUserListItem,
} from "./bodega.types";

export function useBodegas(filters: BodegaListFilters) {
  return API.useQuery<BodegaListResponse>({
    queryKey: marcasQueryKeys.bodegas.list(filters),
    endpoint: marcasEndpoints.bodegas.root,
    params: filters,
  });
}

export function useBodegaOverview(enabled = true) {
  return API.useQuery<BodegaOverview>({
    queryKey: marcasQueryKeys.bodegas.custom("overview"),
    endpoint: marcasEndpoints.bodegas.summary,
    options: { enabled },
  });
}

export function useBodega(id: number) {
  return API.useQuery<BodegaDetail>({
    queryKey: marcasQueryKeys.bodegas.detail(id),
    endpoint: marcasEndpoints.bodegas.detail(id),
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function usePrincipalBodega() {
  return API.useQuery<BodegaDetail | null>({
    queryKey: marcasQueryKeys.bodegas.custom("principal"),
    endpoint: marcasEndpoints.bodegas.principal,
  });
}

export function useBodegaEvents(id: number, filters: BodegaEventFilters) {
  return API.useQuery<BodegaEventsResponse>({
    queryKey: marcasQueryKeys.bodegas.custom(
      "detail",
      id,
      "events",
      filters,
    ),
    endpoint: marcasEndpoints.bodegas.events(id),
    params: filters,
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useBodegaSelectables(filters: BodegaSelectFilters = {}) {
  return API.useQuery<BodegaSelectable[]>({
    queryKey: marcasQueryKeys.bodegas.custom("selectables", filters),
    endpoint: marcasEndpoints.bodegas.selectables,
    params: filters,
  });
}

export function useBodegaResponsibleOptions(enabled = true) {
  return API.useQuery<LegacyUserListItem[], Error, LegacyUserListItem[]>({
    queryKey: marcasQueryKeys.bodegas.custom("responsible-users"),
    endpoint: marcasEndpoints.users.root,
    options: {
      enabled,
      select: (users) =>
        users
          .filter(
            (user) =>
              user.activo &&
              (user.rol === "ADMIN" || user.rol === "BODEGA"),
          )
          .sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    },
  });
}
