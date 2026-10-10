import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { getApiErrorMessage } from "@/lib/api-error";

import type { LoginPayload, LoginResponse } from "./auth.types";

/** Centraliza el envío y los errores; la UI valida y guarda la sesión. */
export function useLogin() {
  return API.useMutation<LoginResponse, LoginPayload>({
    method: "POST",
    endpoint: marcasEndpoints.auth.login,
    options: {
      onError: (error) =>
        toast.error(getApiErrorMessage(error, "No se pudo iniciar sesión.")),
    },
  });
}
