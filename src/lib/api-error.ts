import axios from "axios";

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

export function getApiErrorMessage(
  error: unknown,
  fallback = "Ocurrió un error al procesar la solicitud",
) {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const apiMessage = normalizeMessage(error.response?.data?.message);

    if (apiMessage) {
      return apiMessage;
    }

    const apiError = error.response?.data?.error;

    if (typeof apiError === "string" && apiError.trim()) {
      return apiError.trim();
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
