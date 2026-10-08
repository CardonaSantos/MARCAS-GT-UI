import { useInfiniteQuery } from "@tanstack/react-query";
import { API, marcasApi } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";
import type {
  TrackingAttendanceDetail, TrackingHistoryFilters, TrackingHistoryItem,
  TrackingLocation, TrackingPage, TrackingRealtimeView,
} from "./tracking.types";

export const trackingRealtimeKey = marcasQueryKeys.tracking.custom("realtime");
export const TRACKING_LOCATION_PAGE_SIZE = 1000;

export function useTrackingRealtime() {
  return API.useQuery<TrackingRealtimeView[]>({
    queryKey: trackingRealtimeKey,
    endpoint: marcasEndpoints.tracking.realtime,
    options: { refetchInterval: 60_000, staleTime: 15_000 },
  });
}

export function useTrackingHistory(filters: TrackingHistoryFilters) {
  return API.useQuery<TrackingPage<TrackingHistoryItem>>({
    queryKey: marcasQueryKeys.tracking.list(filters),
    endpoint: marcasEndpoints.tracking.history,
    params: { ...filters },
    options: { staleTime: 15_000 },
  });
}

export function useTrackingAttendance(asistenciaId: number) {
  return API.useQuery<TrackingAttendanceDetail>({
    queryKey: marcasQueryKeys.tracking.detail(asistenciaId),
    endpoint: marcasEndpoints.tracking.attendance(asistenciaId),
    options: { enabled: Number.isInteger(asistenciaId) && asistenciaId > 0 },
  });
}

export function useTrackingLocations(asistenciaId: number, sesionTrackingId?: number) {
  return useInfiniteQuery({
    queryKey: marcasQueryKeys.tracking.custom("attendance", asistenciaId, "locations", sesionTrackingId ?? null),
    enabled: Number.isInteger(asistenciaId) && asistenciaId > 0,
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      marcasApi.get<TrackingPage<TrackingLocation>>(
        marcasEndpoints.tracking.attendanceLocations(asistenciaId),
        { params: { page: pageParam, limit: TRACKING_LOCATION_PAGE_SIZE, sesionTrackingId }, signal },
      ),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
