export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiQueryPrimitive =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;

export type ApiQueryValue =
  | ApiQueryPrimitive
  | readonly ApiQueryPrimitive[];

export type ApiQueryParams = Record<string, ApiQueryValue>;

export type ApiRequestConfig = {
  params?: ApiQueryParams;
  headers?: HeadersInit;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
};

export type ApiClientConfig = {
  baseURL: string;
  getToken?: () => string | null | undefined;
};

type ApiErrorPayload = {
  message?: string | string[];
  error?: string;
  [key: string]: unknown;
};

export class ApiError<TData = unknown> extends Error {
  readonly status: number;
  readonly data: TData | null;

  constructor(message: string, status: number, data: TData | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function normalizeBaseUrl(baseURL: string) {
  const normalized = baseURL.trim().replace(/\/+$/, "");

  if (!normalized) {
    throw new Error("VITE_API_URL no está configurada.");
  }

  return normalized;
}

function normalizeEndpoint(endpoint: string) {
  return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
}

function stringifyQueryValue(value: Exclude<ApiQueryPrimitive, null | undefined>) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function buildUrl(
  baseURL: string,
  endpoint: string,
  params?: ApiQueryParams,
) {
  const url = new URL(`${baseURL}${normalizeEndpoint(endpoint)}`);

  if (!params) {
    return url.toString();
  }

  Object.entries(params).forEach(([key, rawValue]) => {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];

    values.forEach((value) => {
      if (value === undefined || value === null || value === "") {
        return;
      }

      url.searchParams.append(key, stringifyQueryValue(value));
    });
  });

  return url.toString();
}

function isNativeBody(body: unknown): body is BodyInit {
  return (
    typeof body === "string" ||
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof URLSearchParams ||
    body instanceof ArrayBuffer
  );
}

function resolveErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") {
    if (typeof payload === "string" && payload.trim()) {
      return payload.trim();
    }

    return fallback;
  }

  const errorPayload = payload as ApiErrorPayload;
  const message = errorPayload.message;

  if (Array.isArray(message)) {
    const normalized = message.filter(Boolean).join(", ").trim();

    if (normalized) {
      return normalized;
    }
  }

  if (typeof message === "string" && message.trim()) {
    return message.trim();
  }

  if (typeof errorPayload.error === "string" && errorPayload.error.trim()) {
    return errorPayload.error.trim();
  }

  return fallback;
}

async function parseResponse(response: Response) {
  if (response.status === 204) {
    return undefined;
  }

  const text = await response.text();

  if (!text) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("json")) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  return text;
}

export type ApiClient = ReturnType<typeof createApiClient>;

export function createApiClient({ baseURL, getToken }: ApiClientConfig) {
  const normalizedBaseUrl = normalizeBaseUrl(baseURL);

  async function request<TResponse, TBody = unknown>(
    method: HttpMethod,
    endpoint: string,
    body?: TBody,
    config: ApiRequestConfig = {},
  ): Promise<TResponse> {
    const headers = new Headers(config.headers);
    headers.set("Accept", "application/json");

    const token = getToken?.();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      headers.delete("Authorization");
    }

    let requestBody: BodyInit | undefined;

    if (body !== undefined && body !== null && method !== "GET") {
      if (isNativeBody(body)) {
        requestBody = body;
      } else {
        headers.set("Content-Type", "application/json");
        requestBody = JSON.stringify(body);
      }
    }

    let response: Response;

    try {
      response = await fetch(
        buildUrl(normalizedBaseUrl, endpoint, config.params),
        {
          method,
          headers,
          body: requestBody,
          signal: config.signal,
          credentials: config.credentials,
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      throw new Error("No fue posible conectar con el servidor.");
    }

    const payload = await parseResponse(response);

    if (!response.ok) {
      throw new ApiError(
        resolveErrorMessage(
          payload,
          response.statusText || "La solicitud no pudo completarse.",
        ),
        response.status,
        payload,
      );
    }

    return payload as TResponse;
  }

  return {
    request,

    get<TResponse>(endpoint: string, config?: ApiRequestConfig) {
      return request<TResponse>("GET", endpoint, undefined, config);
    },

    post<TResponse, TBody = unknown>(
      endpoint: string,
      body?: TBody,
      config?: ApiRequestConfig,
    ) {
      return request<TResponse, TBody>("POST", endpoint, body, config);
    },

    put<TResponse, TBody = unknown>(
      endpoint: string,
      body?: TBody,
      config?: ApiRequestConfig,
    ) {
      return request<TResponse, TBody>("PUT", endpoint, body, config);
    },

    patch<TResponse, TBody = unknown>(
      endpoint: string,
      body?: TBody,
      config?: ApiRequestConfig,
    ) {
      return request<TResponse, TBody>("PATCH", endpoint, body, config);
    },

    delete<TResponse, TBody = unknown>(
      endpoint: string,
      body?: TBody,
      config?: ApiRequestConfig,
    ) {
      return request<TResponse, TBody>("DELETE", endpoint, body, config);
    },
  };
}
