import { cva } from "class-variance-authority";

export const appLoaderVariants = cva(
  ["shrink-0", "animate-spin", "text-current"],
  {
    variants: {
      size: {
        xs: ["h-[var(--app-loader-size-xs)]", "w-[var(--app-loader-size-xs)]"],
        sm: ["h-[var(--app-loader-size-sm)]", "w-[var(--app-loader-size-sm)]"],
        md: ["h-[var(--app-loader-size-md)]", "w-[var(--app-loader-size-md)]"],
        lg: ["h-[var(--app-loader-size-lg)]", "w-[var(--app-loader-size-lg)]"],
        xl: ["h-[var(--app-loader-size-xl)]", "w-[var(--app-loader-size-xl)]"],
      },

      tone: {
        current: "text-current",
        neutral: "text-[hsl(var(--app-loader-neutral))]",
        primary: "text-[hsl(var(--app-loader-primary))]",
        success: "text-[hsl(var(--app-loader-success))]",
        warning: "text-[hsl(var(--app-loader-warning))]",
        danger: "text-[hsl(var(--app-loader-danger))]",
        info: "text-[hsl(var(--app-loader-info))]",
      },

      speed: {
        normal: "animate-spin",
        slow: "animate-[spin_1.2s_linear_infinite]",
        fast: "animate-[spin_0.55s_linear_infinite]",
      },
    },

    defaultVariants: {
      size: "sm",
      tone: "current",
      speed: "normal",
    },
  },
);

export const appLoaderLabelVariants = cva(
  [
    "[font-family:var(--app-font-sans)]",
    "font-medium",
    "text-muted-foreground",
  ],
  {
    variants: {
      size: {
        xs: "text-[11px]",
        sm: "text-xs",
        md: "text-sm",
        lg: "text-sm",
        xl: "text-base",
      },
    },

    defaultVariants: {
      size: "sm",
    },
  },
);

export const appLoaderContainerVariants = cva(
  ["inline-flex items-center justify-center"],
  {
    variants: {
      gap: {
        xs: "gap-1",
        sm: "gap-1.5",
        md: "gap-2",
        lg: "gap-2.5",
      },

      block: {
        true: "w-full",
        false: "",
      },

      centered: {
        true: "w-full justify-center",
        false: "",
      },
    },

    defaultVariants: {
      gap: "sm",
      block: false,
      centered: false,
    },
  },
);
