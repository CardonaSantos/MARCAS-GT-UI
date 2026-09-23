"use client";

import * as React from "react";
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  appSidebarOverlayVariants,
  appSidebarTriggerVariants,
} from "../theme/app-sidebar.variants";

interface AppSidebarContextValue {
  collapsed: boolean;
  effectiveCollapsed: boolean;
  mobileOpen: boolean;
  isMobile: boolean;
  setCollapsed: (value: boolean) => void;
  setMobileOpen: (value: boolean) => void;
  toggleDesktop: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

const AppSidebarContext = React.createContext<AppSidebarContextValue | null>(
  null,
);

const STORAGE_KEY = "app-sidebar-collapsed";
const MOBILE_QUERY = "(max-width: 767px)";

export function AppSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, internalSetCollapsed] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [isMobile, setIsMobile] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_QUERY).matches;
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(MOBILE_QUERY);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);

      // Al cruzar desktop <-> mobile, cerramos el drawer mobile.
      // Esto evita que se quede pegado al minimizar/maximizar.
      setMobileOpen(false);
    };

    setIsMobile(media.matches);

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, []);

  const setCollapsed = React.useCallback((value: boolean) => {
    internalSetCollapsed(value);
    localStorage.setItem(STORAGE_KEY, String(value));
  }, []);

  const toggleDesktop = React.useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  const toggleMobile = React.useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = React.useCallback(() => {
    setMobileOpen(false);
  }, []);

  const effectiveCollapsed = !isMobile && collapsed;

  const value = React.useMemo<AppSidebarContextValue>(
    () => ({
      collapsed,
      effectiveCollapsed,
      mobileOpen,
      isMobile,
      setCollapsed,
      setMobileOpen,
      toggleDesktop,
      toggleMobile,
      closeMobile,
    }),
    [
      closeMobile,
      collapsed,
      effectiveCollapsed,
      isMobile,
      mobileOpen,
      setCollapsed,
      toggleDesktop,
      toggleMobile,
    ],
  );

  return (
    <AppSidebarContext.Provider value={value}>
      {children}
    </AppSidebarContext.Provider>
  );
}

export function useAppSidebar() {
  const context = React.useContext(AppSidebarContext);

  if (!context) {
    throw new Error("useAppSidebar debe usarse dentro de AppSidebarProvider");
  }

  return context;
}

export function AppSidebarTrigger({ className }: { className?: string }) {
  const sidebar = useAppSidebar();

  return (
    <>
      <button
        type="button"
        onClick={sidebar.toggleMobile}
        className={cn(
          appSidebarTriggerVariants({ device: "mobile" }),
          className,
        )}
        aria-label="Abrir menú"
      >
        <Menu size={15} />
      </button>

      <button
        type="button"
        onClick={sidebar.toggleDesktop}
        className={cn(
          appSidebarTriggerVariants({ device: "desktop" }),
          className,
        )}
        aria-label={sidebar.collapsed ? "Expandir menú" : "Contraer menú"}
        title={sidebar.collapsed ? "Expandir menú" : "Contraer menú"}
      >
        {sidebar.collapsed ? (
          <PanelLeftOpen size={15} />
        ) : (
          <PanelLeftClose size={15} />
        )}
      </button>
    </>
  );
}

export function AppSidebarMobileOverlay() {
  const sidebar = useAppSidebar();

  if (!sidebar.mobileOpen) return null;

  return (
    <button
      type="button"
      className={appSidebarOverlayVariants()}
      onClick={sidebar.closeMobile}
      aria-label="Cerrar menú"
    />
  );
}

export function AppSidebarMobileCloseButton() {
  const sidebar = useAppSidebar();

  return (
    <button
      type="button"
      onClick={sidebar.closeMobile}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center",
        "rounded-[var(--app-radius-md)]",
        "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
        "transition-colors",
        "hover:bg-[hsl(var(--app-muted,var(--muted))/0.55)]",
        "hover:text-[hsl(var(--app-foreground,var(--foreground)))]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
        "md:hidden",
      )}
      aria-label="Cerrar menú"
    >
      <X size={15} />
    </button>
  );
}
