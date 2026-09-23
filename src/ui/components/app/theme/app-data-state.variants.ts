import { cva } from "class-variance-authority";

export const appDataStateVariants = cva(
  [
    "w-full",
    "min-w-0",
    "[font-family:var(--app-font-sans)]",
    "transition-[color,background-color,border-color,box-shadow,transform,opacity]",
    "duration-[var(--app-motion-duration-normal)]",
    "ease-[var(--app-motion-ease-standard)]",
  ],
  {
    variants: {
      variant: {
        plain: "bg-transparent border-transparent",
        soft: [
          "border",
          "bg-[hsl(var(--app-data-state-bg))]",
          "border-[hsl(var(--app-data-state-border))]",
        ],
        outline: [
          "border",
          "bg-transparent",
          "border-[hsl(var(--app-data-state-border))]",
        ],
        dashed: [
          "border border-dashed",
          "bg-transparent",
          "border-[hsl(var(--app-data-state-border))]",
        ],
      },

      size: {
        xs: "p-[var(--app-data-state-padding-xs)]",
        sm: "p-[var(--app-data-state-padding-sm)]",
        md: "p-[var(--app-data-state-padding-md)]",
        lg: "p-[var(--app-data-state-padding-lg)]",
      },

      gap: {
        xs: "gap-[var(--app-data-state-gap-xs)]",
        sm: "gap-[var(--app-data-state-gap-sm)]",
        md: "gap-[var(--app-data-state-gap-md)]",
        lg: "gap-[var(--app-data-state-gap-lg)]",
      },

      radius: {
        none: "rounded-none",
        xs: "rounded-[var(--app-radius-xs)]",
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        lg: "rounded-[var(--app-radius-lg)]",
      },

      align: {
        left: "items-start text-left",
        center: "items-center text-center",
        stretch: "items-stretch text-left",
      },

      minHeight: {
        none: "min-h-0",
        xs: "min-h-[var(--app-data-state-min-height-xs)]",
        sm: "min-h-[var(--app-data-state-min-height-sm)]",
        md: "min-h-[var(--app-data-state-min-height-md)]",
        lg: "min-h-[var(--app-data-state-min-height-lg)]",
      },

      centerContent: {
        true: "flex flex-col justify-center",
        false: "",
      },

      animation: {
        none: "",
        fade: "animate-[app-fade-in_var(--app-motion-duration-normal)_var(--app-motion-ease-out)]",
        slide:
          "animate-[app-slide-in-up_var(--app-motion-duration-normal)_var(--app-motion-ease-out)]",
        scale:
          "animate-[app-scale-in_var(--app-motion-duration-normal)_var(--app-motion-ease-out)]",
      },
    },

    defaultVariants: {
      variant: "plain",
      size: "sm",
      gap: "sm",
      radius: "md",
      align: "stretch",
      minHeight: "none",
      centerContent: false,
      animation: "none",
    },
  },
);

export const appDataStateLoadingVariants = cva(["w-full", "min-w-0"], {
  variants: {
    layout: {
      stack: "space-y-2",
      grid: "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3",
      center: "flex items-center justify-center",
    },
  },

  defaultVariants: {
    layout: "stack",
  },
});
