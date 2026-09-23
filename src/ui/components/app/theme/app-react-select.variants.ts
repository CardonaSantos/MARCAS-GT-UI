import { cva } from "class-variance-authority";

export const appSelectControlVariants = cva(
  [
    "flex w-full items-center",
    "[font-family:var(--app-font-sans)]",
    "border",
    "shadow-none",
    "outline-none",
    "transition-colors",
    "cursor-pointer",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-[hsl(var(--app-input-bg))]",
          "text-[hsl(var(--app-input-foreground))]",
          "border-[hsl(var(--app-input-border))]",
          "hover:border-[hsl(var(--app-input-border-hover))]",
        ],
        filled: [
          "bg-[hsl(var(--app-input-filled-bg))]",
          "text-[hsl(var(--app-input-foreground))]",
          "border-transparent",
          "hover:bg-[hsl(var(--app-input-filled-bg-hover))]",
        ],
        ghost: [
          "bg-[hsl(var(--app-input-ghost-bg))]",
          "text-[hsl(var(--app-input-foreground))]",
          "border-transparent",
          "hover:bg-[hsl(var(--app-input-ghost-bg-hover))]",
        ],
        underline: [
          "rounded-none",
          "border-x-0 border-t-0",
          "bg-transparent",
          "px-0",
          "text-[hsl(var(--app-input-foreground))]",
          "border-[hsl(var(--app-input-border))]",
          "hover:border-[hsl(var(--app-input-border-hover))]",
        ],
      },

      size: {
        xs: ["min-h-[var(--app-input-height-xs)]", "text-[11px]"],
        sm: ["min-h-[var(--app-input-height-sm)]", "text-xs"],
        md: ["min-h-[var(--app-input-height-md)]", "text-sm"],
        lg: ["min-h-[var(--app-input-height-lg)]", "text-sm"],
      },

      radius: {
        none: "rounded-none",
        xs: "rounded-[var(--app-radius-xs)]",
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        lg: "rounded-[var(--app-radius-lg)]",
        full: "rounded-[var(--app-radius-full)]",
      },

      intent: {
        default: "",
        error: ["border-[hsl(var(--app-danger))]"],
        success: ["border-[hsl(var(--app-success))]"],
        warning: ["border-[hsl(var(--app-warning))]"],
      },

      fieldWidth: {
        auto: "w-auto",
        full: "w-full",
      },

      isFocused: {
        true: [
          "ring-2",
          "ring-[hsl(var(--app-input-border-focus))]",
          "border-[hsl(var(--app-input-border-focus))]",
        ],
        false: "",
      },

      isDisabled: {
        true: [
          "cursor-not-allowed",
          "opacity-[var(--app-disabled-opacity)]",
          "bg-[hsl(var(--app-input-bg-disabled))]",
        ],
        false: "",
      },
    },

    compoundVariants: [
      {
        intent: "error",
        isFocused: true,
        className: [
          "ring-[hsl(var(--app-danger))]",
          "border-[hsl(var(--app-danger))]",
        ],
      },
      {
        intent: "success",
        isFocused: true,
        className: [
          "ring-[hsl(var(--app-success))]",
          "border-[hsl(var(--app-success))]",
        ],
      },
      {
        intent: "warning",
        isFocused: true,
        className: [
          "ring-[hsl(var(--app-warning))]",
          "border-[hsl(var(--app-warning))]",
        ],
      },
    ],

    defaultVariants: {
      variant: "default",
      size: "sm",
      radius: "sm",
      intent: "default",
      fieldWidth: "full",
      isFocused: false,
      isDisabled: false,
    },
  },
);

