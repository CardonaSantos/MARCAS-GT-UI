import { cva } from "class-variance-authority";

export const appButtonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap",
    "font-[family-name:var(--app-font-sans)]",
    "font-medium",
    "transition-colors",
    "outline-none",
    "select-none",
    "disabled:pointer-events-none",
    "disabled:opacity-[var(--app-disabled-opacity)]",
    "focus-visible:ring-2",
    "focus-visible:ring-[hsl(var(--app-ring))]",
    "focus-visible:ring-offset-2",
    "ring-offset-background",
    "border",
    "border-transparent",
    "shadow-none",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[hsl(var(--app-primary))]",
          "text-[hsl(var(--app-primary-foreground))]",
          "hover:bg-[hsl(var(--app-primary-hover))]",
        ],

        secondary: [
          "bg-[hsl(var(--app-secondary))]",
          "text-[hsl(var(--app-secondary-foreground))]",
          "hover:bg-[hsl(var(--app-secondary-hover))]",
        ],

        outline: [
          "border-[hsl(var(--app-border))]",
          "bg-transparent",
          "text-foreground",
          "hover:bg-[hsl(var(--app-muted))]",
        ],

        ghost: [
          "border-transparent",
          "bg-transparent",
          "text-foreground",
          "hover:bg-[hsl(var(--app-muted))]",
        ],

        muted: [
          "bg-[hsl(var(--app-muted))]",
          "text-[hsl(var(--app-muted-foreground))]",
          "hover:bg-[hsl(var(--app-muted-hover))]",
        ],

        danger: [
          "bg-[hsl(var(--app-danger))]",
          "text-[hsl(var(--app-danger-foreground))]",
          "hover:bg-[hsl(var(--app-danger-hover))]",
        ],

        success: [
          "bg-[hsl(var(--app-success))]",
          "text-[hsl(var(--app-success-foreground))]",
          "hover:bg-[hsl(var(--app-success-hover))]",
        ],

        warning: [
          "bg-[hsl(var(--app-warning))]",
          "text-[hsl(var(--app-warning-foreground))]",
          "hover:bg-[hsl(var(--app-warning-hover))]",
        ],

        link: [
          "h-auto border-transparent bg-transparent px-0",
          "text-[hsl(var(--app-primary))]",
          "underline-offset-4",
          "hover:underline",
        ],
      },

      size: {
        xs: [
          "h-[var(--app-button-height-xs)]",
          "px-[var(--app-button-px-xs)]",
          "text-[11px]",
          "gap-[var(--app-button-gap)]",
        ],

        sm: [
          "h-[var(--app-button-height-sm)]",
          "px-[var(--app-button-px-sm)]",
          "text-xs",
          "gap-[var(--app-button-gap)]",
        ],

        md: [
          "h-[var(--app-button-height-md)]",
          "px-[var(--app-button-px-md)]",
          "text-sm",
          "gap-[var(--app-button-gap)]",
        ],

        lg: [
          "h-[var(--app-button-height-lg)]",
          "px-[var(--app-button-px-lg)]",
          "text-sm",
          "gap-2",
        ],

        iconXs: [
          "h-[var(--app-button-height-xs)]",
          "w-[var(--app-button-height-xs)]",
          "p-0",
        ],

        iconSm: [
          "h-[var(--app-button-height-sm)]",
          "w-[var(--app-button-height-sm)]",
          "p-0",
        ],

        iconMd: [
          "h-[var(--app-button-height-md)]",
          "w-[var(--app-button-height-md)]",
          "p-0",
        ],
      },

      radius: {
        xs: "rounded-[var(--app-radius-xs)]",
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        lg: "rounded-[var(--app-radius-lg)]",
        full: "rounded-[var(--app-radius-full)]",
      },

      width: {
        auto: "w-auto",
        full: "w-full",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "sm",
      radius: "sm",
      width: "auto",
    },
  },
);
