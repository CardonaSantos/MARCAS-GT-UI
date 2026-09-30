import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { marcasApi } from "../api";
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

export function useNotifications(userId?: number | null) {
  return useQuery<MarcasNotification[], Error>({
    queryKey: userId
      ? notificationKeys.byUser(userId)
      : [...notificationKeys.all, "anonymous"],
    enabled: Boolean(userId),
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      const { data } = await marcasApi.get<MarcasNotification[]>(
        marcasEndpoints.notifications.forAdmin(userId),
      );

      return data;
    },
  });
}

export function useMarkNotificationAsRead(userId?: number | null) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { notificationId: number }>({
    mutationFn: async ({ notificationId }) => {
      if (!userId) {
        throw new Error("No hay un usuario autenticado");
      }

      await marcasApi.patch(
        marcasEndpoints.notifications.markAsRead(notificationId),
        {
          usuarioId: userId,
        },
      );
    },

    onSuccess: async () => {
      if (!userId) return;

      await queryClient.invalidateQueries({
        queryKey: notificationKeys.byUser(userId),
      });
    },
  });
}

export function useClearNotifications(userId?: number | null) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      if (!userId) {
        throw new Error("No hay un usuario autenticado");
      }

      await marcasApi.get(
        marcasEndpoints.notifications.clearAllAdmin(userId),
      );
    },

    onSuccess: async () => {
      if (!userId) return;

      await queryClient.invalidateQueries({
        queryKey: notificationKeys.byUser(userId),
      });
    },
  });
}
