import { useEffect, useState } from "react";
import {
  Bell,
  User,
  LogOut,
  MailIcon,
  AlertCircle,
  Clock,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "../ui/button";
import { Link, Outlet } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { Separator } from "@/components/ui/separator";

import logo from "../../assets/images/logoEmpresa.png";
import logoEmpresa from "../../assets/images/logoEmpresa.png";

import { useSocket } from "../../Context/SocketProvider ";
import axios from "axios";
import { toast } from "sonner";

import { AppSidebar } from "./app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

import { useStore } from "@/Context/ContextSucursal";

import message1 from "../../assets/Sounds/message1.mp3";

const API_URL = import.meta.env.VITE_API_URL;

interface LayoutProps {
  children?: React.ReactNode;
}

interface AppNotification {
  id: number;
  mensaje: string;
  leido: boolean;
  remitenteId?: number;
  creadoEn: Date | string;
  targetUserId: number;
}

export default function Layout2({ children }: LayoutProps) {
  const socket = useSocket();

  // ============================================================
  // SESIÓN GLOBAL - ZUSTAND
  // ============================================================

  const authToken = useStore((state) => state.authToken);

  const userId = useStore((state) => state.userId);
  const userNombre = useStore((state) => state.userNombre);
  const userCorreo = useStore((state) => state.userCorreo);
  const userRol = useStore((state) => state.userRol);
  const userActivo = useStore((state) => state.userActivo);

  const clearAuth = useStore((state) => state.clearAuth);

  // ============================================================
  // ESTADOS LOCALES
  // ============================================================

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = Boolean(authToken && userId && userActivo !== false);

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    clearAuth();

    window.location.href = "/marcas-gt/login";
  };

  // ============================================================
  // GEOLOCALIZACIÓN DEL VENDEDOR
  // ============================================================

  useEffect(() => {
    if (
      !navigator.geolocation ||
      !socket ||
      !userId ||
      userRol !== "VENDEDOR"
    ) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const locationData = {
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
          usuarioId: userId,
        };

        socket.emit("sendLocation", locationData);
      },

      (error) => {
        console.error("Error obteniendo ubicación:", error);
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
  }, [socket, userId, userRol]);

  // ============================================================
  // OBTENER NOTIFICACIONES
  // ============================================================

  const getNoti = async () => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/notifications/notifications/for-admin/${userId}`,
      );

      if (response.status === 200) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
  };

  useEffect(() => {
    if (!userId) return;

    getNoti();
  }, [userId]);

  // ============================================================
  // NOTIFICACIONES EN TIEMPO REAL
  // ============================================================

  useEffect(() => {
    if (!socket || !userId) return;

    const handleAdminNotification = (newNotification: AppNotification) => {
      // Si viene dirigida a otro usuario, ignorarla.
      if (
        newNotification.targetUserId &&
        newNotification.targetUserId !== userId
      ) {
        return;
      }

      setNotifications((prev) => [...prev, newNotification]);

      toast.message(newNotification.mensaje);

      // ========================================================
      // NOTIFICACIÓN DEL NAVEGADOR
      // ========================================================

      if ("Notification" in window) {
        if (window.Notification.permission === "granted") {
          new window.Notification("Nueva Notificación", {
            body: newNotification.mensaje,
            icon: logoEmpresa,
            badge: logoEmpresa,
          });
        } else if (window.Notification.permission === "default") {
          window.Notification.requestPermission()
            .then((permission) => {
              if (permission === "granted") {
                new window.Notification("Nueva Notificación", {
                  body: newNotification.mensaje,
                  icon: logoEmpresa,
                  badge: logoEmpresa,
                });
              }
            })
            .catch((error) => {
              console.error(
                "Error solicitando permiso de notificaciones:",
                error,
              );
            });
        }
      }

      // ========================================================
      // SONIDO
      // ========================================================

      const audioNotificacion = new Audio(message1);

      audioNotificacion.play().catch((error) => {
        console.warn("No se pudo reproducir el sonido de notificación:", error);
      });
    };

    socket.on("newNotification", handleAdminNotification);

    return () => {
      socket.off("newNotification", handleAdminNotification);
    };
  }, [socket, userId]);

  // ============================================================
  // MARCAR / ELIMINAR NOTIFICACIÓN
  // ============================================================

  const handleVisto = async (notificationId: number) => {
    if (!userId) {
      return;
    }

    try {
      const response = await axios.patch(
        `${API_URL}/notifications/update-notify/${notificationId}`,
        {
          usuarioId: userId,
        },
      );

      if (response.status === 200) {
        toast.success("Notificación eliminada");

        await getNoti();
      }
    } catch (error) {
      console.error("Error al actualizar notificación:", error);

      toast.error("Error al actualizar la notificación");
    }
  };

  // ============================================================
  // ELIMINAR TODAS LAS NOTIFICACIONES
  // ============================================================

  const handleDeleteAllNotifications = async () => {
    if (!userId) {
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/notifications/delete-all-notifications-admin/${userId}`,
      );

      if (response.status === 200) {
        toast.success("Notificaciones eliminadas");

        await getNoti();
      }
    } catch (error) {
      console.error("Error al eliminar notificaciones:", error);

      toast.error("Error al eliminar notificaciones");
    }
  };

  // ============================================================
  // CAMBIO ENTRE MARCAS GT / POS
  // ============================================================

  const origin = window.location.origin;

  const isMarcas = origin === import.meta.env.VITE_MARCAS_URL;

  const switchLink = isMarcas
    ? `${import.meta.env.VITE_POS_URL}/dashboard`
    : `${import.meta.env.VITE_MARCAS_URL}/marcas-gt/dashboard`;

  const switchLabel = isMarcas ? "CABALLEROS BOUTIQUE" : "MARCAS GT";

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        {/* =====================================================
            SIDEBAR
        ====================================================== */}

        <AppSidebar />

        {/* =====================================================
            CONTENIDO PRINCIPAL
        ====================================================== */}

        <div className="flex flex-col w-full">
          {/* ===================================================
              TOPBAR
          ==================================================== */}

          <div className="sticky top-0 z-10 h-16 w-full bg-background border-b border-border shadow-sm flex items-center justify-between">
            <div className="mx-auto flex h-16 max-w-7xl w-full items-center px-4 sm:px-6 lg:px-8 justify-between">
              {/* ===============================================
                  IZQUIERDA - LOGO
              ================================================ */}

              <div className="flex items-center space-x-2">
                <Link to="/marcas-gt/dashboard">
                  <img
                    className="h-20 w-28 object-contain"
                    src={logo}
                    alt="Logo"
                  />
                </Link>
              </div>

              {/* ===============================================
                  DERECHA
              ================================================ */}

              <div className="flex items-center space-x-3">
                {/* CAMBIAR SISTEMA */}

                <Button
                  asChild
                  variant="link"
                  className="font-semibold underline"
                >
                  <Link to={switchLink}>{switchLabel}</Link>
                </Button>

                {/* TEMA */}

                <ModeToggle />

                {/* =============================================
                    NOTIFICACIONES
                ============================================== */}

                {isAuthenticated && (
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="relative">
                        <Bell className="h-4 w-4" />

                        {notifications.length > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {notifications.length}
                          </span>
                        )}
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[500px] w-full">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold flex items-center">
                          <Bell className="mr-2 h-5 w-5" />
                          Notificaciones
                        </DialogTitle>
                      </DialogHeader>

                      <Separator className="my-2" />

                      {/* =======================================
                          LISTA DE NOTIFICACIONES
                      ======================================== */}

                      <div className="max-h-[60vh] overflow-y-auto space-y-3 py-2 px-1">
                        {notifications.length > 0 ? (
                          [...notifications]
                            .sort(
                              (a, b) =>
                                new Date(b.creadoEn).getTime() -
                                new Date(a.creadoEn).getTime(),
                            )
                            .map((not) => (
                              <div
                                key={not.id}
                                className="flex items-start space-x-3 p-3 bg-card rounded-md shadow-sm hover:shadow transition-shadow duration-200 border border-border"
                              >
                                <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-1" />

                                <div className="flex-1 space-y-2">
                                  <p className="text-sm text-card-foreground leading-relaxed">
                                    {not.mensaje}
                                  </p>

                                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                                    <span className="flex items-center">
                                      <Clock className="mr-1 h-3 w-3" />

                                      {not.creadoEn
                                        ? new Date(not.creadoEn).toLocaleString(
                                            "es-GT",
                                            {
                                              dateStyle: "short",
                                              timeStyle: "short",
                                              hour12: true,
                                            },
                                          )
                                        : ""}
                                    </span>

                                    <Button
                                      type="button"
                                      onClick={() =>
                                        handleVisto(Number(not.id))
                                      }
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white hover:text-white"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))
                        ) : (
                          <p className="text-center text-muted-foreground text-sm py-4">
                            No hay notificaciones
                          </p>
                        )}
                      </div>

                      {/* =======================================
                          LIMPIAR NOTIFICACIONES
                      ======================================== */}

                      {notifications.length >= 1 && (
                        <>
                          <Separator className="my-2" />

                          <DialogFooter>
                            <Button
                              type="button"
                              onClick={handleDeleteAllNotifications}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Limpiar notificaciones
                            </Button>
                          </DialogFooter>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                )}

                {/* =============================================
                    USUARIO
                ============================================== */}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <User className="h-4 w-4" />

                      <span className="sr-only">Menú de usuario</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    {/* NOMBRE */}

                    <DropdownMenuItem className="flex items-center py-1.5">
                      <User className="mr-2 h-3 w-3" />

                      <span className="font-medium text-sm truncate">
                        {userNombre || "Usuario"}
                      </span>
                    </DropdownMenuItem>

                    <Separator className="my-1" />

                    {/* CORREO */}

                    <DropdownMenuItem className="flex items-center py-1.5">
                      <MailIcon className="mr-2 h-3 w-3 flex-shrink-0" />

                      <span className="truncate text-xs">
                        {userCorreo || "Sin correo"}
                      </span>
                    </DropdownMenuItem>

                    <Separator className="my-1" />

                    {/* LOGOUT */}

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center text-red-500 focus:text-red-500 py-1.5 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-3 w-3" />

                      <span className="text-sm">Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* ===================================================
              CONTENIDO DE LAS RUTAS
          ==================================================== */}

          <main className="flex-1 overflow-y-auto p-1 lg:p-8">
            <SidebarTrigger />

            {children || <Outlet />}
          </main>

          {/* ===================================================
              FOOTER
          ==================================================== */}

          <footer className="bg-background py-4 text-center text-sm text-muted-foreground border-t border-border">
            <p>
              &copy; {new Date().getFullYear()} Marcas Guatemala. Todos los
              derechos reservados
            </p>
          </footer>
        </div>
      </SidebarProvider>
    </div>
  );
}
