import { createApiClient } from "./createApiClient";
import { createApiHooks } from "./useQueryHooks";
const baseUrl = import.meta.env.VITE_MARCAS_URL;
const crmClient = createApiClient(baseUrl);

export const API = createApiHooks(crmClient);
