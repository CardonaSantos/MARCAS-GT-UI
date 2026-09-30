import { cva } from "class-variance-authority";

export const appSwitchRootVariants = cva(
  [
    "peer inline-flex shrink-0 cursor-pointer items-center",
    "border border-transparent",
    "shadow-none",
    "transition-colors",
    "outline-none",
    "disabled:cursor-not-allowed",
    "disabled:opacity-[var(--app-disabled-opacity)]",
    "focus-visible:ring-2",
    "focus-visible:ring-[hsl(var(--app-ring))]",
    "focus-visible:ring-offset-2",
    "ring-offset-background",
    "data-[state=unchecked]:bg-[hsl(var(--app-switch-bg))]",
    "data-[state=unchecked]:hover:bg-[hsl(var(--app-switch-bg-hover))]",
  ],
  {
    variants: {
      size: {
        xs: [
          "h-[var(--app-switch-height-xs)]",
          "w-[var(--app-switch-width-xs)]",
        ],
        sm: [
          "h-[var(--app-switch-height-sm)]",
          "w-[var(--app-switch-width-sm)]",
        ],
        md: [
          "h-[var(--app-switch-height-md)]",
          "w-[var(--app-switch-width-md)]",
        ],
        lg: [
          "h-[var(--app-switch-height-lg)]",
          "w-[var(--app-switch-width-lg)]",
        ],
      },

      radius: {
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        full: "rounded-[var(--app-radius-full)]",
      },

      variant: {
        primary: [
          "data-[state=checked]:bg-[hsl(var(--app-switch-bg-checked))]",
          "data-[state=checked]:hover:bg-[hsl(var(--app-switch-bg-checked-hover))]",
        ],
        success: [
          "data-[state=checked]:bg-[hsl(var(--app-success))]",
          "data-[state=checked]:hover:bg-[hsl(var(--app-success-hover))]",
        ],
        danger: [
          "data-[state=checked]:bg-[hsl(var(--app-danger))]",
          "data-[state=checked]:hover:bg-[hsl(var(--app-danger-hover))]",
        ],
        warning: [
          "data-[state=checked]:bg-[hsl(var(--app-warning))]",
          "data-[state=checked]:hover:bg-[hsl(var(--app-warning-hover))]",
        ],
      },
    },

    defaultVariants: {
      size: "sm",
      radius: "full",
      variant: "primary",
    },
  },
);

export const appSwitchThumbVariants = cva(
  [
    "pointer-events-none block rounded-full",
    "bg-[hsl(var(--app-switch-thumb-bg))]",
    "shadow-none",
    "transition-transform",
    "data-[disabled]:bg-[hsl(var(--app-switch-thumb-bg-disabled))]",
  ],
  {
    variants: {
      size: {
        xs: [
          "h-[var(--app-switch-thumb-xs)]",
          "w-[var(--app-switch-thumb-xs)]",
          "data-[state=checked]:translate-x-[var(--app-switch-translate-xs)]",
          "data-[state=unchecked]:translate-x-0.5",
        ],
        sm: [
          "h-[var(--app-switch-thumb-sm)]",
          "w-[var(--app-switch-thumb-sm)]",
          "data-[state=checked]:translate-x-[var(--app-switch-translate-sm)]",
          "data-[state=unchecked]:translate-x-0.5",
        ],
        md: [
          "h-[var(--app-switch-thumb-md)]",
          "w-[var(--app-switch-thumb-md)]",
          "data-[state=checked]:translate-x-[var(--app-switch-translate-md)]",
          "data-[state=unchecked]:translate-x-0.5",
        ],
        lg: [
          "h-[var(--app-switch-thumb-lg)]",
          "w-[var(--app-switch-thumb-lg)]",
          "data-[state=checked]:translate-x-[var(--app-switch-translate-lg)]",
          "data-[state=unchecked]:translate-x-0.5",
        ],
      },
    },

    defaultVariants: {
      size: "sm",
    },
  },
);

export const appSwitchLabelVariants = cva(
  [
    "[font-family:var(--app-font-sans)]",
    "font-medium",
    "text-foreground",
    "select-none",
  ],
  {
    variants: {
      size: {
        xs: "text-[11px]",
        sm: "text-xs",
        md: "text-sm",
        lg: "text-sm",
      },
      disabled: {
        true: "opacity-[var(--app-disabled-opacity)] cursor-not-allowed",
        false: "cursor-pointer",
      },
    },

    defaultVariants: {
      size: "sm",
      disabled: false,
    },
  },
);