export const appSelectValueContainerVariants = cva(["flex items-center"], {
  variants: {
    size: {
      xs: "px-[var(--app-input-px-xs)] py-0",
      sm: "px-[var(--app-input-px-sm)] py-0",
      md: "px-[var(--app-input-px-md)] py-0",
      lg: "px-[var(--app-input-px-lg)] py-0",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

export const appSelectTextVariants = cva(
  ["[font-family:var(--app-font-sans)]", "truncate"],
  {
    variants: {
      size: {
        xs: "text-[11px]",
        sm: "text-xs",
        md: "text-sm",
        lg: "text-sm",
      },
      tone: {
        value: "text-[hsl(var(--app-select-value-foreground))]",
        placeholder: "text-[hsl(var(--app-input-placeholder))]",
        muted: "text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "sm",
      tone: "value",
    },
  },
);

export const appSelectIndicatorVariants = cva(
  [
    "flex items-center justify-center",
    "text-[hsl(var(--app-select-indicator))]",
    "transition-colors",
    "hover:text-[hsl(var(--app-select-indicator-hover))]",
  ],
  {
    variants: {
      size: {
        xs: "px-1 [&_svg]:h-3 [&_svg]:w-3",
        sm: "px-1.5 [&_svg]:h-3.5 [&_svg]:w-3.5",
        md: "px-2 [&_svg]:h-4 [&_svg]:w-4",
        lg: "px-2.5 [&_svg]:h-4 [&_svg]:w-4",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

export const appSelectMenuVariants = cva(
  [
    "overflow-hidden",
    "border",
    "bg-[hsl(var(--app-select-menu-bg))]",
    "border-[hsl(var(--app-select-menu-border))]",
    "shadow-[var(--app-select-menu-shadow)]",
    "z-[var(--app-select-menu-z-index)]",
  ],
  {
    variants: {
      radius: {
        none: "rounded-none",
        xs: "rounded-[var(--app-radius-xs)]",
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        lg: "rounded-[var(--app-radius-lg)]",
        full: "rounded-[var(--app-radius-lg)]",
      },
    },
    defaultVariants: {
      radius: "sm",
    },
  },
);

export const appSelectOptionVariants = cva(
  [
    "cursor-pointer",
    "select-none",
    "[font-family:var(--app-font-sans)]",
    "transition-colors",
    "text-[hsl(var(--app-select-option-foreground))]",
  ],
  {
    variants: {
      size: {
        xs: "px-2 py-1 text-[11px]",
        sm: "px-2 py-1.5 text-xs",
        md: "px-2.5 py-2 text-sm",
        lg: "px-3 py-2.5 text-sm",
      },

      isFocused: {
        true: [
          "bg-[hsl(var(--app-select-option-bg-focused))]",
          "text-[hsl(var(--app-select-option-foreground-focused))]",
        ],
        false: "",
      },

      isSelected: {
        true: [
          "bg-[hsl(var(--app-select-option-bg-selected))]",
          "text-[hsl(var(--app-select-option-foreground-selected))]",
        ],
        false: "",
      },

      isDisabled: {
        true: ["cursor-not-allowed", "opacity-[var(--app-disabled-opacity)]"],
        false: "",
      },
    },

    compoundVariants: [
      {
        isSelected: true,
        isFocused: true,
        className: [
          "bg-[hsl(var(--app-select-option-bg-selected-hover))]",
          "text-[hsl(var(--app-select-option-foreground-selected))]",
        ],
      },
    ],

    defaultVariants: {
      size: "sm",
      isFocused: false,
      isSelected: false,
      isDisabled: false,
    },
  },
);

export const appSelectMessageVariants = cva(
  ["[font-family:var(--app-font-sans)]", "text-muted-foreground"],
  {
    variants: {
      size: {
        xs: "px-2 py-1 text-[11px]",
        sm: "px-2 py-1.5 text-xs",
        md: "px-2.5 py-2 text-sm",
        lg: "px-3 py-2.5 text-sm",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

// MULTI
export const appSelectMultiValueVariants = cva(
  [
    "inline-flex items-center",
    "border",
    "bg-[hsl(var(--app-select-multi-value-bg))]",
    "text-[hsl(var(--app-select-multi-value-foreground))]",
    "border-[hsl(var(--app-select-multi-value-border))]",
    "overflow-hidden",
    "max-w-full",
  ],
  {
    variants: {
      size: {
        xs: "min-h-4 text-[10px]",
        sm: "min-h-5 text-[11px]",
        md: "min-h-6 text-xs",
        lg: "min-h-7 text-sm",
      },

      radius: {
        none: "rounded-none",
        xs: "rounded-[var(--app-radius-xs)]",
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        lg: "rounded-[var(--app-radius-lg)]",
        full: "rounded-[var(--app-radius-full)]",
      },
    },

    defaultVariants: {
      size: "sm",
      radius: "sm",
    },
  },
);

export const appSelectMultiValueLabelVariants = cva(
  ["[font-family:var(--app-font-sans)]", "truncate", "font-medium"],
  {
    variants: {
      size: {
        xs: "px-1 text-[10px]",
        sm: "px-1.5 text-[11px]",
        md: "px-2 text-xs",
        lg: "px-2.5 text-sm",
      },
    },

    defaultVariants: {
      size: "sm",
    },
  },
);

export const appSelectMultiValueRemoveVariants = cva(
  [
    "flex items-center justify-center",
    "text-[hsl(var(--app-select-multi-value-remove))]",
    "transition-colors",
    "hover:text-[hsl(var(--app-select-multi-value-remove-hover))]",
    "hover:bg-[hsl(var(--app-select-multi-value-remove-bg-hover))]",
  ],
  {
    variants: {
      size: {
        xs: "px-1 [&_svg]:h-2.5 [&_svg]:w-2.5",
        sm: "px-1 [&_svg]:h-3 [&_svg]:w-3",
        md: "px-1.5 [&_svg]:h-3.5 [&_svg]:w-3.5",
        lg: "px-2 [&_svg]:h-4 [&_svg]:w-4",
      },
    },

    defaultVariants: {
      size: "sm",
    },
  },
);
