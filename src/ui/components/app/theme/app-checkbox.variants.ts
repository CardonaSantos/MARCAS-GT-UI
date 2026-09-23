import { cva } from "class-variance-authority";

export const appCheckboxRootVariants = cva(
  [
    "peer shrink-0",
    "inline-flex items-center justify-center",
    "border",
    "shadow-none",
    "outline-none",
    "transition-colors",
    "disabled:cursor-not-allowed",
    "disabled:opacity-[var(--app-disabled-opacity)]",
    "focus-visible:ring-2",
    "focus-visible:ring-[hsl(var(--app-ring))]",
    "focus-visible:ring-offset-2",
    "ring-offset-background",

    "data-[state=unchecked]:bg-[hsl(var(--app-checkbox-bg))]",
    "data-[state=unchecked]:border-[hsl(var(--app-checkbox-border))]",
    "data-[state=unchecked]:hover:bg-[hsl(var(--app-checkbox-bg-hover))]",
    "data-[state=unchecked]:hover:border-[hsl(var(--app-checkbox-border-hover))]",

    "data-[state=checked]:border-transparent",
    "data-[state=indeterminate]:border-transparent",
  ],
  {
    variants: {
      size: {
        xs: [
          "h-[var(--app-checkbox-size-xs)]",
          "w-[var(--app-checkbox-size-xs)]",
        ],
        sm: [
          "h-[var(--app-checkbox-size-sm)]",
          "w-[var(--app-checkbox-size-sm)]",
        ],
        md: [
          "h-[var(--app-checkbox-size-md)]",
          "w-[var(--app-checkbox-size-md)]",
        ],
        lg: [
          "h-[var(--app-checkbox-size-lg)]",
          "w-[var(--app-checkbox-size-lg)]",
        ],
      },

      radius: {
        none: "rounded-none",
        xs: "rounded-[var(--app-radius-xs)]",
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        full: "rounded-[var(--app-radius-full)]",
      },

      variant: {
        primary: [
          "data-[state=checked]:bg-[hsl(var(--app-checkbox-checked-bg))]",
          "data-[state=checked]:hover:bg-[hsl(var(--app-checkbox-checked-bg-hover))]",
          "data-[state=indeterminate]:bg-[hsl(var(--app-checkbox-indeterminate-bg))]",
        ],
        success: [
          "data-[state=checked]:bg-[hsl(var(--app-success))]",
          "data-[state=checked]:hover:bg-[hsl(var(--app-success-hover))]",
          "data-[state=indeterminate]:bg-[hsl(var(--app-success))]",
        ],
        danger: [
          "data-[state=checked]:bg-[hsl(var(--app-danger))]",
          "data-[state=checked]:hover:bg-[hsl(var(--app-danger-hover))]",
          "data-[state=indeterminate]:bg-[hsl(var(--app-danger))]",
        ],
        warning: [
          "data-[state=checked]:bg-[hsl(var(--app-warning))]",
          "data-[state=checked]:hover:bg-[hsl(var(--app-warning-hover))]",
          "data-[state=indeterminate]:bg-[hsl(var(--app-warning))]",
        ],
      },

      intent: {
        default: "",
        error: [
          "data-[state=unchecked]:border-[hsl(var(--app-danger))]",
          "focus-visible:ring-[hsl(var(--app-danger))]",
        ],
      },
    },

    defaultVariants: {
      size: "sm",
      radius: "sm",
      variant: "primary",
      intent: "default",
    },
  },
);

export const appCheckboxIconVariants = cva(
  ["text-[hsl(var(--app-checkbox-checked-foreground))]", "transition-none"],
  {
    variants: {
      size: {
        xs: [
          "h-[var(--app-checkbox-icon-xs)]",
          "w-[var(--app-checkbox-icon-xs)]",
        ],
        sm: [
          "h-[var(--app-checkbox-icon-sm)]",
          "w-[var(--app-checkbox-icon-sm)]",
        ],
        md: [
          "h-[var(--app-checkbox-icon-md)]",
          "w-[var(--app-checkbox-icon-md)]",
        ],
        lg: [
          "h-[var(--app-checkbox-icon-lg)]",
          "w-[var(--app-checkbox-icon-lg)]",
        ],
      },
    },

    defaultVariants: {
      size: "sm",
    },
  },
);

export const appCheckboxLabelVariants = cva(
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
        true: "cursor-not-allowed opacity-[var(--app-disabled-opacity)]",
        false: "cursor-pointer",
      },
    },

    defaultVariants: {
      size: "sm",
      disabled: false,
    },
  },
);
