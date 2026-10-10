import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";

import type {
  CustomerSelectable,
  LegacyCustomerRecord,
  LegacyProductRecord,
  LegacyProviderRecord,
  LegacyUserRecord,
  LegacyVisitRecord,
  ProductSelectable,
  ProviderSelectable,
  UserSelectable,
  VisitSelectable,
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
            precio: Number(product.precio).toFixed(2),
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
    endpoint: marcasEndpoints.users.selectables,
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
            empresaId: user.empresaId,
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    },
  });
}

export function useCustomerSelectables(enabled = true) {
  return API.useQuery<
    LegacyCustomerRecord[],
    Error,
    CustomerSelectable[]
  >({
    queryKey: marcasQueryKeys.clientes.custom("selectables"),
    endpoint: marcasEndpoints.customers.simple,
    options: {
      enabled,
      staleTime: 5 * 60_000,
      select: (customers) =>
        customers
          .map((customer) => ({
            id: customer.id,
            nombre: customer.nombre,
            apellido: customer.apellido ?? null,
            nombreCompleto: [customer.nombre, customer.apellido]
              .filter(Boolean)
              .join(" "),
            telefono: customer.telefono,
            correo: customer.correo ?? null,
            direccion: customer.direccion,
          }))
          .sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto, "es")),
    },
  });
}

export function useVisitSelectables(
  filters: {
    clienteId?: number | null;
    vendedorId?: number | null;
  },
  enabled = true,
) {
  return API.useQuery<LegacyVisitRecord[], Error, VisitSelectable[]>({
    queryKey: marcasQueryKeys.visitas.custom("selectables", filters),
    endpoint: marcasEndpoints.visits.records,
    options: {
      enabled,
      staleTime: 60_000,
      select: (visits) =>
        visits
          .filter(
            (visit) =>
              (!filters.clienteId || visit.clienteId === filters.clienteId) &&
              (!filters.vendedorId || visit.usuarioId === filters.vendedorId),
          )
          .map((visit) => ({
            id: visit.id,
            clienteId: visit.clienteId,
            usuarioId: visit.usuarioId,
            estado: visit.estadoVisita,
            inicio: visit.inicio,
            fin: visit.fin,
            cliente: visit.cliente,
            vendedor: visit.vendedor,
          }))
          .sort(
            (a, b) =>
              new Date(b.inicio).getTime() - new Date(a.inicio).getTime(),
          ),
    },
  });
}
