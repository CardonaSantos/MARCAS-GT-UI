import type { QueryKey } from "@tanstack/react-query";

export type QueryEntityId = number | string;

export function createQueryKeys(scope: string) {
  const all = ["marcas", scope] as const;

  return {
    all,

    lists: () => [...all, "list"] as const,
    list: (filters?: unknown) => [...all, "list", filters ?? null] as const,

    details: () => [...all, "detail"] as const,
    detail: (id: QueryEntityId) => [...all, "detail", id] as const,

    summary: (filters?: unknown) =>
      [...all, "summary", filters ?? null] as const,

    custom: (...parts: readonly unknown[]): QueryKey => [...all, ...parts],
  };
}

export const marcasQueryKeys = {
  bodegas: createQueryKeys("bodegas"),
  inventario: createQueryKeys("inventario"),
  requisiciones: createQueryKeys("requisiciones"),
  transferencias: createQueryKeys("transferencias"),
  pedidos: createQueryKeys("pedidos"),
  creditos: createQueryKeys("creditos"),
  despachos: createQueryKeys("despachos"),
  transporte: createQueryKeys("transporte"),
  entregas: createQueryKeys("entregas"),
  facturacion: createQueryKeys("facturacion"),
  pagos: createQueryKeys("pagos"),
  tracking: createQueryKeys("tracking"),
} as const;
