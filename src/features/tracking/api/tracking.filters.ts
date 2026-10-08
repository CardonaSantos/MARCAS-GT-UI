import type {
  TrackingSessionStatus,
  TrackingHistoryFilters,
} from "./tracking.types";

export interface TrackingHistoryFiltersState {
  usuarioId: number | null;
  estadoSesion: TrackingSessionStatus | null;
  fecha: {
    start: string | null;
    end: string | null;
  };
}

export const TRACKING_HISTORY_FILTERS_DEFAULT: TrackingHistoryFiltersState = {
  usuarioId: null,
  estadoSesion: null,
  fecha: {
    start: null,
    end: null,
  },
};

export function toTrackingHistoryQueryParams(params: {
  pageIndex: number;
  pageSize: number;
  search: string;
  filters: TrackingHistoryFiltersState;
}): TrackingHistoryFilters {
  const search = params.search.trim().slice(0, 150);

  return {
    page: params.pageIndex + 1,
    limit: params.pageSize,
    ...(search ? { search } : {}),
    ...(params.filters.usuarioId
      ? { usuarioId: params.filters.usuarioId }
      : {}),
    ...(params.filters.estadoSesion
      ? { estadoSesion: params.filters.estadoSesion }
      : {}),
    ...(params.filters.fecha.start
      ? { fechaDesde: params.filters.fecha.start }
      : {}),
    ...(params.filters.fecha.end
      ? { fechaHasta: params.filters.fecha.end }
      : {}),
  };
}
