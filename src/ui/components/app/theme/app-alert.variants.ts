import { cva } from "class-variance-authority";

export const appAlertVariants = cva(
  [
    "relative",
    "flex",
    "w-full",
    "min-w-0",
    "items-start",
    "border",
    "[font-family:var(--app-font-sans)]",
    "transition-[color,background-color,border-color,box-shadow,transform,opacity]",
    "duration-[var(--app-motion-duration-normal)]",
    "ease-[var(--app-motion-ease-standard)]",
  ],
  {
    variants: {
      tone: {
        neutral: [
          "bg-[hsl(var(--app-alert-bg-neutral))]",
          "border-[hsl(var(--app-alert-border-neutral))]",
          "text-[hsl(var(--app-alert-foreground-neutral))]",
        ],
        info: [
          "bg-[hsl(var(--app-alert-bg-info))]",
          "border-[hsl(var(--app-alert-border-info))]",
          "text-[hsl(var(--app-alert-foreground-info))]",
        ],
        success: [
          "bg-[hsl(var(--app-alert-bg-success))]",
          "border-[hsl(var(--app-alert-border-success))]",
          "text-[hsl(var(--app-alert-foreground-success))]",
        ],
        warning: [
          "bg-[hsl(var(--app-alert-bg-warning))]",
          "border-[hsl(var(--app-alert-border-warning))]",
          "text-[hsl(var(--app-alert-foreground-warning))]",
        ],
        danger: [
          "bg-[hsl(var(--app-alert-bg-danger))]",
          "border-[hsl(var(--app-alert-border-danger))]",
          "text-[hsl(var(--app-alert-foreground-danger))]",
        ],
      },

      size: {
        xs: [
          "gap-[var(--app-alert-gap-xs)]",
          "p-[var(--app-alert-padding-xs)]",
        ],
        sm: [
          "gap-[var(--app-alert-gap-sm)]",
          "p-[var(--app-alert-padding-sm)]",
        ],
        md: [
          "gap-[var(--app-alert-gap-md)]",
          "p-[var(--app-alert-padding-md)]",
        ],
        lg: [
          "gap-[var(--app-alert-gap-lg)]",
          "p-[var(--app-alert-padding-lg)]",
        ],
      },

      radius: {
        none: "rounded-none",
        xs: "rounded-[var(--app-radius-xs)]",
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        lg: "rounded-[var(--app-radius-lg)]",
      },

      variant: {
        soft: "",
        outline: "bg-transparent",
        subtle: "border-transparent",
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
      tone: "neutral",
      size: "sm",
      radius: "md",
      variant: "soft",
      animation: "fade",
    },
  },
);

export const appAlertIconVariants = cva(
  ["mt-0.5", "shrink-0", "[&_svg]:block"],
  {
    variants: {
      tone: {
        neutral: "text-[hsl(var(--app-alert-icon-neutral))]",
        info: "text-[hsl(var(--app-alert-icon-info))]",
        success: "text-[hsl(var(--app-alert-icon-success))]",
        warning: "text-[hsl(var(--app-alert-icon-warning))]",
        danger: "text-[hsl(var(--app-alert-icon-danger))]",
      },

      size: {
        xs: "[&_svg]:h-[var(--app-alert-icon-xs)] [&_svg]:w-[var(--app-alert-icon-xs)]",
        sm: "[&_svg]:h-[var(--app-alert-icon-sm)] [&_svg]:w-[var(--app-alert-icon-sm)]",
        md: "[&_svg]:h-[var(--app-alert-icon-md)] [&_svg]:w-[var(--app-alert-icon-md)]",
        lg: "[&_svg]:h-[var(--app-alert-icon-lg)] [&_svg]:w-[var(--app-alert-icon-lg)]",
      },
    },

    defaultVariants: {
      tone: "neutral",
      size: "sm",
    },
  },
);

export const appAlertTitleVariants = cva(["font-semibold", "leading-tight"], {
  variants: {
    size: {
      xs: "text-[length:var(--app-alert-title-xs)]",
      sm: "text-[length:var(--app-alert-title-sm)]",
      md: "text-[length:var(--app-alert-title-md)]",
      lg: "text-[length:var(--app-alert-title-lg)]",
    },
  },

  defaultVariants: {
    size: "sm",
  },
});

export const appAlertDescriptionVariants = cva(["leading-snug", "opacity-90"], {
  variants: {
    size: {
      xs: "text-[length:var(--app-alert-description-xs)]",
      sm: "text-[length:var(--app-alert-description-sm)]",
      md: "text-[length:var(--app-alert-description-md)]",
      lg: "text-[length:var(--app-alert-description-lg)]",
    },
  },

  defaultVariants: {
    size: "sm",
  },
});

export const appAlertCloseVariants = cva(
  [
    "ml-auto",
    "inline-flex",
    "shrink-0",
    "items-center",
    "justify-center",
    "rounded-[var(--app-radius-sm)]",
    "opacity-70",
    "transition-[color,background-color,opacity,transform]",
    "duration-[var(--app-motion-duration-fast)]",
    "ease-[var(--app-motion-ease-standard)]",
    "hover:opacity-100",
    "hover:bg-black/5",
    "dark:hover:bg-white/10",
    "active:scale-[var(--app-motion-scale-press)]",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-[hsl(var(--app-ring))]",
  ],
  {
    variants: {
      size: {
        xs: "h-5 w-5 [&_svg]:h-3 [&_svg]:w-3",
        sm: "h-6 w-6 [&_svg]:h-3.5 [&_svg]:w-3.5",
        md: "h-7 w-7 [&_svg]:h-4 [&_svg]:w-4",
        lg: "h-8 w-8 [&_svg]:h-4 [&_svg]:w-4",
      },
    },

    defaultVariants: {
      size: "sm",
    },
  },
);
