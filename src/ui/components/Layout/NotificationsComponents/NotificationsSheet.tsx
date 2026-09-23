"use client";

import * as React from "react";
import { Bell, Trash2 } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import {
  AppDrawer,
  AppDrawerBody,
  AppDrawerContent,
  AppDrawerDescription,
  AppDrawerHeader,
  AppDrawerTitle,
  AppDrawerTrigger,
} from "@/components/app/primitives/app-drawer";
import { AppInline } from "@/components/app/primitives/app-inline";
import { useAppDisclosure } from "@/components/app/handlers";

import type { UiNotificacion } from "@/Crm/WEB/notifications/notifications.type";
import NotificationList from "./NotificationList";

interface Props {
  icon?: React.ReactNode;
  tooltipText?: string;
  notifications: UiNotificacion[];
  isLoading?: boolean;
  onDelete?: (id: number) => void | Promise<void>;
  countBadge?: number;
  deleteAllNotis: () => Promise<void>;
  openDeleteAllNoti: boolean;
  selectNoti: (noti: UiNotificacion) => void;
  setOpenDeleteAllNoti: (open: boolean) => void;
}

export default function NotificationsSheet({
  notifications,
  isLoading,
  onDelete,
  countBadge = 0,
  setOpenDeleteAllNoti,
  icon,
  tooltipText,
  selectNoti,
}: Props) {
  const drawer = useAppDisclosure();
  const hasNotifications = countBadge > 0;

  const handleRequestDeleteAll = React.useCallback(() => {
    drawer.close();

    window.setTimeout(() => {
      setOpenDeleteAllNoti(true);
    }, 160);
  }, [drawer, setOpenDeleteAllNoti]);

  const handleSelectNotification = React.useCallback(
    (notification: UiNotificacion) => {
      drawer.close();

      window.setTimeout(() => {
        selectNoti(notification);
      }, 120);
    },
    [drawer, selectNoti],
  );

  return (
    <AppDrawer open={drawer.isOpen} onOpenChange={drawer.setOpen} modal={false}>
      <div className="relative">
        <AppDrawerTrigger
          className={[
            "inline-flex h-7 w-7 items-center justify-center rounded-[var(--app-radius-md)]",
            "border border-[hsl(var(--app-border,var(--border)))]",
            "bg-[hsl(var(--app-background,var(--background)))]",
            "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
            "transition-colors hover:bg-[hsl(var(--app-muted,var(--muted))/0.55)]",
            "hover:text-[hsl(var(--app-foreground,var(--foreground)))]",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
          ].join(" ")}
          aria-label={tooltipText ?? "Notificaciones"}
          title={tooltipText ?? "Notificaciones"}
        >
          {icon ?? <Bell size={15} />}
        </AppDrawerTrigger>

        {hasNotifications ? (
          <AppBadge
            tone="danger"
            appearance="solid"
            size="xs"
            radius="full"
            className="absolute -right-1.5 -top-1.5 h-4 min-w-4 justify-center px-1 text-[9px] leading-none"
          >
            {countBadge > 99 ? "99+" : countBadge}
          </AppBadge>
        ) : null}
      </div>

      <AppDrawerContent
        side="right"
        className="w-[92vw] sm:w-[420px] md:w-[480px] lg:w-[540px]"
      >
        <AppDrawerHeader>
          <AppInline
            align="start"
            justify="between"
            gap="sm"
            className="w-full"
          >
            <div className="min-w-0">
              <AppDrawerTitle>Notificaciones</AppDrawerTitle>
              <AppDrawerDescription>
                {tooltipText ?? "Centro de notificaciones del sistema."}
              </AppDrawerDescription>
            </div>

            <AppButton
              type="button"
              variant="danger"
              size="xs"
              width="auto"
              leftIcon={<Trash2 size={13} />}
              disabled={!hasNotifications}
              aria-disabled={!hasNotifications}
              title={
                hasNotifications
                  ? "Eliminar todas las notificaciones"
                  : "No hay notificaciones"
              }
              onClick={handleRequestDeleteAll}
              className="h-7 shrink-0 px-2"
            >
              Eliminar todo
            </AppButton>
          </AppInline>
        </AppDrawerHeader>

        <AppDrawerBody className="px-3 py-3">
          <NotificationList
            selectNoti={handleSelectNotification}
            notifications={notifications}
            isLoading={isLoading}
            onDelete={onDelete}
          />
        </AppDrawerBody>
      </AppDrawerContent>
    </AppDrawer>
  );
}
