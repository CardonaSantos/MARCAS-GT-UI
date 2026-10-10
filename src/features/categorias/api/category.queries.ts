import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";

import type { Category } from "./category.types";

/**
 * Misma ruta y queryKey del selector de categorías en Crear producto:
 * una edición se refleja en ambos módulos sin refrescar manualmente.
 */
export function useCategories() {
  return API.useQuery<Category[]>({
    queryKey: marcasQueryKeys.categorias.list(),
    endpoint: marcasEndpoints.categories.root,
    options: { staleTime: 5 * 60_000 },
  });
}
