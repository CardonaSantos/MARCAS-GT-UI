import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";
import type { DashboardFilters, DashboardResponse, DashboardView } from "./dashboard.types";

const refreshMilliseconds: Record<DashboardView, number> = {
  resumen: 60_000, alertas: 60_000, agenda: 90_000,
  graficos: 600_000, actividad: 120_000, live: 25_000,
};

export function useAdminDashboard(view: DashboardView, filters: DashboardFilters) {
  return API.useQuery<DashboardResponse>({
    queryKey: marcasQueryKeys.dashboard.custom("admin", view, filters),
    endpoint: marcasEndpoints.dashboard.admin[view],
    params: { ...filters },
    options: {
      staleTime: Math.min(refreshMilliseconds[view] / 2, 60_000),
      refetchInterval: refreshMilliseconds[view],
      refetchOnWindowFocus: false,
      retry: 1,
    },
  });
}
