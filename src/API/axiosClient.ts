import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Metadata interna utilizada únicamente
 * para medir la duración de la petición.
 */
declare module "axios" {
  interface AxiosRequestConfig {
    metadata?: {
      start: number;
    };
  }

  interface InternalAxiosRequestConfig {
    metadata?: {
      start: number;
    };
  }
}

/**
 * Devuelve únicamente el endpoint relativo.
 *
 * Nunca devuelve:
 * - protocolo
 * - dominio
 * - IP
 * - puerto del servidor
 * - baseURL
 *
 * También elimina query params para evitar
 * exponer información enviada por URL.
 *
 * Ejemplos:
 *
 * /mikro-tik/5
 * /pppoe-cuentas/15/suspender
 * /cliente-instalaciones
 */
function safeEndpoint(cfg?: AxiosRequestConfig): string {
  const rawUrl = cfg?.url?.trim();

  if (!rawUrl) {
    return "[endpoint desconocido]";
  }

  try {
    /**
     * Si por alguna razón Axios recibe una URL absoluta,
     * usamos un origen ficticio y recuperamos únicamente
     * pathname.
     */
    const parsed = new URL(rawUrl, "http://local.invalid");

    return parsed.pathname || "/";
  } catch {
    /**
     * Fallback:
     * eliminamos query string manualmente.
     */
    return rawUrl.split("?")[0] || "[endpoint desconocido]";
  }
}

/**
 * Tiempo actual para medir requests.
 */
function nowMs(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

/**
 * Calcula el tiempo de una petición.
 */
function getElapsedMs(cfg?: AxiosRequestConfig): number | undefined {
  const start = cfg?.metadata?.start;

  if (typeof start !== "number") {
    return undefined;
  }

  return Math.round(nowMs() - start);
}

/**
 * Convierte el método HTTP a una
 * representación segura y consistente.
 */
function getMethod(cfg?: AxiosRequestConfig): string {
  return String(cfg?.method ?? "GET").toUpperCase();
}

function attachLogging(client: AxiosInstance, name: string) {
  /**
   * ============================================================
   * REQUEST
   * ============================================================
   */
  client.interceptors.request.use((cfg) => {
    cfg.metadata = {
      start: nowMs(),
    };

    const method = getMethod(cfg);

    const endpoint = safeEndpoint(cfg);

    /**
     * No registramos:
     *
     * - baseURL;
     * - URL completa;
     * - headers;
     * - Authorization;
     * - cookies;
     * - body;
     * - parámetros.
     *
     * Así evitamos exponer credenciales,
     * tokens o datos personales accidentalmente.
     */
    console.debug(`➡️ [${name}] ${method} ${endpoint}`);

    return cfg;
  });

  /**
   * ============================================================
   * RESPONSE OK
   * ============================================================
   */
  client.interceptors.response.use(
    (res: AxiosResponse) => {
      const method = getMethod(res.config);

      const endpoint = safeEndpoint(res.config);

      const ms = getElapsedMs(res.config);

      console.debug(
        [
          `✅ [${name}]`,
          `${res.status}`,
          method,
          endpoint,
          ms !== undefined ? `(${ms} ms)` : null,
        ]
          .filter(Boolean)
          .join(" "),
      );

      /**
       * No registramos response.data globalmente.
       *
       * Algunas respuestas pueden contener:
       * - datos personales;
       * - tokens;
       * - credenciales;
       * - información técnica sensible.
       */

      return res;
    },

    /**
     * ==========================================================
     * RESPONSE ERROR
     * ==========================================================
     */
    (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        console.groupCollapsed(`⛔ [${name}] Error no Axios`);

        console.error(error);

        console.groupEnd();

        return Promise.reject(error);
      }

      const cfg = error.config as AxiosRequestConfig | undefined;

      const method = getMethod(cfg);

      const endpoint = safeEndpoint(cfg);

      const ms = getElapsedMs(cfg);

      const status = error.response?.status;

      console.groupCollapsed(
        [
          `⛔ [${name}]`,
          status ? `HTTP ${status}` : "Error de red",
          method,
          endpoint,
          ms !== undefined ? `(${ms} ms)` : null,
        ]
          .filter(Boolean)
          .join(" "),
      );

      console.error("message:", error.message);

      if (error.code) {
        console.error("code:", error.code);
      }

      console.error("status:", status ?? "(sin status)");

      /**
       * Conservamos el body del ERROR porque NestJS
       * normalmente devuelve algo como:
       *
       * {
       *   statusCode: 409,
       *   message: "...",
       *   error: "Conflict"
       * }
       *
       * Esto es lo que necesitamos para diagnosticar.
       */
      if (error.response?.data !== undefined) {
        console.error("response:", error.response.data);
      }

      console.groupEnd();

      return Promise.reject(error);
    },
  );
}

/**
 * ============================================================
 * API CRM
 * ============================================================
 */

export const crmApi = axios.create({
  baseURL: import.meta.env.VITE_CRM_API_URL,

  withCredentials: false,

  timeout: 10_000,

  headers: {
    Accept: "application/json",
  },
});

attachLogging(crmApi, "CRM");
