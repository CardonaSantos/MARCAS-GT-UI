import { cva } from "class-variance-authority";

export const appConfirmDialogOverlayVariants = cva([
  "fixed inset-0 z-[110]",
  "bg-[hsl(var(--app-confirm-overlay-bg,var(--app-dialog-overlay-bg)))]",
  "will-change-opacity",
  "backdrop-blur-[var(--app-dialog-overlay-blur)]",
  "data-[state=open]:animate-[app-dialog-overlay-in_var(--app-dialog-overlay-duration-in)_var(--app-motion-ease-out)_both]",
  "data-[state=closed]:animate-[app-dialog-overlay-out_var(--app-dialog-overlay-duration-out)_var(--app-motion-ease-in)_both]",
]);

export const appConfirmDialogContentVariants = cva(
  [
    "fixed left-1/2 top-1/2 z-[111]",
    "w-[calc(100vw-1rem)]",
    "max-h-[calc(100dvh-1rem)]",
    "-translate-x-1/2 -translate-y-1/2",
    "overflow-hidden",
    "border",
    "bg-[hsl(var(--app-confirm-bg,var(--app-popover)))]",
    "text-[hsl(var(--app-confirm-foreground,var(--app-popover-foreground)))]",
    "border-[hsl(var(--app-confirm-border,var(--app-border)))]",
    "shadow-[var(--app-confirm-shadow,var(--app-dialog-shadow))]",
    "[font-family:var(--app-font-sans)]",
    "outline-none",
    "will-change-[opacity,transform]",
    "data-[state=open]:animate-[app-dialog-content-in_var(--app-dialog-content-duration-in)_var(--app-motion-ease-out)_both]",
    "data-[state=closed]:animate-[app-dialog-content-out_var(--app-dialog-content-duration-out)_var(--app-motion-ease-in)_both]",
  ],
  {
    variants: {
      maxWidth: {
        xs: "sm:max-w-xs",
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
      },

      radius: {
        none: "rounded-none",
        xs: "rounded-[var(--app-radius-xs)]",
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        lg: "rounded-[var(--app-radius-lg)]",
      },
    },

    defaultVariants: {
      maxWidth: "md",
      radius: "lg",
    },
  },
);

export const appConfirmDialogBodyVariants = cva(
  ["flex", "min-w-0", "flex-col"],
  {
    variants: {
      size: {
        xs: "gap-[var(--app-confirm-gap-xs)] p-[var(--app-confirm-padding-xs)]",
        sm: "gap-[var(--app-confirm-gap-sm)] p-[var(--app-confirm-padding-sm)]",
        md: "gap-[var(--app-confirm-gap-md)] p-[var(--app-confirm-padding-md)]",
        lg: "gap-[var(--app-confirm-gap-lg)] p-[var(--app-confirm-padding-lg)]",
      },

      align: {
        left: "items-start text-left",
        center: "items-center text-center",
      },
    },

    defaultVariants: {
      size: "sm",
      align: "center",
    },
  },
);

export const appConfirmDialogIconVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center",
    "rounded-[var(--app-radius-full)]",
    "[&_svg]:block",
  ],
  {
    variants: {
      tone: {
        neutral: [
          "bg-[hsl(var(--app-confirm-icon-bg-neutral))]",
          "text-[hsl(var(--app-confirm-icon-fg-neutral))]",
        ],
        info: [
          "bg-[hsl(var(--app-confirm-icon-bg-info))]",
          "text-[hsl(var(--app-confirm-icon-fg-info))]",
        ],
        success: [
          "bg-[hsl(var(--app-confirm-icon-bg-success))]",
          "text-[hsl(var(--app-confirm-icon-fg-success))]",
        ],
        warning: [
          "bg-[hsl(var(--app-confirm-icon-bg-warning))]",
          "text-[hsl(var(--app-confirm-icon-fg-warning))]",
        ],
        danger: [
          "bg-[hsl(var(--app-confirm-icon-bg-danger))]",
          "text-[hsl(var(--app-confirm-icon-fg-danger))]",
        ],
      },

      size: {
        xs: [
          "h-[var(--app-confirm-icon-box-xs)]",
          "w-[var(--app-confirm-icon-box-xs)]",
          "[&_svg]:h-[var(--app-confirm-icon-xs)]",
          "[&_svg]:w-[var(--app-confirm-icon-xs)]",
        ],
        sm: [
          "h-[var(--app-confirm-icon-box-sm)]",
          "w-[var(--app-confirm-icon-box-sm)]",
          "[&_svg]:h-[var(--app-confirm-icon-sm)]",
          "[&_svg]:w-[var(--app-confirm-icon-sm)]",
        ],
        md: [
          "h-[var(--app-confirm-icon-box-md)]",
          "w-[var(--app-confirm-icon-box-md)]",
          "[&_svg]:h-[var(--app-confirm-icon-md)]",
          "[&_svg]:w-[var(--app-confirm-icon-md)]",
        ],
        lg: [
          "h-[var(--app-confirm-icon-box-lg)]",
          "w-[var(--app-confirm-icon-box-lg)]",
          "[&_svg]:h-[var(--app-confirm-icon-lg)]",
          "[&_svg]:w-[var(--app-confirm-icon-lg)]",
        ],
      },
    },

    defaultVariants: {
      tone: "neutral",
      size: "sm",
    },
  },
);

export const appConfirmDialogTitleVariants = cva(
  ["font-semibold", "leading-tight", "tracking-tight"],
  {
    variants: {
      size: {
        xs: "text-[length:var(--app-confirm-title-xs)]",
        sm: "text-[length:var(--app-confirm-title-sm)]",
        md: "text-[length:var(--app-confirm-title-md)]",
        lg: "text-[length:var(--app-confirm-title-lg)]",
      },
    },

    defaultVariants: {
      size: "sm",
    },
  },
);

export const appConfirmDialogDescriptionVariants = cva(
  ["leading-snug", "text-[hsl(var(--app-confirm-muted-foreground))]"],
  {
    variants: {
      size: {
        xs: "text-[length:var(--app-confirm-description-xs)]",
        sm: "text-[length:var(--app-confirm-description-sm)]",
        md: "text-[length:var(--app-confirm-description-md)]",
        lg: "text-[length:var(--app-confirm-description-lg)]",
      },
    },

    defaultVariants: {
      size: "sm",
    },
  },
);

export const appConfirmDialogContentCardVariants = cva(
  [
    "w-full",
    "min-w-0",
    "border",
    "bg-[hsl(var(--app-confirm-content-card-bg))]",
    "border-[hsl(var(--app-confirm-content-card-border))]",
  ],
  {
    variants: {
      size: {
        xs: "p-2",
        sm: "p-2.5",
        md: "p-3",
        lg: "p-4",
      },

      radius: {
        none: "rounded-none",
        xs: "rounded-[var(--app-radius-xs)]",
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        lg: "rounded-[var(--app-radius-lg)]",
      },
    },

    defaultVariants: {
      size: "sm",
      radius: "md",
    },
  },
);

export const appConfirmDialogFooterVariants = cva(
  [
    "flex",
    "w-full",
    "min-w-0",
    "flex-col-reverse",
    "gap-2",
    "pt-1",
    "sm:flex-row",
  ],
  {
    variants: {
      align: {
        left: "sm:justify-start",
        center: "sm:justify-center",
        right: "sm:justify-end",
        between: "sm:justify-between",
      },
    },

    defaultVariants: {
      align: "right",
    },
  },
);
