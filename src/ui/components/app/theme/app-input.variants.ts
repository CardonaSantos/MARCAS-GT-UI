import { cva } from "class-variance-authority";

export const appInputVariants = cva(
  [
    "flex w-full",
    "[font-family:var(--app-font-sans)]",
    "border",
    "shadow-none",
    "outline-none",
    "transition-colors",
    "disabled:cursor-not-allowed",
    "disabled:opacity-[var(--app-disabled-opacity)]",
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
          "h-[var(--app-input-height-xs)]",
          "px-[var(--app-input-px-xs)]",
          "text-[11px]",
        ],

        sm: [
          "h-[var(--app-input-height-sm)]",
          "px-[var(--app-input-px-sm)]",
          "text-xs",
        ],

        md: [
          "h-[var(--app-input-height-md)]",
          "px-[var(--app-input-px-md)]",
          "text-sm",
        ],

        lg: [
          "h-[var(--app-input-height-lg)]",
          "px-[var(--app-input-px-lg)]",
          "text-sm",
        ],
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

      withLeftIcon: {
        true: "",
        false: "",
      },

      withRightElement: {
        true: "",
        false: "",
      },
    },

    compoundVariants: [
      {
        size: "xs",
        withLeftIcon: true,
        className: "pl-7",
      },
      {
        size: "sm",
        withLeftIcon: true,
        className: "pl-8",
      },
      {
        size: "md",
        withLeftIcon: true,
        className: "pl-9",
      },
      {
        size: "lg",
        withLeftIcon: true,
        className: "pl-10",
      },

      {
        size: "xs",
        withRightElement: true,
        className: "pr-7",
      },
      {
        size: "sm",
        withRightElement: true,
        className: "pr-8",
      },
      {
        size: "md",
        withRightElement: true,
        className: "pr-9",
      },
      {
        size: "lg",
        withRightElement: true,
        className: "pr-10",
      },
    ],

    defaultVariants: {
      variant: "default",
      size: "sm",
      radius: "sm",
      intent: "default",
      fieldWidth: "full",
      withLeftIcon: false,
      withRightElement: false,
    },
  },
);
