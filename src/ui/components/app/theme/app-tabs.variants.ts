import { cva } from "class-variance-authority";

export const appTabsRootVariants = cva("w-full min-w-0", {
  variants: {
    fullWidth: {
      true: "w-full",
      false: "w-auto",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});

export const appTabsListVariants = cva(
  [
    "flex min-w-0 items-center",
    "overflow-x-auto overflow-y-hidden",
    "scrollbar-thin",
    "border-b border-[hsl(var(--app-border))]",
  ],
  {
    variants: {
      variant: {
        default: "gap-1 bg-transparent",
        compact: "gap-0.5 bg-transparent",
        minimal:
          "gap-3 border-b border-[hsl(var(--app-border))] bg-transparent",
        pills:
          "gap-1 rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border))] bg-[hsl(var(--app-muted)/0.35)] p-1",
      },
      align: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
      },
    },
    defaultVariants: {
      variant: "default",
      align: "start",
    },
  },
);

export const appTabsTriggerVariants = cva(
  [
    "group inline-flex shrink-0 items-center justify-center gap-1.5",
    "whitespace-nowrap font-medium",
    "text-[hsl(var(--app-muted-foreground))]",
    "transition-[color,background-color,border-color,box-shadow]",
    "duration-[var(--app-motion-duration-fast)]",
    "ease-[var(--app-motion-ease-standard)]",
    "hover:text-[hsl(var(--app-foreground))]",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-[hsl(var(--app-ring))]",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-b-2 border-transparent",
          "data-[state=active]:border-[hsl(var(--app-primary))]",
          "data-[state=active]:text-[hsl(var(--app-foreground))]",
        ],
        compact: [
          "border-b-2 border-transparent",
          "data-[state=active]:border-[hsl(var(--app-primary))]",
          "data-[state=active]:text-[hsl(var(--app-foreground))]",
        ],
        minimal: [
          "border-b-2 border-transparent px-0",
          "data-[state=active]:border-[hsl(var(--app-primary))]",
          "data-[state=active]:text-[hsl(var(--app-foreground))]",
        ],
        pills: [
          "rounded-[var(--app-radius-sm)]",
          "data-[state=active]:bg-[hsl(var(--app-background))]",
          "data-[state=active]:text-[hsl(var(--app-foreground))]",
          "data-[state=active]:shadow-sm",
        ],
      },
      size: {
        xs: "h-7 px-2 text-[11px]",
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-3.5 text-sm",
      },
      fullWidthTrigger: {
        true: "flex-1",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      fullWidthTrigger: false,
    },
  },
);

export const appTabsContentVariants = cva(
  [
    "min-w-0",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-[hsl(var(--app-ring))]",
  ],
  {
    variants: {
      spacing: {
        none: "pt-0",
        xs: "pt-2",
        sm: "pt-3",
        md: "pt-4",
        lg: "pt-5",
      },
    },
    defaultVariants: {
      spacing: "sm",
    },
  },
);
