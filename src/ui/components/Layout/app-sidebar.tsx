import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { cn } from "@/lib/utils";

import {
  appSidebarContentVariants,
  appSidebarGroupTriggerVariants,
  appSidebarItemVariants,
  appSidebarMobileHeaderVariants,
  appSidebarNavVariants,
  appSidebarRootVariants,
  appSidebarSectionLabelVariants,
  appSidebarSubListInnerVariants,
  appSidebarSubListVariants,
  appSidebarTooltipVariants,
} from "../app/theme/app-sidebar.variants";

import {
  AppSidebarMobileCloseButton,
  AppSidebarMobileOverlay,
  useAppSidebar,
} from "../app/primitives/app-sidebar-shell";
import { getCrmRoutesByRole, Route } from "./crm-sidebar-routes";

function normalizeHref(href?: string) {
  if (!href) return "/";

  return href.startsWith("/") ? href : `/${href}`;
}

function getPathWithoutQuery(href?: string) {
  return normalizeHref(href).split(/[?#]/)[0];
}

function isRouteActive(pathname: string, href?: string) {
  const routePath = getPathWithoutQuery(href);

  if (routePath === "/crm") {
    return pathname === "/crm";
  }

  return pathname === routePath || pathname.startsWith(`${routePath}/`);
}

function hasActiveChild(pathname: string, item: Route) {
  if (item.href && isRouteActive(pathname, item.href)) {
    return true;
  }

  return (
    item.submenu?.some((subItem) => isRouteActive(pathname, subItem.href)) ??
    false
  );
}

function SidebarTooltip({
  label,
  children,
  disabled = false,
}: {
  label: string;
  children: ReactNode;
  disabled?: boolean;
}) {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <span className="group/tooltip relative block">
      {children}

      <span className={appSidebarTooltipVariants()}>{label}</span>
    </span>
  );
}

function RouteIcon({
  icon: Icon,
  size = "root",
}: {
  icon: Route["icon"];
  size?: "root" | "sub";
}) {
  return (
    <Icon
      aria-hidden="true"
      className={cn("shrink-0", size === "root" ? "h-4 w-4" : "h-3.5 w-3.5")}
    />
  );
}

function SidebarLabel({
  children,
  collapsed,
  className,
}: {
  children: ReactNode;
  collapsed: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "min-w-0 overflow-hidden whitespace-nowrap",
        "transition-[max-width,opacity,transform]",
        "duration-200 ease-out",
        collapsed
          ? "max-w-0 translate-x-1 opacity-0"
          : "max-w-[180px] translate-x-0 opacity-100",
        className,
      )}
    >
      {children}
    </span>
  );
}

type SidebarItemProps = {
  item: Route;
  active: boolean;
  collapsed: boolean;
  onNavigate: () => void;
  level?: "root" | "sub";
};

function SidebarItem({
  item,
  active,
  collapsed,
  onNavigate,
  level = "root",
}: SidebarItemProps) {
  const href = normalizeHref(item.href);

  const content = (
    <Link
      to={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        appSidebarItemVariants({
          active,
          collapsed,
          level,
        }),
        "overflow-hidden",
      )}
      title={collapsed ? item.label : undefined}
    >
      <RouteIcon icon={item.icon} size={level} />

      <SidebarLabel collapsed={collapsed} className="truncate">
        {item.label}
      </SidebarLabel>
    </Link>
  );

  return (
    <SidebarTooltip label={item.label} disabled={!collapsed}>
      {content}
    </SidebarTooltip>
  );
}

type SidebarGroupItemProps = {
  item: Route;
  pathname: string;
  collapsed: boolean;
  onNavigate: () => void;
};

function SidebarGroupItem({
  item,
  pathname,
  collapsed,
  onNavigate,
}: SidebarGroupItemProps) {
  const active = hasActiveChild(pathname, item);

  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (active) {
      setOpen(true);
    }
  }, [active]);

  const toggleOpen = () => {
    setOpen((current) => !current);
  };

  if (collapsed) {
    return (
      <div className="space-y-1">
        <SidebarTooltip label={item.label}>
          <button
            type="button"
            onClick={toggleOpen}
            aria-expanded={open}
            aria-label={item.label}
            title={item.label}
            className={cn(
              appSidebarGroupTriggerVariants({
                active,
                collapsed: false,
              }),
              "overflow-hidden",
            )}
          >
            <RouteIcon icon={item.icon} />
          </button>
        </SidebarTooltip>

        {open ? (
          <div className="space-y-1">
            {item.submenu?.map((subItem) => (
              <SidebarItem
                key={subItem.href ?? subItem.label}
                item={subItem}
                active={isRouteActive(pathname, subItem.href)}
                collapsed
                level="sub"
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        className={cn(
          appSidebarGroupTriggerVariants({
            active,
            collapsed: false,
          }),
          "overflow-hidden",
        )}
      >
        <SidebarLabel collapsed={false} className="flex-1 truncate text-left">
          {item.label}
        </SidebarLabel>

        <ChevronDown
          size={14}
          aria-hidden="true"
          className={cn(
            "shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className={appSidebarSubListVariants()}>
          <div className={appSidebarSubListInnerVariants()}>
            {item.submenu?.map((subItem) => (
              <SidebarItem
                key={subItem.href ?? subItem.label}
                item={subItem}
                active={isRouteActive(pathname, subItem.href)}
                collapsed={false}
                level="sub"
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AppSidebar() {
  const location = useLocation();

  const {
    effectiveCollapsed: collapsed,
    mobileOpen,
    closeMobile,
  } = useAppSidebar();

  const rol = useStoreCrm((state) => state.rol);

  const displayedRoutes = getCrmRoutesByRole(rol);

  const handleNavigate = useCallback(() => {
    closeMobile();
  }, [closeMobile]);

  return (
    <>
      <AppSidebarMobileOverlay />

      <aside
        className={appSidebarRootVariants({
          collapsed,
          mobileOpen,
        })}
      >
        <div className={appSidebarMobileHeaderVariants()}>
          <span className="text-xs font-semibold text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Menú
          </span>

          <AppSidebarMobileCloseButton />
        </div>

        <div className={appSidebarContentVariants()}>
          {!collapsed ? (
            <p className={appSidebarSectionLabelVariants()}>Secciones</p>
          ) : (
            <div className="mb-2 h-4" />
          )}

          <nav className={appSidebarNavVariants()}>
            {displayedRoutes.map((item) => {
              const active = hasActiveChild(location.pathname, item);

              if (item.submenu?.length) {
                return (
                  <SidebarGroupItem
                    key={item.href ?? item.label}
                    item={item}
                    pathname={location.pathname}
                    collapsed={collapsed}
                    onNavigate={handleNavigate}
                  />
                );
              }

              return (
                <SidebarItem
                  key={item.href ?? item.label}
                  item={item}
                  active={active}
                  collapsed={collapsed}
                  onNavigate={handleNavigate}
                />
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
