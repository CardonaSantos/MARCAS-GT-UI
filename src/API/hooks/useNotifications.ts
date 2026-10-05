import type { QueryKey } from "@tanstack/react-query";

import { API } from "../api";
import { marcasEndpoints } from "../routes/endpoints";

export interface MarcasNotification {
  id: number;
  mensaje: string;
  leido: boolean;
  remitenteId?: number;
  creadoEn: string | Date;
  targetUserId: number;
}

export const notificationKeys = {
  all: ["marcas", "notifications"] as const,
  byUser: (userId: number) =>
    [...notificationKeys.all, "user", userId] as const,
};

function notificationInvalidationKeys(userId?: number | null): QueryKey[] {
  return userId ? [notificationKeys.byUser(userId)] : [];
}

export function useNotifications(userId?: number | null) {
  return API.useQuery<MarcasNotification[]>({
    queryKey: userId
      ? notificationKeys.byUser(userId)
      : [...notificationKeys.all, "anonymous"],
    endpoint: marcasEndpoints.notifications.forAdmin(userId ?? 0),
    options: {
      enabled: Boolean(userId),
    },
  });
}

export function useMarkNotificationAsRead(userId?: number | null) {
  return API.useMutation<void, { notificationId: number }>({
    method: "PATCH",
    endpoint: ({ notificationId }) => {
      if (!userId) {
        throw new Error("No hay un usuario autenticado");
      }

      return marcasEndpoints.notifications.markAsRead(notificationId);
    },
    body: () => ({ usuarioId: userId }),
    invalidateKeys: notificationInvalidationKeys(userId),
  });
}

export function useClearNotifications(userId?: number | null) {
  return API.useMutation<void, void>({
    // El endpoint legacy actualmente limpia notificaciones mediante GET.
    // Se conserva su contrato hasta que el backend legacy sea retirado.
    method: "GET",
    endpoint: () => {
      if (!userId) {
        throw new Error("No hay un usuario autenticado");
      }

      return marcasEndpoints.notifications.clearAllAdmin(userId);
    },
    body: () => undefined,
    invalidateKeys: notificationInvalidationKeys(userId),
  });
}
