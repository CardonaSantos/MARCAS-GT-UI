import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";

import type {
  OrderDetail,
  OrderEventFilters,
  OrderEventPageResponse,
  OrderListFilters,
  OrderPageResponse,
  OrderSummary,
  OrderSummaryFilters,
} from "./order.types";

export function useOrders(filters: OrderListFilters) {
  return API.useQuery<OrderPageResponse>({
    queryKey: marcasQueryKeys.pedidos.list(filters),
    endpoint: marcasEndpoints.pedidos.root,
    params: { ...filters },
  });
}

export function useOrderSummary(
  filters: OrderSummaryFilters,
  enabled = true,
) {
  return API.useQuery<OrderSummary>({
    queryKey: marcasQueryKeys.pedidos.summary(filters),
    endpoint: marcasEndpoints.pedidos.summary,
    params: { ...filters },
    options: { enabled },
  });
}

export function useOrder(id: number) {
  return API.useQuery<OrderDetail>({
    queryKey: marcasQueryKeys.pedidos.detail(id),
    endpoint: marcasEndpoints.pedidos.detail(id),
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}

export function useOrderEvents(id: number, filters: OrderEventFilters) {
  return API.useQuery<OrderEventPageResponse>({
    queryKey: marcasQueryKeys.pedidos.custom("detail", id, "events", filters),
    endpoint: marcasEndpoints.pedidos.events(id),
    params: { ...filters },
    options: {
      enabled: Number.isInteger(id) && id > 0,
    },
  });
}
