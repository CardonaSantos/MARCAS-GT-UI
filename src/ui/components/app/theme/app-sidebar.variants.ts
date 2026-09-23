import { cva } from "class-variance-authority";

export const appSidebarRootVariants = cva(
  [
    "fixed inset-y-0 left-0 z-[60] flex min-h-0 flex-col",
    "border-r border-[hsl(var(--app-border,var(--border)))]",
    "bg-[hsl(var(--app-background,var(--background)))]",
    "text-[hsl(var(--app-foreground,var(--foreground)))]",
    "will-change-[width,transform]",
    "transition-[width,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
    "w-[248px]",
    "md:static md:z-0 md:translate-x-0",
  ],
  {
    variants: {
      collapsed: {
        true: "md:w-[64px]",
        false: "md:w-[248px]",
      },
      mobileOpen: {
        true: "translate-x-0",
        false: "-translate-x-full",
      },
    },
    defaultVariants: {
      collapsed: false,
      mobileOpen: false,
    },
  },
);

export const appSidebarOverlayVariants = cva([
  "fixed inset-0 z-[50] bg-black/45 backdrop-blur-[1px]",
  "transition-opacity duration-300 ease-[cubic-bezier(.22,1,.36,1)] md:hidden",
]);

export const appSidebarTriggerVariants = cva(
  [
    "inline-flex h-7 w-7 items-center justify-center",
    "rounded-[var(--app-radius-md)]",
    "border border-[hsl(var(--app-border,var(--border)))]",
    "bg-[hsl(var(--app-background,var(--background)))]",
    "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
    "transition-colors",
    "hover:bg-[hsl(var(--app-muted,var(--muted))/0.55)]",
    "hover:text-[hsl(var(--app-foreground,var(--foreground)))]",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
  ],
  {
    variants: {
      device: {
        mobile: "md:hidden",
        desktop: "hidden md:inline-flex",
      },
    },
    defaultVariants: {
      device: "desktop",
    },
  },
);

export const appSidebarMobileHeaderVariants = cva([
  "flex h-10 shrink-0 items-center justify-between",
  "border-b border-[hsl(var(--app-border,var(--border)))]",
  "px-3 md:hidden",
]);

export const appSidebarContentVariants = cva([
  "min-h-0 flex-1 overflow-y-auto px-2 py-3",
]);

export const appSidebarSectionLabelVariants = cva([
  "mb-2 px-2 text-[11px] font-medium",
  "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
]);

export const appSidebarNavVariants = cva(["space-y-1"]);

export const appSidebarItemVariants = cva(
  [
    "flex min-w-0 items-center rounded-[var(--app-radius-md)]",
    "font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
  ],
  {
    variants: {
      active: {
        true: [
          "bg-[hsl(var(--app-primary)/0.12)]",
          "text-[hsl(var(--app-primary))]",
        ],
        false: [
          "text-[hsl(var(--app-foreground,var(--foreground))/0.82)]",
          "hover:bg-[hsl(var(--app-muted,var(--muted))/0.55)]",
          "hover:text-[hsl(var(--app-foreground,var(--foreground)))]",
        ],
      },
      collapsed: {
        true: "justify-center px-0",
        false: "gap-2 px-2",
      },
      level: {
        root: "h-8 text-[13px]",
        sub: "h-7 text-[12px]",
      },
    },
    defaultVariants: {
      active: false,
      collapsed: false,
      level: "root",
    },
  },
);

export const appSidebarGroupTriggerVariants = cva(
  [
    "flex h-8 w-full min-w-0 items-center rounded-[var(--app-radius-md)]",
    "font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
  ],
  {
    variants: {
      active: {
        true: [
          "bg-[hsl(var(--app-primary)/0.12)]",
          "text-[hsl(var(--app-primary))]",
        ],
        false: [
          "text-[hsl(var(--app-foreground,var(--foreground))/0.82)]",
          "hover:bg-[hsl(var(--app-muted,var(--muted))/0.55)]",
          "hover:text-[hsl(var(--app-foreground,var(--foreground)))]",
        ],
      },
      collapsed: {
        true: "justify-center px-0",
        false: "gap-2 px-2 text-[13px]",
      },
    },
    defaultVariants: {
      active: false,
      collapsed: false,
    },
  },
);

export const appSidebarSubListVariants = cva([
  "ml-3 border-l border-[hsl(var(--app-border,var(--border)))] pl-2",
]);

export const appSidebarSubListInnerVariants = cva(["space-y-1 py-1"]);

export const appSidebarTooltipVariants = cva([
  "pointer-events-none absolute left-full top-1/2 z-[120] ml-2",
  "-translate-y-1/2 translate-x-1 whitespace-nowrap",
  "rounded-[var(--app-radius-sm)]",
  "border border-[hsl(var(--app-border,var(--border)))]",
  "bg-[hsl(var(--app-popover,var(--background)))]",
  "px-2 py-1 text-[10px] font-medium",
  "text-[hsl(var(--app-popover-foreground,var(--foreground)))]",
  "opacity-0 shadow-md transition-all duration-150",
  "group-hover/tooltip:translate-x-0 group-hover/tooltip:opacity-100",
]);
