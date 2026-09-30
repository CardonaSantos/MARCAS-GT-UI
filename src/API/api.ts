import { createApiClient } from "./createApiClient";
import { createApiHooks } from "./createApiHooks";

const baseUrl = import.meta.env.VITE_API_URL;

export const marcasApi = createApiClient(baseUrl);
export const API = createApiHooks(marcasApi);
