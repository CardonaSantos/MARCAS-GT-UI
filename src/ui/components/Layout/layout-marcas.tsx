import { useEffect, useMemo, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import {
  AlertCircle,
  Bell,
  Clock,
  LogOut,
  Mail,
  Trash2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

import logo from "@/assets/images/logoEmpresa.png";
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

import { AppModeToggle } from "../app/config/app-mode-toggle";
import { AppButton } from "../app/primitives/app-button";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "../app/primitives/app-dialog";
import {
  AppDropdownMenu,
  AppDropdownMenuContent,
  AppDropdownMenuItem,
  AppDropdownMenuSeparator,
  AppDropdownMenuTrigger,
} from "../app/primitives/app-dropdown-menu";
import { AppSeparator } from "../app/primitives/app-separator";
import {
  AppSidebarProvider,
  AppSidebarTrigger,
} from "../app/primitives/app-sidebar-shell";
import { AppSidebar } from "./app-sidebar";

type UserTokenInfo = {
  nombre: string;
  correo: string;
  rol: string;
  sub: number;
  activo: boolean;
  empresaId: number;
};

function getPosDashboardUrl() {
  const posUrl = import.meta.env.VITE_POS_URL;

  if (!posUrl) {
    return null;
  }

  return `${posUrl.replace(/\/$/, "")}/dashboard`;
}

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
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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

  const posDashboardUrl = getPosDashboardUrl();

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
    <div className="flex min-h-screen bg-[hsl(var(--app-background))] text-[hsl(var(--app-foreground))]">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center border-b border-[hsl(var(--app-border))] bg-[hsl(var(--app-background)/0.94)] px-3 backdrop-blur md:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <AppSidebarTrigger />

            <Link
              to="/marcas-gt/dashboard"
              className="flex min-w-0 items-center gap-2"
            >
              <img
                className="h-10 w-auto object-contain"
                src={logo}
                alt="Marcas GT"
              />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {posDashboardUrl ? (
              <AppButton asChild variant="link" size="sm">
                <a href={posDashboardUrl}>CABALLEROS BOUTIQUE</a>
              </AppButton>
            ) : null}

            <AppModeToggle />

            {tokenUser ? (
              <AppDialog
                open={notificationsOpen}
                onOpenChange={setNotificationsOpen}
              >
                <AppDialogTrigger asChild>
                  <AppButton
                    variant="outline"
                    size="iconSm"
                    className="relative"
                    aria-label="Abrir notificaciones"
                  >
                    <Bell className="h-4 w-4" />

                    {notifications.length > 0 ? (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[hsl(var(--app-danger))] px-1 text-[9px] font-bold text-white">
                        {notifications.length}
                      </span>
                    ) : null}
                  </AppButton>
                </AppDialogTrigger>

                <AppDialogContent size="md">
                  <AppDialogHeader divider>
                    <AppDialogTitle className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notificaciones
                    </AppDialogTitle>
                  </AppDialogHeader>

                  <AppDialogBody
                    padding="sm"
                    className="max-h-[60vh] space-y-2 overflow-y-auto"
                  >
                    {notificationsQuery.isLoading ? (
                      <p className="py-6 text-center text-sm text-[hsl(var(--app-muted-foreground))]">
                        Cargando notificaciones...
                      </p>
                    ) : notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="flex items-start gap-3 rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border))] bg-[hsl(var(--app-card-bg))] p-3"
                        >
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--app-primary))]" />

                          <div className="min-w-0 flex-1 space-y-2">
                            <p className="text-sm leading-relaxed">
                              {notification.mensaje}
                            </p>

                            <div className="flex items-center justify-between gap-2 text-xs text-[hsl(var(--app-muted-foreground))]">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(
                                  notification.creadoEn,
                                ).toLocaleString("es-GT", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                  hour12: true,
                                })}
                              </span>

                              <AppButton
                                variant="ghost"
                                size="iconXs"
                                onClick={() =>
                                  handleMarkAsRead(notification.id)
                                }
                                loading={
                                  markNotificationAsRead.isPending &&
                                  markNotificationAsRead.variables
                                    ?.notificationId === notification.id
                                }
                                aria-label="Eliminar notificación"
                              >
                                <X className="h-3.5 w-3.5" />
                              </AppButton>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="py-6 text-center text-sm text-[hsl(var(--app-muted-foreground))]">
                        No hay notificaciones
                      </p>
                    )}
                  </AppDialogBody>

                  {notifications.length > 0 ? (
                    <AppDialogFooter divider>
                      <AppButton
                        variant="outline"
                        size="sm"
                        width="full"
                        leftIcon={<Trash2 className="h-4 w-4" />}
                        loading={clearNotifications.isPending}
                        onClick={handleClearNotifications}
                      >
                        Limpiar notificaciones
                      </AppButton>
                    </AppDialogFooter>
                  ) : null}
                </AppDialogContent>
              </AppDialog>
            ) : null}

            <AppDropdownMenu>
              <AppDropdownMenuTrigger asChild>
                <AppButton
                  variant="outline"
                  size="iconSm"
                  aria-label="Abrir menú de usuario"
                >
                  <User className="h-4 w-4" />
                </AppButton>
              </AppDropdownMenuTrigger>

              <AppDropdownMenuContent className="w-56">
                <AppDropdownMenuItem
                  icon={<User className="h-3.5 w-3.5" />}
                  disabled
                >
                  {tokenUser?.nombre ?? "Usuario"}
                </AppDropdownMenuItem>

                <AppDropdownMenuSeparator />

                <AppDropdownMenuItem
                  icon={<Mail className="h-3.5 w-3.5" />}
                  disabled
                >
                  {tokenUser?.correo ?? "Sin correo"}
                </AppDropdownMenuItem>

                <AppDropdownMenuSeparator />

                <AppDropdownMenuItem
                  icon={<LogOut className="h-3.5 w-3.5" />}
                  tone="danger"
                  onSelect={handleLogout}
                >
                  Cerrar sesión
                </AppDropdownMenuItem>
              </AppDropdownMenuContent>
            </AppDropdownMenu>
          </div>
        </header>

        <AppSeparator />

        <main className="min-w-0 flex-1 p-2 md:p-5 lg:p-8">
          <Outlet />
        </main>

        <footer className="border-t border-[hsl(var(--app-border))] px-4 py-3 text-center text-xs text-[hsl(var(--app-muted-foreground))]">
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
