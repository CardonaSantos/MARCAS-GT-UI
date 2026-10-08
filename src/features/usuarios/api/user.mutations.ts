import { toast } from "sonner";
import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";
import { getApiErrorMessage } from "@/lib/api-error";
import type { CreateUserPayload, CreateUserResponse } from "./user.types";

/** La respuesta genera un token del nuevo usuario. NO sustituir la sesión ADMIN. */
export function useCreateUser() {
  return API.useMutation<CreateUserResponse, CreateUserPayload>({
    method: "POST",
    endpoint: marcasEndpoints.users.root,
    invalidateKeys: [marcasQueryKeys.usuarios.all],
    options: {
      onSuccess: () => toast.success("Usuario registrado correctamente."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    },
  });
}
