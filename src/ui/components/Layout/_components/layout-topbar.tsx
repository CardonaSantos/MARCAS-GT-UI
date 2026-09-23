"use client";

import { Link } from "react-router-dom";
import { Bell, LayoutDashboard, Monitor } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppInline } from "@/components/app/primitives/app-inline";
import { getSafeExternalHref } from "./layout-crm.helpers";
import { AppModeToggle } from "@/components/app/config/app-mode-toggle";
import NotificationsSheet from "../NotificationsComponents/NotificationsSheet";
import { Robot } from "@/Crm/Icons/Robot";
import { LayoutUserMenu } from "./layout-menu";
import { AppSidebarTrigger } from "@/components/app/primitives/app-sidebar-shell";

interface LayoutTopbarProps {
  logoSrc: string;
  empresaNombre?: string | null;

  isCrmLocation: boolean;
  erpLink?: string;
  crmLink?: string;

  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  userAvatarUrl?: string | null;

  systemNotifications: any[];
  botNotifications: any[];
  isLoadingNotifications: boolean;

  openDeleteAllNoti: boolean;
  setOpenDeleteAllNoti: (open: boolean) => void;

  onDeleteNotification: (id: number) => Promise<void>;
  onDeleteAllNotifications: () => Promise<void>;
  onSelectNotification: (notification: any) => void;

  onProfile: () => void;
  onLogout: () => void;
}

export function LayoutTopbar({
  logoSrc,
  empresaNombre,
  isCrmLocation,
  erpLink,
  crmLink,
  userName,
  userEmail,
  userRole,
  userAvatarUrl,
  systemNotifications,
  botNotifications,
  isLoadingNotifications,
  openDeleteAllNoti,
  setOpenDeleteAllNoti,
  onDeleteNotification,
  onDeleteAllNotifications,
  onSelectNotification,
  onProfile,
  onLogout,
}: LayoutTopbarProps) {
  const targetHref = getSafeExternalHref(isCrmLocation ? erpLink : crmLink);
  const targetLabel = isCrmLocation ? "ERP" : "CRM";
  const TargetIcon = isCrmLocation ? Monitor : LayoutDashboard;

  return (
    <header className="sticky top-0 z-20 w-full shrink-0 border-b border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-background,var(--background))/0.95)] backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--app-background,var(--background))/0.82)]">
      <div className="flex h-10 items-center justify-between gap-2 px-2">
        <AppInline align="center" gap="xs" className="min-w-0">
          <AppSidebarTrigger className="-ml-0.5" />
          <Link to="/crm" className="shrink-0">
            <img src={logoSrc} alt="Logo" className="h-7 w-7 object-contain" />
          </Link>

          <p className="max-w-[150px] truncate text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))] sm:max-w-xs">
            {empresaNombre || "Cargando..."}
          </p>
        </AppInline>

        <AppInline align="center" justify="end" gap="xs" className="shrink-0">
          <Link to={targetHref}>
            <AppButton
              type="button"
              size="xs"
              variant="secondary"
              width="auto"
              className="hidden h-7 px-2 text-xs sm:inline-flex"
            >
              <TargetIcon size={14} />
              <p>{targetLabel}</p>
            </AppButton>
          </Link>

          <AppModeToggle />

          <NotificationsSheet
            selectNoti={onSelectNotification}
            tooltipText="Notificaciones Bot"
            icon={<Robot size={16} />}
            notifications={botNotifications}
            isLoading={isLoadingNotifications}
            onDelete={onDeleteNotification}
            countBadge={botNotifications.length}
            deleteAllNotis={onDeleteAllNotifications}
            openDeleteAllNoti={openDeleteAllNoti}
            setOpenDeleteAllNoti={setOpenDeleteAllNoti}
          />

          <NotificationsSheet
            selectNoti={onSelectNotification}
            tooltipText="Notificaciones Sistema"
            icon={<Bell size={16} />}
            notifications={systemNotifications}
            isLoading={isLoadingNotifications}
            onDelete={onDeleteNotification}
            countBadge={systemNotifications.length}
            deleteAllNotis={onDeleteAllNotifications}
            openDeleteAllNoti={openDeleteAllNoti}
            setOpenDeleteAllNoti={setOpenDeleteAllNoti}
          />

          <LayoutUserMenu
            name={userName}
            email={userEmail}
            role={userRole}
            avatarUrl={userAvatarUrl}
            onProfile={onProfile}
            onLogout={onLogout}
          />
        </AppInline>
      </div>
    </header>
  );
}
