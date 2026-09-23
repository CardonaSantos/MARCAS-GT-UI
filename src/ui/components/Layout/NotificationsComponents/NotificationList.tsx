"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Inbox } from "lucide-react";

import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppSkeleton } from "@/components/app/primitives/app-skeleton";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { UiNotificacion } from "@/Crm/WEB/notifications/notifications.type";
import MapNotifications from "./MapNotifications";

interface Props {
  notifications: UiNotificacion[];
  isLoading?: boolean;
  onDelete?: (id: number) => void | Promise<void>;
  selectNoti: (noti: UiNotificacion) => void;
}

function NotificationLoadingList() {
  return (
    <AppStack gap="xs">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="rounded-[var(--app-radius-lg)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-card,var(--background)))] p-3"
        >
          <AppSkeleton className="mb-2 h-3.5 w-1/3" />
          <AppSkeleton className="mb-1.5 h-3 w-2/3" />
          <AppSkeleton className="h-3 w-1/2" />
        </div>
      ))}
    </AppStack>
  );
}

function NotificationList({
  notifications,
  isLoading,
  onDelete,
  selectNoti,
}: Props) {
  if (isLoading) {
    return <NotificationLoadingList />;
  }

  if (!notifications.length) {
    return (
      <AppEmptyState
        preset="empty"
        variant="plain"
        size="sm"
        align="center"
        icon={<Inbox size={30} strokeWidth={1.5} />}
        title="No hay notificaciones"
        description="Te avisaremos cuando llegue algo nuevo."
        className="py-10"
      />
    );
  }

  return (
    <motion.ul layout className="space-y-2 pr-1">
      <AnimatePresence initial={false}>
        {notifications.map((notification) => (
          <MapNotifications
            key={notification.id}
            selectNoti={selectNoti}
            notification={notification}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}

export default NotificationList;
