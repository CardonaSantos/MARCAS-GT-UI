import { cva } from "class-variance-authority";

export const appStatusDotVariants = cva(
  ["relative inline-flex shrink-0 rounded-full", "align-middle", "shadow-none"],
  {
    variants: {
      tone: {
        neutral: "bg-[hsl(var(--app-status-dot-neutral))]",
        primary: "bg-[hsl(var(--app-status-dot-primary))]",
        success: "bg-[hsl(var(--app-status-dot-success))]",
        warning: "bg-[hsl(var(--app-status-dot-warning))]",
        danger: "bg-[hsl(var(--app-status-dot-danger))]",
        info: "bg-[hsl(var(--app-status-dot-info))]",
      },

      size: {
        xs: [
          "h-[var(--app-status-dot-size-xs)]",
          "w-[var(--app-status-dot-size-xs)]",
        ],
        sm: [
          "h-[var(--app-status-dot-size-sm)]",
          "w-[var(--app-status-dot-size-sm)]",
        ],
        md: [
          "h-[var(--app-status-dot-size-md)]",
          "w-[var(--app-status-dot-size-md)]",
        ],
        lg: [
          "h-[var(--app-status-dot-size-lg)]",
          "w-[var(--app-status-dot-size-lg)]",
        ],
      },

      ringed: {
        true: "ring-[var(--app-status-dot-ring-width)]",
        false: "",
      },

      pulse: {
        true: "animate-pulse",
        false: "",
      },
    },

    compoundVariants: [
      {
        tone: "neutral",
        ringed: true,
        className: "ring-[hsl(var(--app-status-dot-neutral-ring)/0.22)]",
      },
      {
        tone: "primary",
        ringed: true,
        className: "ring-[hsl(var(--app-status-dot-primary-ring)/0.22)]",
      },
      {
        tone: "success",
        ringed: true,
        className: "ring-[hsl(var(--app-status-dot-success-ring)/0.22)]",
      },
      {
        tone: "warning",
        ringed: true,
        className: "ring-[hsl(var(--app-status-dot-warning-ring)/0.24)]",
      },
      {
        tone: "danger",
        ringed: true,
        className: "ring-[hsl(var(--app-status-dot-danger-ring)/0.22)]",
      },
      {
        tone: "info",
        ringed: true,
        className: "ring-[hsl(var(--app-status-dot-info-ring)/0.22)]",
      },
    ],

    defaultVariants: {
      tone: "neutral",
      size: "sm",
      ringed: false,
      pulse: false,
    },
  },
);

export const appStatusDotLabelVariants = cva(
  [
    "[font-family:var(--app-font-sans)]",
    "font-medium",
    "text-foreground",
    "leading-none",
  ],
  {
    variants: {
      size: {
        xs: "text-[11px]",
        sm: "text-xs",
        md: "text-sm",
        lg: "text-sm",
      },
      muted: {
        true: "text-muted-foreground",
        false: "text-foreground",
      },
    },

    defaultVariants: {
      size: "sm",
      muted: false,
    },
  },
);
