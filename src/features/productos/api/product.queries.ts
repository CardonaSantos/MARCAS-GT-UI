import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";

import type { ProductCategory } from "./product.types";

export function useProductCategories() {
  return API.useQuery<ProductCategory[]>({
    queryKey: marcasQueryKeys.categorias.list(),
    endpoint: marcasEndpoints.categories.root,
    options: { staleTime: 5 * 60_000 },
  });
}
