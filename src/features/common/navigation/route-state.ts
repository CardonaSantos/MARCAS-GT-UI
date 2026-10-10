export interface ReturnRouteState {
  from?: string;
  listFrom?: string;
}

export function getReturnRoute(
  state: unknown,
  fallback: string,
) {
  const routeState = state as ReturnRouteState | null;
  return routeState?.from ?? fallback;
}

export function getListReturnRoute(
  state: unknown,
  fallback: string,
) {
  const routeState = state as ReturnRouteState | null;
  return routeState?.listFrom ?? fallback;
}
