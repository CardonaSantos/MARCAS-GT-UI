"use client";

import * as React from "react";
import { LogOut, UserCog } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import {
  AppDropdownMenu,
  AppDropdownMenuContent,
  AppDropdownMenuItem,
  AppDropdownMenuSeparator,
  AppDropdownMenuTrigger,
} from "@/components/app/primitives/app-dropdown-menu";
import { getInitials, getRoleLabel } from "./layout-crm.helpers";

interface LayoutUserMenuProps {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  avatarUrl?: string | null;
  onProfile: () => void;
  onLogout: () => void;
}

function UserAvatar({
  name,
  avatarUrl,
}: {
  name?: string | null;
  avatarUrl?: string | null;
}) {
  return (
    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-primary))] text-[10px] font-bold uppercase text-[hsl(var(--app-primary-foreground,var(--primary-foreground)))]">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name ?? "Usuario"}
          className="h-full w-full object-cover"
        />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}

function MenuItemContent({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
}) {
  return (
    <span className="flex w-full items-center justify-between gap-2">
      <span className="min-w-0 truncate">{label}</span>
      <span className="ml-auto shrink-0">{icon}</span>
    </span>
  );
}

export function LayoutUserMenu({
  name,
  email,
  role,
  avatarUrl,
  onProfile,
  onLogout,
}: LayoutUserMenuProps) {
  const safeName = name || "Usuario";
  const safeEmail = email || "correo@ejemplo.com";
  const roleLabel = getRoleLabel(role);

  return (
    <AppDropdownMenu>
      <AppDropdownMenuTrigger
        className={[
          "ml-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full",
          "ring-2 ring-transparent transition-all",
          "hover:ring-[hsl(var(--app-border,var(--border)))]",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
        ].join(" ")}
        aria-label="Menú de usuario"
      >
        <UserAvatar name={safeName} avatarUrl={avatarUrl} />
      </AppDropdownMenuTrigger>

      <AppDropdownMenuContent
        align="end"
        width="md"
        size="xs"
        className="w-56 p-1"
      >
        <div className="px-2 py-2">
          <p className="truncate text-xs font-semibold leading-none text-[hsl(var(--app-foreground,var(--foreground)))]">
            {safeName}
          </p>

          <p className="mt-1 truncate text-[10px] leading-none text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {safeEmail}
          </p>

          {roleLabel ? (
            <AppBadge
              tone="info"
              appearance="soft"
              size="xs"
              radius="sm"
              className="mt-2 h-4 px-1 text-[8.5px] uppercase tracking-wide"
            >
              {roleLabel}
            </AppBadge>
          ) : null}
        </div>

        <AppDropdownMenuSeparator />

        <AppDropdownMenuItem
          className="h-7 px-2 text-[11px]"
          onSelect={onProfile}
        >
          <MenuItemContent
            label="Configuración de perfil"
            icon={<UserCog size={13} />}
          />
        </AppDropdownMenuItem>

        <AppDropdownMenuSeparator />

        <AppDropdownMenuItem
          className="h-7 px-2 text-[11px] text-[hsl(var(--app-danger))]"
          onSelect={onLogout}
        >
          <MenuItemContent label="Cerrar sesión" icon={<LogOut size={13} />} />
        </AppDropdownMenuItem>
      </AppDropdownMenuContent>
    </AppDropdownMenu>
  );
}
