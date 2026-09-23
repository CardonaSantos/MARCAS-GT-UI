import { cva } from "class-variance-authority";

export const appFieldVariants = cva(
  ["w-full min-w-0", "[font-family:var(--app-font-sans)]"],
  {
    variants: {
      size: {
        xs: "gap-[var(--app-field-gap-xs)]",
        sm: "gap-[var(--app-field-gap-sm)]",
        md: "gap-[var(--app-field-gap-md)]",
        lg: "gap-[var(--app-field-gap-lg)]",
      },

      orientation: {
        vertical: "flex flex-col",
        horizontal: [
          "grid grid-cols-1",
          "sm:grid-cols-[9rem_minmax(0,1fr)]",
          "sm:items-start",
        ],
      },

      disabled: {
        true: "opacity-[var(--app-field-disabled-opacity)]",
        false: "",
      },
    },

    defaultVariants: {
      size: "xs",
      orientation: "vertical",
      disabled: false,
    },
  },
);

export const appFieldHeaderVariants = cva(["min-w-0"], {
  variants: {
    size: {
      xs: "space-y-0.5",
      sm: "space-y-0.5",
      md: "space-y-1",
      lg: "space-y-1",
    },

    orientation: {
      vertical: "",
      horizontal: "sm:pt-1",
    },
  },

  defaultVariants: {
    size: "xs",
    orientation: "vertical",
  },
});

export const appFieldContentVariants = cva(["min-w-0"], {
  variants: {
    size: {
      xs: "space-y-[var(--app-field-content-gap-xs)]",
      sm: "space-y-[var(--app-field-content-gap-sm)]",
      md: "space-y-[var(--app-field-content-gap-md)]",
      lg: "space-y-[var(--app-field-content-gap-lg)]",
    },
  },

  defaultVariants: {
    size: "xs",
  },
});

export const appFieldLabelVariants = cva(
  [
    "inline-flex items-center gap-1",
    "font-medium leading-none",
    "text-[hsl(var(--app-field-label-foreground))]",
    "cursor-pointer",
  ],
  {
    variants: {
      size: {
        xs: "text-[length:var(--app-field-label-size-xs)]",
        sm: "text-[length:var(--app-field-label-size-sm)]",
        md: "text-[length:var(--app-field-label-size-md)]",
        lg: "text-[length:var(--app-field-label-size-lg)]",
      },

      disabled: {
        true: "cursor-not-allowed",
        false: "",
      },
    },

    defaultVariants: {
      size: "xs",
      disabled: false,
    },
  },
);

export const appFieldDescriptionVariants = cva(
  ["leading-snug", "text-[hsl(var(--app-field-description-foreground))]"],
  {
    variants: {
      size: {
        xs: "text-[length:var(--app-field-description-size-xs)]",
        sm: "text-[length:var(--app-field-description-size-sm)]",
        md: "text-[length:var(--app-field-description-size-md)]",
        lg: "text-[length:var(--app-field-description-size-lg)]",
      },
    },

    defaultVariants: {
      size: "xs",
    },
  },
);

export const appFieldMessageVariants = cva(["leading-snug"], {
  variants: {
    size: {
      xs: "text-[length:var(--app-field-message-size-xs)]",
      sm: "text-[length:var(--app-field-message-size-sm)]",
      md: "text-[length:var(--app-field-message-size-md)]",
      lg: "text-[length:var(--app-field-message-size-lg)]",
    },

    tone: {
      hint: "text-[hsl(var(--app-field-hint-foreground))]",
      error: "text-[hsl(var(--app-field-error-foreground))]",
    },
  },

  defaultVariants: {
    size: "xs",
    tone: "hint",
  },
});

export const appFieldRequiredVariants = cva([
  "select-none",
  "font-medium",
  "text-[hsl(var(--app-field-required-foreground))]",
]);
