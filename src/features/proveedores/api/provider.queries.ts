import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";

import type { Provider } from "./provider.types";

export function useProviders() {
  return API.useQuery<Provider[]>({
    queryKey: marcasQueryKeys.proveedores.list(),
    endpoint: marcasEndpoints.providers.root,
    options: { staleTime: 60_000 },
  });
}
