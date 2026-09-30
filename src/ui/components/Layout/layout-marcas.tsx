import { useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import logoEmpresa from "@/assets/images/logoEmpresa.png";
import message1 from "@/assets/Sounds/message1.mp3";

import { useStore } from "@/Context/ContextSucursal";
import { useSocket } from "@/Context/SocketProvider ";
import { getApiErrorMessage } from "@/lib/api-error";

import {
  notificationKeys,
  useClearNotifications,
  useMarkNotificationAsRead,
  useNotifications,
  type MarcasNotification,
} from "@/API/hooks/useNotifications";

import { AppSidebarProvider } from "../app/primitives/app-sidebar-shell";
import { AppSidebar } from "./app-sidebar";
import { MarcasTopbar } from "./marcas-topbar";

function MarcasLayoutContent() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  /**
   * Sesión centralizada en Zustand.
   *
   * Ya no decodificamos el JWT aquí ni reconstruimos
   * manualmente la información del usuario.
   */
  const userId = useStore((state) => state.userId);
  const userRole = useStore((state) => state.userRol);
  const userNombre = useStore((state) => state.userNombre);
  const userCorreo = useStore((state) => state.userCorreo);

  const clearAuth = useStore((state) => state.clearAuth);

  /**
   * Notificaciones
   */
  const notificationsQuery = useNotifications(userId ?? undefined);

  const markNotificationAsRead = useMarkNotificationAsRead(userId ?? undefined);

  const clearNotifications = useClearNotifications(userId ?? undefined);

  const notifications = useMemo(
    () =>
      [...(notificationsQuery.data ?? [])].sort(
        (a, b) =>
          new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime(),
      ),
    [notificationsQuery.data],
  );

  /**
   * Tracking del vendedor.
   *
   * Por ahora conservamos el funcionamiento actual:
   * únicamente un usuario VENDEDOR envía geolocalización.
   */
  useEffect(() => {
    if (
      !navigator.geolocation ||
      !socket ||
      userId === null ||
      userRole !== "VENDEDOR"
    ) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        socket.emit("sendLocation", {
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
          usuarioId: userId,
        });
      },
      (error) => {
        console.error("Error obteniendo ubicación", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, userId, userRole]);

  /**
   * Notificaciones en tiempo real.
   */
  useEffect(() => {
    if (!socket || userId === null) {
      return;
    }

    const handleNotification = (notification: MarcasNotification) => {
      if (notification.targetUserId && notification.targetUserId !== userId) {
        return;
      }

      queryClient.setQueryData<MarcasNotification[]>(
        notificationKeys.byUser(userId),
        (current = []) => {
          const withoutDuplicate = current.filter(
            (item) => item.id !== notification.id,
          );

          return [notification, ...withoutDuplicate];
        },
      );

      toast.message(notification.mensaje);

      if ("Notification" in window) {
        if (window.Notification.permission === "default") {
          void window.Notification.requestPermission();
        }

        if (window.Notification.permission === "granted") {
          new window.Notification("Nueva notificación", {
            body: notification.mensaje,
            icon: logoEmpresa,
            badge: logoEmpresa,
          });
        }
      }

      const audio = new Audio(message1);

      void audio.play().catch(() => undefined);
    };

    socket.on("newNotification", handleNotification);

    return () => {
      socket.off("newNotification", handleNotification);
    };
  }, [queryClient, socket, userId]);

  /**
   * Logout.
   *
   * clearAuth limpia la sesión de Zustand y,
   * al estar usando persist, actualiza también
   * el almacenamiento persistente.
   */
  const handleLogout = () => {
    clearAuth();
    queryClient.clear();

    window.location.href = "/marcas-gt/login";
  };

  /**
   * Marcar notificación como leída.
   */
  const handleMarkAsRead = (notificationId: number) => {
    markNotificationAsRead.mutate(
      {
        notificationId,
      },
      {
        onSuccess: () => {
          toast.success("Notificación eliminada");
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error));
        },
      },
    );
  };

  /**
   * Limpiar todas las notificaciones.
   */
  const handleClearNotifications = () => {
    clearNotifications.mutate(undefined, {
      onSuccess: () => {
        toast.success("Notificaciones eliminadas");
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error));
      },
    });
  };

  /**
   * Usuario que consume únicamente la Topbar.
   */
  const topbarUser =
    userId !== null && userNombre && userCorreo
      ? {
          nombre: userNombre,
          correo: userCorreo,
        }
      : null;

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-[hsl(var(--app-background))] text-[hsl(var(--app-foreground))]">
      <AppSidebar />

      <div className="flex h-dvh min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <MarcasTopbar
          user={topbarUser}
          notifications={notifications}
          notificationsLoading={notificationsQuery.isLoading}
          markingNotificationId={
            markNotificationAsRead.isPending
              ? markNotificationAsRead.variables?.notificationId
              : undefined
          }
          clearingNotifications={clearNotifications.isPending}
          onMarkNotificationAsRead={handleMarkAsRead}
          onClearNotifications={handleClearNotifications}
          onLogout={handleLogout}
        />

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-2 md:p-5 lg:p-8">
          <Outlet />
        </main>

        <footer className="shrink-0 border-t border-[hsl(var(--app-border))] bg-[hsl(var(--app-background))] px-4 py-3 text-center text-xs text-[hsl(var(--app-muted-foreground))]">
          © {new Date().getFullYear()} Marcas Guatemala. Todos los derechos
          reservados.
        </footer>
      </div>
    </div>
  );
}

export function MarcasLayout() {
  return (
    <AppSidebarProvider>
      <MarcasLayoutContent />
    </AppSidebarProvider>
  );
}
