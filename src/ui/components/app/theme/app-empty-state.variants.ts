import { cva } from "class-variance-authority";

export const appEmptyStateVariants = cva(
  [
    "w-full",
    "min-w-0",
    "[font-family:var(--app-font-sans)]",
    "text-[hsl(var(--app-empty-foreground))]",
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
          "bg-[hsl(var(--app-empty-bg))]",
          "border-[hsl(var(--app-empty-border))]",
        ],
        outline: [
          "border",
          "bg-transparent",
          "border-[hsl(var(--app-empty-border))]",
        ],
        dashed: [
          "border border-dashed",
          "bg-transparent",
          "border-[hsl(var(--app-empty-border))]",
        ],
      },

      size: {
        xs: "p-[var(--app-empty-padding-xs)]",
        sm: "p-[var(--app-empty-padding-sm)]",
        md: "p-[var(--app-empty-padding-md)]",
        lg: "p-[var(--app-empty-padding-lg)]",
      },

      radius: {
        none: "rounded-none",
        xs: "rounded-[var(--app-radius-xs)]",
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        lg: "rounded-[var(--app-radius-lg)]",
      },

      align: {
        left: "text-left",
        center: "text-center",
      },

      fullHeight: {
        true: "min-h-[16rem]",
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
      radius: "md",
      align: "center",
      fullHeight: false,
      animation: "fade",
    },
  },
);

export const appEmptyStateInnerVariants = cva(["mx-auto", "min-w-0"], {
  variants: {
    maxWidth: {
      none: "max-w-none",
      xs: "max-w-[var(--app-empty-max-xs)]",
      sm: "max-w-[var(--app-empty-max-sm)]",
      md: "max-w-[var(--app-empty-max-md)]",
      lg: "max-w-[var(--app-empty-max-lg)]",
    },

    align: {
      left: "mx-0 items-start",
      center: "items-center",
    },

    size: {
      xs: "space-y-[var(--app-empty-gap-xs)]",
      sm: "space-y-[var(--app-empty-gap-sm)]",
      md: "space-y-[var(--app-empty-gap-md)]",
      lg: "space-y-[var(--app-empty-gap-lg)]",
    },
  },

  defaultVariants: {
    maxWidth: "sm",
    align: "center",
    size: "sm",
  },
});

export const appEmptyStateIconVariants = cva(
  [
    "inline-flex",
    "shrink-0",
    "items-center",
    "justify-center",
    "rounded-[var(--app-radius-full)]",
    "[&_svg]:block",
  ],
  {
    variants: {
      tone: {
        neutral: [
          "bg-[hsl(var(--app-empty-icon-bg-neutral))]",
          "text-[hsl(var(--app-empty-icon-fg-neutral))]",
        ],
        info: [
          "bg-[hsl(var(--app-empty-icon-bg-info))]",
          "text-[hsl(var(--app-empty-icon-fg-info))]",
        ],
        success: [
          "bg-[hsl(var(--app-empty-icon-bg-success))]",
          "text-[hsl(var(--app-empty-icon-fg-success))]",
        ],
        warning: [
          "bg-[hsl(var(--app-empty-icon-bg-warning))]",
          "text-[hsl(var(--app-empty-icon-fg-warning))]",
        ],
        danger: [
          "bg-[hsl(var(--app-empty-icon-bg-danger))]",
          "text-[hsl(var(--app-empty-icon-fg-danger))]",
        ],
      },

      size: {
        xs: [
          "h-[var(--app-empty-icon-box-xs)]",
          "w-[var(--app-empty-icon-box-xs)]",
          "[&_svg]:h-[var(--app-empty-icon-xs)]",
          "[&_svg]:w-[var(--app-empty-icon-xs)]",
        ],
        sm: [
          "h-[var(--app-empty-icon-box-sm)]",
          "w-[var(--app-empty-icon-box-sm)]",
          "[&_svg]:h-[var(--app-empty-icon-sm)]",
          "[&_svg]:w-[var(--app-empty-icon-sm)]",
        ],
        md: [
          "h-[var(--app-empty-icon-box-md)]",
          "w-[var(--app-empty-icon-box-md)]",
          "[&_svg]:h-[var(--app-empty-icon-md)]",
          "[&_svg]:w-[var(--app-empty-icon-md)]",
        ],
        lg: [
          "h-[var(--app-empty-icon-box-lg)]",
          "w-[var(--app-empty-icon-box-lg)]",
          "[&_svg]:h-[var(--app-empty-icon-lg)]",
          "[&_svg]:w-[var(--app-empty-icon-lg)]",
        ],
      },
    },

    defaultVariants: {
      tone: "neutral",
      size: "sm",
    },
  },
);

export const appEmptyStateTitleVariants = cva(
  [
    "font-semibold",
    "leading-tight",
    "tracking-tight",
    "text-[hsl(var(--app-empty-foreground))]",
  ],
  {
    variants: {
      size: {
        xs: "text-[length:var(--app-empty-title-xs)]",
        sm: "text-[length:var(--app-empty-title-sm)]",
        md: "text-[length:var(--app-empty-title-md)]",
        lg: "text-[length:var(--app-empty-title-lg)]",
      },
    },

    defaultVariants: {
      size: "sm",
    },
  },
);

export const appEmptyStateDescriptionVariants = cva(
  ["leading-snug", "text-[hsl(var(--app-empty-muted-foreground))]"],
  {
    variants: {
      size: {
        xs: "text-[length:var(--app-empty-description-xs)]",
        sm: "text-[length:var(--app-empty-description-sm)]",
        md: "text-[length:var(--app-empty-description-md)]",
        lg: "text-[length:var(--app-empty-description-lg)]",
      },
    },

    defaultVariants: {
      size: "sm",
    },
  },
);

export const appEmptyStateActionsVariants = cva(
  ["flex", "w-full", "min-w-0", "flex-col", "gap-2", "sm:flex-row"],
  {
    variants: {
      align: {
        left: "sm:justify-start",
        center: "sm:justify-center",
      },
    },

    defaultVariants: {
      align: "center",
    },
  },
);
