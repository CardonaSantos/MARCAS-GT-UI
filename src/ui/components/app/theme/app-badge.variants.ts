import { cva } from "class-variance-authority";

export const appBadgeVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap",
    "[font-family:var(--app-font-sans)]",
    "font-medium",
    "transition-colors",
    "border",
    "select-none",
    "align-middle",
  ],
  {
    variants: {
      tone: {
        neutral: "",
        primary: "",
        success: "",
        warning: "",
        danger: "",
        info: "",
      },

      appearance: {
        solid: "",
        soft: "",
        outline: "",
        ghost: "",
      },

      size: {
        xs: [
          "h-[var(--app-badge-height-xs)]",
          "px-[var(--app-badge-px-xs)]",
          "text-[10px]",
          "gap-[var(--app-badge-gap)]",
        ],
        sm: [
          "h-[var(--app-badge-height-sm)]",
          "px-[var(--app-badge-px-sm)]",
          "text-[11px]",
          "gap-[var(--app-badge-gap)]",
        ],
        md: [
          "h-[var(--app-badge-height-md)]",
          "px-[var(--app-badge-px-md)]",
          "text-xs",
          "gap-[var(--app-badge-gap)]",
        ],
        lg: [
          "h-[var(--app-badge-height-lg)]",
          "px-[var(--app-badge-px-lg)]",
          "text-sm",
          "gap-1.5",
        ],
      },

      radius: {
        xs: "rounded-[var(--app-radius-xs)]",
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        lg: "rounded-[var(--app-radius-lg)]",
        full: "rounded-[var(--app-radius-full)]",
      },

      shadow: {
        none: "shadow-[var(--app-shadow-none)]",
        xs: "shadow-[var(--app-shadow-xs)]",
        sm: "shadow-[var(--app-shadow-sm)]",
      },

      clickable: {
        true: "cursor-pointer",
        false: "cursor-default",
      },
    },

    compoundVariants: [
      /* =========================
         SOLID
      ========================= */
      {
        tone: "neutral",
        appearance: "solid",
        className: [
          "border-transparent",
          "bg-[hsl(var(--app-badge-neutral-bg))]",
          "text-[hsl(var(--app-badge-neutral-foreground))]",
        ],
      },
      {
        tone: "primary",
        appearance: "solid",
        className: [
          "border-transparent",
          "bg-[hsl(var(--app-primary))]",
          "text-[hsl(var(--app-primary-foreground))]",
        ],
      },
      {
        tone: "success",
        appearance: "solid",
        className: [
          "border-transparent",
          "bg-[hsl(var(--app-success))]",
          "text-[hsl(var(--app-success-foreground))]",
        ],
      },
      {
        tone: "warning",
        appearance: "solid",
        className: [
          "border-transparent",
          "bg-[hsl(var(--app-warning))]",
          "text-[hsl(var(--app-warning-foreground))]",
        ],
      },
      {
        tone: "danger",
        appearance: "solid",
        className: [
          "border-transparent",
          "bg-[hsl(var(--app-danger))]",
          "text-[hsl(var(--app-danger-foreground))]",
        ],
      },
      {
        tone: "info",
        appearance: "solid",
        className: [
          "border-transparent",
          "bg-[hsl(var(--app-info))]",
          "text-[hsl(var(--app-info-foreground))]",
        ],
      },

      /* =========================
         SOFT
      ========================= */
      {
        tone: "neutral",
        appearance: "soft",
        className: [
          "border-transparent",
          "bg-[hsl(var(--app-badge-neutral-bg))]",
          "text-[hsl(var(--app-badge-neutral-foreground))]",
        ],
      },
      {
        tone: "primary",
        appearance: "soft",
        className: [
          "border-transparent",
          "bg-[hsl(var(--app-badge-primary-soft-bg))]",
          "text-[hsl(var(--app-badge-primary-soft-foreground))]",
        ],
      },
      {
        tone: "success",
        appearance: "soft",
        className: [
          "border-transparent",
          "bg-[hsl(var(--app-badge-success-soft-bg))]",
          "text-[hsl(var(--app-badge-success-soft-foreground))]",
        ],
      },
      {
        tone: "warning",
        appearance: "soft",
        className: [
          "border-transparent",
          "bg-[hsl(var(--app-badge-warning-soft-bg))]",
          "text-[hsl(var(--app-badge-warning-soft-foreground))]",
        ],
      },
      {
        tone: "danger",
        appearance: "soft",
        className: [
          "border-transparent",
          "bg-[hsl(var(--app-badge-danger-soft-bg))]",
          "text-[hsl(var(--app-badge-danger-soft-foreground))]",
        ],
      },
      {
        tone: "info",
        appearance: "soft",
        className: [
          "border-transparent",
          "bg-[hsl(var(--app-badge-info-soft-bg))]",
          "text-[hsl(var(--app-badge-info-soft-foreground))]",
        ],
      },

      /* =========================
         OUTLINE
      ========================= */
      {
        tone: "neutral",
        appearance: "outline",
        className: [
          "bg-transparent",
          "border-[hsl(var(--app-badge-neutral-border))]",
          "text-[hsl(var(--app-muted-foreground))]",
        ],
      },
      {
        tone: "primary",
        appearance: "outline",
        className: [
          "bg-transparent",
          "border-[hsl(var(--app-primary))]",
          "text-[hsl(var(--app-primary))]",
        ],
      },
      {
        tone: "success",
        appearance: "outline",
        className: [
          "bg-transparent",
          "border-[hsl(var(--app-success))]",
          "text-[hsl(var(--app-success))]",
        ],
      },
      {
        tone: "warning",
        appearance: "outline",
        className: [
          "bg-transparent",
          "border-[hsl(var(--app-warning))]",
          "text-[hsl(var(--app-warning))]",
        ],
      },
      {
        tone: "danger",
        appearance: "outline",
        className: [
          "bg-transparent",
          "border-[hsl(var(--app-danger))]",
          "text-[hsl(var(--app-danger))]",
        ],
      },
      {
        tone: "info",
        appearance: "outline",
        className: [
          "bg-transparent",
          "border-[hsl(var(--app-info))]",
          "text-[hsl(var(--app-info))]",
        ],
      },

      /* =========================
         GHOST
      ========================= */
      {
        tone: "neutral",
        appearance: "ghost",
        className: [
          "border-transparent",
          "bg-transparent",
          "text-[hsl(var(--app-muted-foreground))]",
        ],
      },
      {
        tone: "primary",
        appearance: "ghost",
        className: [
          "border-transparent",
          "bg-transparent",
          "text-[hsl(var(--app-primary))]",
        ],
      },
      {
        tone: "success",
        appearance: "ghost",
        className: [
          "border-transparent",
          "bg-transparent",
          "text-[hsl(var(--app-success))]",
        ],
      },
      {
        tone: "warning",
        appearance: "ghost",
        className: [
          "border-transparent",
          "bg-transparent",
          "text-[hsl(var(--app-warning))]",
        ],
      },
      {
        tone: "danger",
        appearance: "ghost",
        className: [
          "border-transparent",
          "bg-transparent",
          "text-[hsl(var(--app-danger))]",
        ],
      },
      {
        tone: "info",
        appearance: "ghost",
        className: [
          "border-transparent",
          "bg-transparent",
          "text-[hsl(var(--app-info))]",
        ],
      },

      /* =========================
         CLICKABLE HOVER
      ========================= */
      {
        tone: "primary",
        appearance: "solid",
        clickable: true,
        className: "hover:bg-[hsl(var(--app-primary-hover))]",
      },
      {
        tone: "success",
        appearance: "solid",
        clickable: true,
        className: "hover:bg-[hsl(var(--app-success-hover))]",
      },
      {
        tone: "warning",
        appearance: "solid",
        clickable: true,
        className: "hover:bg-[hsl(var(--app-warning-hover))]",
      },
      {
        tone: "danger",
        appearance: "solid",
        clickable: true,
        className: "hover:bg-[hsl(var(--app-danger-hover))]",
      },
      {
        tone: "info",
        appearance: "solid",
        clickable: true,
        className: "hover:bg-[hsl(var(--app-info-hover))]",
      },
      {
        tone: "neutral",
        appearance: "solid",
        clickable: true,
        className: "hover:bg-[hsl(var(--app-badge-neutral-bg-hover))]",
      },
    ],

    defaultVariants: {
      tone: "neutral",
      appearance: "soft",
      size: "sm",
      radius: "full",
      shadow: "none",
      clickable: false,
    },
  },
);

export const appBadgeDotVariants = cva(["shrink-0 rounded-full"], {
  variants: {
    size: {
      xs: ["h-[var(--app-badge-dot-xs)]", "w-[var(--app-badge-dot-xs)]"],
      sm: ["h-[var(--app-badge-dot-sm)]", "w-[var(--app-badge-dot-sm)]"],
      md: ["h-[var(--app-badge-dot-md)]", "w-[var(--app-badge-dot-md)]"],
      lg: ["h-[var(--app-badge-dot-lg)]", "w-[var(--app-badge-dot-lg)]"],
    },

    tone: {
      neutral: "bg-[hsl(var(--app-muted-foreground))]",
      primary: "bg-[hsl(var(--app-primary))]",
      success: "bg-[hsl(var(--app-success))]",
      warning: "bg-[hsl(var(--app-warning))]",
      danger: "bg-[hsl(var(--app-danger))]",
      info: "bg-[hsl(var(--app-info))]",
    },

    pulse: {
      true: "animate-pulse",
      false: "",
    },
  },

  defaultVariants: {
    size: "sm",
    tone: "neutral",
    pulse: false,
  },
});
