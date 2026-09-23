import { cva } from "class-variance-authority";

export const appCardVariants = cva(
  [
    "relative",
    "w-full",
    "overflow-hidden",
    "[font-family:var(--app-font-sans)]",
    "transition-colors",
    "text-[hsl(var(--app-card-foreground))]",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-[hsl(var(--app-card-bg))]",
          "border-[hsl(var(--app-card-border))]",
        ],

        muted: [
          "bg-[hsl(var(--app-card-muted-bg))]",
          "border-[hsl(var(--app-card-border))]",
        ],

        outline: ["bg-transparent", "border-[hsl(var(--app-card-border))]"],

        ghost: ["bg-transparent", "border-transparent"],

        elevated: [
          "bg-[hsl(var(--app-card-elevated-bg))]",
          "border-[hsl(var(--app-card-border))]",
        ],

        danger: [
          "bg-[hsl(var(--app-card-danger-bg))]",
          "border-[hsl(var(--app-card-danger-border))]",
        ],

        success: [
          "bg-[hsl(var(--app-card-success-bg))]",
          "border-[hsl(var(--app-card-success-border))]",
        ],

        warning: [
          "bg-[hsl(var(--app-card-warning-bg))]",
          "border-[hsl(var(--app-card-warning-border))]",
        ],

        info: [
          "bg-[hsl(var(--app-card-info-bg))]",
          "border-[hsl(var(--app-card-info-border))]",
        ],
      },

      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-sm",
        lg: "text-base",
        xl: "text-base",
      },

      radius: {
        none: "rounded-none",
        xs: "rounded-[var(--app-radius-xs)]",
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        lg: "rounded-[var(--app-radius-lg)]",
        xl: "rounded-[calc(var(--app-radius-lg)+0.25rem)]",
      },

      shadow: {
        none: "shadow-[var(--app-card-shadow-none)]",
        xs: "shadow-[var(--app-card-shadow-xs)]",
        sm: "shadow-[var(--app-card-shadow-sm)]",
        md: "shadow-[var(--app-card-shadow-md)]",
      },

      bordered: {
        true: "border",
        false: "border-transparent",
      },

      interactive: {
        true: [
          "cursor-pointer",
          "hover:bg-[hsl(var(--app-card-hover-bg))]",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-[hsl(var(--app-ring))]",
          "focus-visible:ring-offset-2",
          "ring-offset-background",
        ],
        false: "",
      },

      selected: {
        true: ["ring-2", "ring-[hsl(var(--app-card-selected-ring))]"],
        false: "",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "sm",
      radius: "md",
      shadow: "none",
      bordered: true,
      interactive: false,
      selected: false,
    },
  },
);

export const appCardHeaderVariants = cva(
  [
    "flex",
    "w-full",
    "flex-col",
    "gap-2",
    "sm:flex-row",
    "sm:items-start",
    "sm:justify-between",
  ],
  {
    variants: {
      size: {
        xs: "p-[var(--app-card-padding-xs)]",
        sm: "p-[var(--app-card-padding-sm)]",
        md: "p-[var(--app-card-padding-md)]",
        lg: "p-[var(--app-card-padding-lg)]",
        xl: "p-[var(--app-card-padding-xl)]",
      },

      divider: {
        true: "border-b border-[hsl(var(--app-card-border))]",
        false: "",
      },
    },

    defaultVariants: {
      size: "sm",
      divider: false,
    },
  },
);

export const appCardContentVariants = cva(["w-full"], {
  variants: {
    size: {
      xs: "p-[var(--app-card-padding-xs)]",
      sm: "p-[var(--app-card-padding-sm)]",
      md: "p-[var(--app-card-padding-md)]",
      lg: "p-[var(--app-card-padding-lg)]",
      xl: "p-[var(--app-card-padding-xl)]",
    },

    flush: {
      true: "p-0",
      false: "",
    },
  },

  defaultVariants: {
    size: "sm",
    flush: false,
  },
});

