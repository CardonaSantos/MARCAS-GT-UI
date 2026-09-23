import { cva } from "class-variance-authority";

export const appSkeletonVariants = cva(
  [
    "relative",
    "block",
    "min-w-0",
    "overflow-hidden",
    "bg-[hsl(var(--app-skeleton-bg))]",
    "[font-family:var(--app-font-sans)]",
  ],
  {
    variants: {
      tone: {
        default: "bg-[hsl(var(--app-skeleton-bg))]",
        muted: "bg-[hsl(var(--app-skeleton-bg-muted))]",
        strong: "bg-[hsl(var(--app-skeleton-bg-strong))]",
      },

      radius: {
        none: "rounded-none",
        xs: "rounded-[var(--app-skeleton-radius-xs)]",
        sm: "rounded-[var(--app-skeleton-radius-sm)]",
        md: "rounded-[var(--app-skeleton-radius-md)]",
        lg: "rounded-[var(--app-skeleton-radius-lg)]",
        full: "rounded-[var(--app-skeleton-radius-full)]",
      },

      size: {
        xs: "h-[var(--app-skeleton-size-xs)]",
        sm: "h-[var(--app-skeleton-size-sm)]",
        md: "h-[var(--app-skeleton-size-md)]",
        lg: "h-[var(--app-skeleton-size-lg)]",
        xl: "h-[var(--app-skeleton-size-xl)]",
        "2xl": "h-[var(--app-skeleton-size-2xl)]",
        auto: "",
      },

      width: {
        auto: "w-auto",
        full: "w-full",
        fit: "w-fit",
        "1/4": "w-1/4",
        "1/3": "w-1/3",
        "1/2": "w-1/2",
        "2/3": "w-2/3",
        "3/4": "w-3/4",
      },

      shape: {
        block: "",
        text: "rounded-[var(--app-skeleton-radius-xs)]",
        circle: "aspect-square rounded-full",
        pill: "rounded-[var(--app-skeleton-radius-full)]",
      },

      animation: {
        none: "",
        pulse: "animate-pulse",
        shimmer: [
          "before:absolute",
          "before:inset-0",
          "before:-translate-x-full",
          "before:animate-[app-skeleton-shimmer_1.35s_infinite]",
          "before:bg-gradient-to-r",
          "before:from-transparent",
          "before:via-[hsl(var(--app-skeleton-highlight))]",
          "before:to-transparent",
        ],
      },
    },

    defaultVariants: {
      tone: "default",
      radius: "sm",
      size: "md",
      width: "full",
      shape: "block",
      animation: "pulse",
    },
  },
);

export const appSkeletonTextVariants = cva(["w-full", "min-w-0"], {
  variants: {
    gap: {
      xs: "space-y-[var(--app-skeleton-gap-xs)]",
      sm: "space-y-[var(--app-skeleton-gap-sm)]",
      md: "space-y-[var(--app-skeleton-gap-md)]",
      lg: "space-y-[var(--app-skeleton-gap-lg)]",
    },
  },

  defaultVariants: {
    gap: "xs",
  },
});

export const appSkeletonCardVariants = cva(
  [
    "w-full",
    "min-w-0",
    "border",
    "border-[hsl(var(--app-card-border))]",
    "bg-[hsl(var(--app-card-bg))]",
    "[font-family:var(--app-font-sans)]",
  ],
  {
    variants: {
      size: {
        xs: "space-y-2 p-[var(--app-skeleton-card-padding-xs)]",
        sm: "space-y-2.5 p-[var(--app-skeleton-card-padding-sm)]",
        md: "space-y-3 p-[var(--app-skeleton-card-padding-md)]",
      },

      radius: {
        none: "rounded-none",
        xs: "rounded-[var(--app-radius-xs)]",
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        lg: "rounded-[var(--app-radius-lg)]",
      },

      shadow: {
        none: "shadow-none",
        xs: "shadow-[var(--app-card-shadow-xs)]",
        sm: "shadow-[var(--app-card-shadow-sm)]",
      },
    },

    defaultVariants: {
      size: "sm",
      radius: "md",
      shadow: "none",
    },
  },
);
