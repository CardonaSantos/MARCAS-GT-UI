"use client";

import * as React from "react";
import { memo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, User, X } from "lucide-react";
import { Link } from "react-router-dom";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import type { UiNotificacion } from "@/Crm/WEB/notifications/notifications.type";

import {
  getCategoryMeta,
  getSeverityStyles,
  getActionFor,
} from "./notification-style";
import {
  formatNotificationRelativeTime,
  getNotificationTone,
  getNotificationToneClasses,
  truncateNotificationMessage,
} from "../_components/notification.helpers";

interface Props {
  notification: UiNotificacion;
  selectNoti: (noti: UiNotificacion) => void;
  onDelete?: (id: number) => void | Promise<void>;
}

function NotificationCategoryBadge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <AppBadge
      tone="neutral"
      appearance="soft"
      size="xs"
      radius="sm"
      className="h-4 max-w-[120px] gap-1 px-1 text-[9px]"
      title={label}
    >
      {icon}
      <span className="truncate">{label}</span>
    </AppBadge>
  );
}

function MapNotificationCompact({ notification, onDelete, selectNoti }: Props) {
  const severityMeta = React.useMemo(
    () => getSeverityStyles(notification.severidad),
    [notification.severidad],
  );

  const categoryMeta = React.useMemo(
    () => getCategoryMeta(notification.categoria),
    [notification.categoria],
  );

  const action = React.useMemo(
    () => getActionFor(notification),
    [notification],
  );

  const tone = React.useMemo(
    () => getNotificationTone(notification.severidad),
    [notification.severidad],
  );

  const toneClasses = React.useMemo(
    () => getNotificationToneClasses(tone),
    [tone],
  );

  const receivedAt = formatNotificationRelativeTime(notification.fechaCreacion);

  const message = truncateNotificationMessage(notification.mensaje);

  const SeverityIcon = severityMeta.Icon;
  const CategoryIcon = categoryMeta.Icon;

  const handleDelete = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      void onDelete?.(notification.id);
    },
    [notification.id, onDelete],
  );

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, margin: 0, padding: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      <button
        type="button"
        className={[
          "group relative w-full rounded-[var(--app-radius-lg)] border border-l-4",
          "border-[hsl(var(--app-border,var(--border)))]",
          "bg-[hsl(var(--app-card,var(--background)))] p-3 text-left",
          "transition-colors hover:bg-[hsl(var(--app-muted,var(--muted))/0.25)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
          toneClasses.border,
        ].join(" ")}
        style={{ wordBreak: "break-word" }}
        onClick={() => selectNoti(notification)}
      >
        <AppInline align="start" gap="sm" className="w-full">
          <span
            className={[
              "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              toneClasses.icon,
            ].join(" ")}
          >
            <SeverityIcon className="h-4 w-4" />
          </span>

          <AppStack gap="xs" className="min-w-0 flex-1">
            <AppInline
              align="start"
              justify="between"
              gap="sm"
              className="w-full"
            >
              <AppInline align="center" gap="xs" className="min-w-0 flex-1">
                <h3 className="truncate text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
                  {notification.titulo ?? "Notificación"}
                </h3>

                <NotificationCategoryBadge
                  icon={<CategoryIcon className="h-2.5 w-2.5 shrink-0" />}
                  label={categoryMeta.label}
                />
              </AppInline>

              <AppInline align="center" gap="xs" className="shrink-0">
                <span className="whitespace-nowrap text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                  {receivedAt}
                </span>

                <AppButton
                  type="button"
                  variant="ghost"
                  size="xs"
                  width="auto"
                  className="h-5 w-5 p-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))] hover:text-[hsl(var(--app-danger))]"
                  onClick={handleDelete}
                  title="Eliminar notificación"
                  aria-label="Eliminar notificación"
                >
                  <X size={12} />
                </AppButton>
              </AppInline>
            </AppInline>

            <p className="line-clamp-2 text-[11px] leading-relaxed text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              {message}
            </p>

            <AppInline
              align="center"
              justify="between"
              gap="sm"
              className="w-full"
            >
              <div className="min-w-0">
                {notification.remitente ? (
                  <AppInline
                    align="center"
                    gap="xs"
                    className="text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
                  >
                    <User size={12} />
                    <span className="truncate font-medium">
                      {notification.remitente.nombre}
                    </span>
                  </AppInline>
                ) : null}
              </div>

              {action.label && action.to !== "#" ? (
                <AppButton
                  asChild
                  variant="ghost"
                  size="xs"
                  width="auto"
                  className={[
                    "h-6 px-2 text-[10px] font-medium",
                    toneClasses.action,
                  ].join(" ")}
                  onClick={(event) => event.stopPropagation()}
                >
                  <Link to={action.to}>
                    {action.label}
                    <ExternalLink size={12} />
                  </Link>
                </AppButton>
              ) : null}
            </AppInline>
          </AppStack>
        </AppInline>
      </button>
    </motion.li>
  );
}

export default memo(MapNotificationCompact);
