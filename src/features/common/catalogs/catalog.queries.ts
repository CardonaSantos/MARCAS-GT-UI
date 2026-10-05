import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";

import type {
  LegacyProductRecord,
  LegacyProviderRecord,
  LegacyUserRecord,
  ProductSelectable,
  ProviderSelectable,
  UserSelectable,
} from "./catalog.types";

export function useProductSelectables(enabled = true) {
  return API.useQuery<
    LegacyProductRecord[],
    Error,
    ProductSelectable[]
  >({
    queryKey: marcasQueryKeys.productos.custom("selectables"),
    endpoint: marcasEndpoints.products.inventoryCatalog,
    options: {
      enabled,
      staleTime: 5 * 60_000,
      select: (products) =>
        products
          .map((product) => ({
            id: product.id,
            codigo: product.codigoProducto,
            nombre: product.nombre,
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    },
  });
}

export function useProviderSelectables(enabled = true) {
  return API.useQuery<
    LegacyProviderRecord[],
    Error,
    ProviderSelectable[]
  >({
    queryKey: marcasQueryKeys.proveedores.custom("selectables"),
    endpoint: marcasEndpoints.providers.root,
    options: {
      enabled,
      staleTime: 5 * 60_000,
      select: (providers) =>
        providers
          .filter((provider) => provider.activo)
          .map((provider) => ({
            id: provider.id,
            nombre: provider.nombre,
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    },
  });
}

export function useUserSelectables(enabled = true) {
  return API.useQuery<LegacyUserRecord[], Error, UserSelectable[]>({
    queryKey: marcasQueryKeys.usuarios.custom("selectables"),
    endpoint: marcasEndpoints.users.root,
    options: {
      enabled,
      staleTime: 5 * 60_000,
      select: (users) =>
        users
          .filter((user) => user.activo)
          .map((user) => ({
            id: user.id,
            nombre: user.nombre,
            correo: user.correo,
            rol: user.rol,
            activo: user.activo,
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    },
  });
}
