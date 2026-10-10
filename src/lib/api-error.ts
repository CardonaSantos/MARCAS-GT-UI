import axios from "axios";

import { ApiError } from "@/API/createApiClient";

type ApiErrorBody = {
  message?: string | string[];
  error?: string;
};

function normalizeMessage(message: ApiErrorBody["message"]) {
  if (Array.isArray(message)) {
    return message.filter(Boolean).join(", ");
  }

  return typeof message === "string" ? message.trim() : "";
}

function getMessageFromBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return "";
  }

  const errorBody = body as ApiErrorBody;
  const message = normalizeMessage(errorBody.message);

  if (message) {
    return message;
  }

  return typeof errorBody.error === "string" ? errorBody.error.trim() : "";
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Ocurrió un error al procesar la solicitud",
) {
  if (error instanceof ApiError) {
    return getMessageFromBody(error.data) || error.message || fallback;
  }

  // Compatibilidad temporal con las pantallas legacy que todavía usan Axios.
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const apiMessage = getMessageFromBody(error.response?.data);

    if (apiMessage) {
      return apiMessage;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
