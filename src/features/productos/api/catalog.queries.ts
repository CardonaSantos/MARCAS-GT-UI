import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";
import type { CatalogProductDetail, ProductCatalogFilters, ProductCatalogPage } from "./catalog.types";

export function useProductCatalog(filters: ProductCatalogFilters) {
  return API.useQuery<ProductCatalogPage>({
    queryKey: marcasQueryKeys.productos.list(filters),
    endpoint: marcasEndpoints.products.catalog,
    params: { ...filters },
  });
}
export function useCatalogProduct(id: number | null) {
  return API.useQuery<CatalogProductDetail>({
    queryKey: marcasQueryKeys.productos.detail(id ?? 0),
    endpoint: marcasEndpoints.products.catalogDetail(id ?? 0),
    options: { enabled: Number.isInteger(id) && Number(id) > 0 },
  });
}
