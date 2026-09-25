import { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
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

type UserTokenInfo = {
  nombre: string;
  correo: string;
  rol: string;
  sub: number;
  activo: boolean;
  empresaId: number;
};

function MarcasLayoutContent() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const userId = useStore((state) => state.userId);
  const userRole = useStore((state) => state.userRol);

  const setUserNombre = useStore((state) => state.setUserNombre);
  const setUserCorreo = useStore((state) => state.setUserCorreo);
  const setRole = useStore((state) => state.setRol);
  const setUserId = useStore((state) => state.setUserId);
  const setEmpresaId = useStore((state) => state.setSucursalId);
  const clearAuth = useStore((state) => state.clearAuth);

  const [tokenUser, setTokenUser] = useState<UserTokenInfo | null>(null);

  const notificationsQuery = useNotifications(tokenUser?.sub);
  const markNotificationAsRead = useMarkNotificationAsRead(tokenUser?.sub);
  const clearNotifications = useClearNotifications(tokenUser?.sub);

  const notifications = useMemo(
    () =>
      [...(notificationsQuery.data ?? [])].sort(
        (a, b) =>
          new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime(),
      ),
    [notificationsQuery.data],
  );

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return;
    }

    try {
      const decodedToken = jwtDecode<UserTokenInfo>(token);

      setTokenUser(decodedToken);
      setUserNombre(decodedToken.nombre);
      setUserCorreo(decodedToken.correo);
      setRole(decodedToken.rol);
      setUserId(Number(decodedToken.sub));
      setEmpresaId(decodedToken.empresaId);
    } catch (error) {
      console.error("No se pudo decodificar el token de sesión", error);
    }
  }, [
    setEmpresaId,
    setRole,
    setUserCorreo,
    setUserId,
    setUserNombre,
  ]);

  useEffect(() => {
    if (
      !navigator.geolocation ||
      !socket ||
      !userId ||
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

  useEffect(() => {
    if (!socket || !userId) {
      return;
    }

    const handleNotification = (notification: MarcasNotification) => {
      if (
        notification.targetUserId &&
        notification.targetUserId !== userId
      ) {
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

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    clearAuth();
    queryClient.clear();
    window.location.href = "/marcas-gt/login";
  };

  const handleMarkAsRead = (notificationId: number) => {
    markNotificationAsRead.mutate(
      { notificationId },
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

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-[hsl(var(--app-background))] text-[hsl(var(--app-foreground))]">
      <AppSidebar />

      <div className="flex h-dvh min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <MarcasTopbar
          user={
            tokenUser
              ? {
                  nombre: tokenUser.nombre,
                  correo: tokenUser.correo,
                }
              : null
          }
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
