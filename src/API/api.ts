import { useStore } from "@/Context/ContextSucursal";

import { createApiClient } from "./createApiClient";
import { createApiHooks } from "./createApiHooks";

const baseURL = import.meta.env.VITE_API_URL?.trim();

if (!baseURL) {
  throw new Error("VITE_API_URL no está configurada.");
}

export const marcasApi = createApiClient({
  baseURL,
  getToken: () => useStore.getState().authToken,
});

/**
 * API es la única fachada de TanStack Query para los módulos nuevos.
 *
 * Ejemplos:
 * API.useQuery(...)
 * API.useMutation(...)
 * API.useInvalidateQueries()
 */
export const API = createApiHooks(marcasApi);
