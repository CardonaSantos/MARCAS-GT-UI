import { toast } from "sonner";
import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
  ChangePasswordPayload, CreateUserPayload, CreateUserResponse,
  SystemUser, UpdateUserPayload,
} from "./user.types";

const invalidate = [marcasQueryKeys.usuarios.all];

export function useCreateUser() {
  return API.useMutation<CreateUserResponse, CreateUserPayload>({
    method: "POST",
    endpoint: marcasEndpoints.users.root,
    invalidateKeys: invalidate,
    options: {
      onSuccess: () => toast.success("Usuario registrado correctamente."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    },
  });
}

export function useUpdateSystemUser() {
  return API.useMutation<SystemUser, { id: number; payload: UpdateUserPayload }>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.users.detail(id),
    body: ({ payload }) => payload,
    invalidateKeys: invalidate,
    options: {
      onSuccess: () => toast.success("Usuario actualizado correctamente."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    },
  });
}

export function useSetUserActive() {
  return API.useMutation<SystemUser, { id: number; activo: boolean }>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.users.detail(id),
    body: ({ activo }) => ({ activo }),
    invalidateKeys: invalidate,
    options: {
      onSuccess: (_data, variables) => toast.success(
        variables.activo ? "Usuario reactivado correctamente." : "Usuario desactivado correctamente.",
      ),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    },
  });
}

export function useChangeUserPassword() {
  return API.useMutation<{ message: string }, { id: number; payload: ChangePasswordPayload }>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.users.changePassword(id),
    body: ({ payload }) => payload,
    options: {
      onSuccess: () => toast.success("Contraseña actualizada correctamente."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    },
  });
}