export const appCardFooterVariants = cva(
  [
    "flex",
    "w-full",
    "flex-col-reverse",
    "gap-2",
    "sm:flex-row",
    "sm:items-center",
  ],
  {
    variants: {
      size: {
        xs: "p-[var(--app-card-padding-xs)]",
        sm: "p-[var(--app-card-padding-sm)]",
        md: "p-[var(--app-card-padding-md)]",
        lg: "p-[var(--app-card-padding-lg)]",
        xl: "p-[var(--app-card-padding-xl)]",
      },

      align: {
        left: "sm:justify-start",
        center: "sm:justify-center",
        right: "sm:justify-end",
        between: "sm:justify-between",
      },

      divider: {
        true: "border-t border-[hsl(var(--app-card-border))]",
        false: "",
      },
    },

    defaultVariants: {
      size: "sm",
      align: "right",
      divider: false,
    },
  },
);

export const appCardTitleVariants = cva(
  [
    "min-w-0",
    "font-semibold",
    "leading-tight",
    "tracking-tight",
    "text-[hsl(var(--app-card-foreground))]",
  ],
  {
    variants: {
      size: {
        xs: "text-[length:var(--app-card-title-xs)]",
        sm: "text-[length:var(--app-card-title-sm)]",
        md: "text-[length:var(--app-card-title-md)]",
        lg: "text-[length:var(--app-card-title-lg)]",
        xl: "text-[length:var(--app-card-title-xl)]",
      },

      truncate: {
        true: "truncate",
        false: "",
      },
    },

    defaultVariants: {
      size: "sm",
      truncate: false,
    },
  },
);

export const appCardDescriptionVariants = cva(
  ["leading-snug", "text-[hsl(var(--app-card-muted-foreground))]"],
  {
    variants: {
      size: {
        xs: "text-[length:var(--app-card-description-xs)]",
        sm: "text-[length:var(--app-card-description-sm)]",
        md: "text-[length:var(--app-card-description-md)]",
        lg: "text-[length:var(--app-card-description-lg)]",
        xl: "text-[length:var(--app-card-description-xl)]",
      },

      truncate: {
        true: "truncate",
        false: "",
      },
    },

    defaultVariants: {
      size: "sm",
      truncate: false,
    },
  },
);

export const appCardIconVariants = cva(
  [
    "inline-flex",
    "shrink-0",
    "items-center",
    "justify-center",
    "rounded-[var(--app-radius-sm)]",
    "bg-[hsl(var(--app-muted))]",
    "text-[hsl(var(--app-muted-foreground))]",
  ],
  {
    variants: {
      size: {
        xs: [
          "h-[var(--app-card-icon-box-xs)]",
          "w-[var(--app-card-icon-box-xs)]",
          "[&_svg]:h-[var(--app-card-icon-xs)]",
          "[&_svg]:w-[var(--app-card-icon-xs)]",
        ],
        sm: [
          "h-[var(--app-card-icon-box-sm)]",
          "w-[var(--app-card-icon-box-sm)]",
          "[&_svg]:h-[var(--app-card-icon-sm)]",
          "[&_svg]:w-[var(--app-card-icon-sm)]",
        ],
        md: [
          "h-[var(--app-card-icon-box-md)]",
          "w-[var(--app-card-icon-box-md)]",
          "[&_svg]:h-[var(--app-card-icon-md)]",
          "[&_svg]:w-[var(--app-card-icon-md)]",
        ],
        lg: [
          "h-[var(--app-card-icon-box-lg)]",
          "w-[var(--app-card-icon-box-lg)]",
          "[&_svg]:h-[var(--app-card-icon-lg)]",
          "[&_svg]:w-[var(--app-card-icon-lg)]",
        ],
        xl: [
          "h-[var(--app-card-icon-box-xl)]",
          "w-[var(--app-card-icon-box-xl)]",
          "[&_svg]:h-[var(--app-card-icon-xl)]",
          "[&_svg]:w-[var(--app-card-icon-xl)]",
        ],
      },
    },

    defaultVariants: {
      size: "sm",
    },
  },
);
