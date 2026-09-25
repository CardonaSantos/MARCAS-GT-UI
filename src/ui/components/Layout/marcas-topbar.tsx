import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowUpRight,
  Bell,
  BellRing,
  CircleUserRound,
  Clock,
  LogOut,
  Mail,
  Store,
  Trash2,
  User,
  X,
} from "lucide-react";

import logo from "@/assets/images/logoEmpresa.png";
import type { MarcasNotification } from "@/API/hooks/useNotifications";

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
import { AppSidebarTrigger } from "../app/primitives/app-sidebar-shell";

export type MarcasTopbarUser = {
  nombre: string;
  correo: string;
};

type MarcasTopbarProps = {
  user: MarcasTopbarUser | null;
  notifications: MarcasNotification[];
  notificationsLoading: boolean;
  markingNotificationId?: number;
  clearingNotifications: boolean;
  onMarkNotificationAsRead: (notificationId: number) => void;
  onClearNotifications: () => void;
  onLogout: () => void;
};

function getPosDashboardUrl() {
  const posUrl = import.meta.env.VITE_POS_URL;

  if (!posUrl) {
    return null;
  }

  return posUrl.replace(/\/$/, "") + "/dashboard";
}

export function MarcasTopbar({
  user,
  notifications,
  notificationsLoading,
  markingNotificationId,
  clearingNotifications,
  onMarkNotificationAsRead,
  onClearNotifications,
  onLogout,
}: MarcasTopbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const posDashboardUrl = getPosDashboardUrl();
  const hasNotifications = notifications.length > 0;
  const NotificationIcon = hasNotifications ? BellRing : Bell;

  return (
    <header className="z-40 flex h-12 shrink-0 items-center border-b border-[hsl(var(--app-border))] bg-[hsl(var(--app-background)/0.98)] px-2.5 backdrop-blur md:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <AppSidebarTrigger />

        <span
          aria-hidden="true"
          className="hidden h-5 w-px bg-[hsl(var(--app-border))] sm:block"
        />

        <Link
          to="/marcas-gt/dashboard"
          className="flex min-w-0 items-center gap-2 rounded-[var(--app-radius-sm)] outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[hsl(var(--app-ring))]"
          aria-label="Ir al dashboard de Marcas GT"
        >
          <span className="flex h-7 w-9 shrink-0 items-center justify-start overflow-hidden">
            <img
              className="h-full w-full object-contain object-left"
              src={logo}
              alt=""
            />
          </span>

          <span className="hidden truncate text-xs font-semibold tracking-tight sm:block">
            Marcas GT
          </span>
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {posDashboardUrl ? (
          <AppButton
            asChild
            variant="ghost"
            size="xs"
            radius="md"
            className="hidden h-7 px-2 text-[11px] sm:inline-flex"
          >
            <a href={posDashboardUrl} className="flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Caballeros Boutique</span>
              <ArrowUpRight className="h-3 w-3 opacity-60" />
            </a>
          </AppButton>
        ) : null}

        <AppModeToggle />

        {user ? (
          <AppDialog
            open={notificationsOpen}
            onOpenChange={setNotificationsOpen}
          >
            <AppDialogTrigger asChild>
              <AppButton
                variant="outline"
                size="iconXs"
                radius="md"
                className="relative"
                aria-label="Abrir notificaciones"
                title="Notificaciones"
              >
                <NotificationIcon className="h-3.5 w-3.5" />

                {hasNotifications ? (
                  <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[hsl(var(--app-danger))] px-0.5 text-[8px] font-bold leading-none text-white">
                    {notifications.length > 99 ? "99+" : notifications.length}
                  </span>
                ) : null}
              </AppButton>
            </AppDialogTrigger>

            <AppDialogContent size="md">
              <AppDialogHeader divider>
                <AppDialogTitle className="flex items-center gap-2">
                  <NotificationIcon className="h-4 w-4" />
                  Notificaciones
                </AppDialogTitle>
              </AppDialogHeader>

              <AppDialogBody
                padding="sm"
                className="max-h-[60vh] space-y-2 overflow-y-auto"
              >
                {notificationsLoading ? (
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
                            {new Date(notification.creadoEn).toLocaleString(
                              "es-GT",
                              {
                                dateStyle: "short",
                                timeStyle: "short",
                                hour12: true,
                              },
                            )}
                          </span>

                          <AppButton
                            variant="ghost"
                            size="iconXs"
                            onClick={() =>
                              onMarkNotificationAsRead(notification.id)
                            }
                            loading={markingNotificationId === notification.id}
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
                    loading={clearingNotifications}
                    onClick={onClearNotifications}
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
              size="iconXs"
              radius="md"
              aria-label="Abrir menú de usuario"
              title="Cuenta"
            >
              <CircleUserRound className="h-3.5 w-3.5" />
            </AppButton>
          </AppDropdownMenuTrigger>

          <AppDropdownMenuContent className="w-56">
            <AppDropdownMenuItem
              icon={<User className="h-3.5 w-3.5" />}
              disabled
            >
              {user?.nombre ?? "Usuario"}
            </AppDropdownMenuItem>

            <AppDropdownMenuSeparator />

            <AppDropdownMenuItem
              icon={<Mail className="h-3.5 w-3.5" />}
              disabled
            >
              {user?.correo ?? "Sin correo"}
            </AppDropdownMenuItem>

            <AppDropdownMenuSeparator />

            <AppDropdownMenuItem
              icon={<LogOut className="h-3.5 w-3.5" />}
              tone="danger"
              onSelect={onLogout}
            >
              Cerrar sesión
            </AppDropdownMenuItem>
          </AppDropdownMenuContent>
        </AppDropdownMenu>
      </div>
    </header>
  );
}
