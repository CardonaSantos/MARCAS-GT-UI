import { cva } from "class-variance-authority";

export const appTextareaVariants = cva(
  [
    "flex w-full",
    "[font-family:var(--app-font-sans)]",
    "border",
    "shadow-none",
    "outline-none",
    "transition-colors",
    "disabled:cursor-not-allowed",
    "disabled:opacity-[var(--app-disabled-opacity)]",
    "disabled:bg-[hsl(var(--app-input-bg-disabled))]",
    "placeholder:text-[hsl(var(--app-input-placeholder))]",
    "focus-visible:ring-2",
    "focus-visible:ring-[hsl(var(--app-input-border-focus))]",
    "focus-visible:ring-offset-0",
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
        xs: [
          "min-h-[var(--app-textarea-min-height-xs)]",
          "px-[var(--app-textarea-px-xs)]",
          "py-[var(--app-textarea-py-xs)]",
          "text-[11px]",
        ],

        sm: [
          "min-h-[var(--app-textarea-min-height-sm)]",
          "px-[var(--app-textarea-px-sm)]",
          "py-[var(--app-textarea-py-sm)]",
          "text-xs",
        ],

        md: [
          "min-h-[var(--app-textarea-min-height-md)]",
          "px-[var(--app-textarea-px-md)]",
          "py-[var(--app-textarea-py-md)]",
          "text-sm",
        ],

        lg: [
          "min-h-[var(--app-textarea-min-height-lg)]",
          "px-[var(--app-textarea-px-lg)]",
          "py-[var(--app-textarea-py-lg)]",
          "text-sm",
        ],
      },

      radius: {
        none: "rounded-none",
        xs: "rounded-[var(--app-radius-xs)]",
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        lg: "rounded-[var(--app-radius-lg)]",
      },

      intent: {
        default: "",
        error: [
          "border-[hsl(var(--app-danger))]",
          "focus-visible:ring-[hsl(var(--app-danger))]",
        ],
        success: [
          "border-[hsl(var(--app-success))]",
          "focus-visible:ring-[hsl(var(--app-success))]",
        ],
        warning: [
          "border-[hsl(var(--app-warning))]",
          "focus-visible:ring-[hsl(var(--app-warning))]",
        ],
      },

      fieldWidth: {
        auto: "w-auto",
        full: "w-full",
      },

      resizeMode: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },

      withRightElement: {
        true: "",
        false: "",
      },
    },

    compoundVariants: [
      {
        size: "xs",
        withRightElement: true,
        className: "pr-8",
      },
      {
        size: "sm",
        withRightElement: true,
        className: "pr-9",
      },
      {
        size: "md",
        withRightElement: true,
        className: "pr-10",
      },
      {
        size: "lg",
        withRightElement: true,
        className: "pr-11",
      },
    ],

    defaultVariants: {
      variant: "default",
      size: "sm",
      radius: "sm",
      intent: "default",
      fieldWidth: "full",
      resizeMode: "vertical",
      withRightElement: false,
    },
  },
);
