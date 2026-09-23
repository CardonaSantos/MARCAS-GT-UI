import { cva } from "class-variance-authority";

export const appDialogOverlayVariants = cva(
  [
    "fixed inset-0 z-[100]",
    "will-change-opacity",
    "backdrop-blur-[var(--app-dialog-overlay-blur)]",
    "data-[state=open]:animate-[app-dialog-overlay-in_var(--app-dialog-overlay-duration-in)_var(--app-motion-ease-out)_both]",
    "data-[state=closed]:animate-[app-dialog-overlay-out_var(--app-dialog-overlay-duration-out)_var(--app-motion-ease-in)_both]",
  ],
  {
    variants: {
      tone: {
        default:
          "bg-[hsl(var(--app-dialog-overlay-bg,var(--app-confirm-overlay-bg)))]",
        soft: "bg-[hsl(var(--app-dialog-overlay-bg-soft,var(--app-dialog-overlay-bg,var(--app-confirm-overlay-bg))))]",
        strong:
          "bg-[hsl(var(--app-dialog-overlay-bg-strong,var(--app-dialog-overlay-bg,var(--app-confirm-overlay-bg))))]",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export const appDialogContentVariants = cva(
  [
    "fixed left-1/2 top-1/2 z-[101]",
    "flex w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col",
    "overflow-hidden",
    "border border-[hsl(var(--app-dialog-border,var(--app-border)))]",
    "bg-[hsl(var(--app-dialog-bg,var(--app-popover,var(--background))))]",
    "text-[hsl(var(--app-dialog-foreground,var(--app-popover-foreground,var(--foreground))))]",
    "shadow-[var(--app-dialog-shadow,var(--app-confirm-shadow))]",
    "outline-none",
    "will-change-[opacity,transform]",
    "data-[state=open]:animate-[app-dialog-content-in_var(--app-dialog-content-duration-in)_var(--app-motion-ease-out)_both]",
    "data-[state=closed]:animate-[app-dialog-content-out_var(--app-dialog-content-duration-out)_var(--app-motion-ease-in)_both]",
  ],
  {
    variants: {
      size: {
        xs: "max-w-xs",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        full: "max-w-[calc(100vw-2rem)]",
      },
      viewport: {
        compact: "max-h-[70dvh]",
        default: "max-h-[85dvh]",
        tall: "max-h-[92dvh]",
        screen: "h-[calc(100dvh-2rem)] max-h-[calc(100dvh-2rem)]",
      },
      radius: {
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        lg: "rounded-[var(--app-radius-lg)]",
      },
      padding: {
        none: "p-0",
        xs: "p-2",
        sm: "p-3",
        md: "p-4",
        lg: "p-5",
      },
    },
    defaultVariants: {
      size: "lg",
      viewport: "default",
      radius: "md",
      padding: "md",
    },
  },
);

export const appDialogHeaderVariants = cva(
  "flex shrink-0 flex-col gap-1.5 pr-7",
  {
    variants: {
      divider: {
        true: "border-b border-[hsl(var(--app-dialog-border,var(--app-border)))] pb-3",
        false: "",
      },
    },
    defaultVariants: {
      divider: false,
    },
  },
);

export const appDialogBodyVariants = cva(
  "min-h-0 flex-1 overflow-y-auto overscroll-contain",
  {
    variants: {
      padding: {
        none: "p-0",
        xs: "p-2",
        sm: "p-3",
        md: "p-4",
        lg: "p-5",
      },
      divider: {
        true: "border-y border-[hsl(var(--app-dialog-border,var(--app-border)))]",
        false: "",
      },
    },
    defaultVariants: {
      padding: "none",
      divider: false,
    },
  },
);

export const appDialogFooterVariants = cva(
  "flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:justify-end",
  {
    variants: {
      divider: {
        true: "border-t border-[hsl(var(--app-dialog-border,var(--app-border)))] pt-3",
        false: "",
      },
    },
    defaultVariants: {
      divider: false,
    },
  },
);

export const appDialogTitleVariants = cva(
  "text-sm font-semibold leading-none tracking-tight text-[hsl(var(--app-dialog-foreground,var(--app-foreground,var(--foreground))))]",
);

export const appDialogDescriptionVariants = cva(
  "text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
);
