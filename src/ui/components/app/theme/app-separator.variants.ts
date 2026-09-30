import { cva } from "class-variance-authority";

export const appSeparatorVariants = cva(
  ["shrink-0", "bg-[hsl(var(--app-separator-default))]"],
  {
    variants: {
      orientation: {
        horizontal: "w-full",
        vertical: "h-full self-stretch",
      },

      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
      },

      tone: {
        default: "bg-[hsl(var(--app-separator-default))]",
        muted: "bg-[hsl(var(--app-separator-muted))]",
        strong: "bg-[hsl(var(--app-separator-strong))]",
        primary: "bg-[hsl(var(--app-separator-primary))]",
        success: "bg-[hsl(var(--app-separator-success))]",
        warning: "bg-[hsl(var(--app-separator-warning))]",
        danger: "bg-[hsl(var(--app-separator-danger))]",
        info: "bg-[hsl(var(--app-separator-info))]",
      },

      spacing: {
        none: "",
        xs: "",
        sm: "",
        md: "",
        lg: "",
      },

      decorative: {
        true: "",
        false: "",
      },
    },

    compoundVariants: [
      {
        orientation: "horizontal",
        size: "xs",
        className: "h-[var(--app-separator-thickness-xs)]",
      },
      {
        orientation: "horizontal",
        size: "sm",
        className: "h-[var(--app-separator-thickness-sm)]",
      },
      {
        orientation: "horizontal",
        size: "md",
        className: "h-[var(--app-separator-thickness-md)]",
      },
      {
        orientation: "horizontal",
        size: "lg",
        className: "h-[var(--app-separator-thickness-lg)]",
      },

      {
        orientation: "vertical",
        size: "xs",
        className: "w-[var(--app-separator-thickness-xs)]",
      },
      {
        orientation: "vertical",
        size: "sm",
        className: "w-[var(--app-separator-thickness-sm)]",
      },
      {
        orientation: "vertical",
        size: "md",
        className: "w-[var(--app-separator-thickness-md)]",
      },
      {
        orientation: "vertical",
        size: "lg",
        className: "w-[var(--app-separator-thickness-lg)]",
      },

      {
        orientation: "horizontal",
        spacing: "xs",
        className: "my-[var(--app-separator-spacing-xs)]",
      },
      {
        orientation: "horizontal",
        spacing: "sm",
        className: "my-[var(--app-separator-spacing-sm)]",
      },
      {
        orientation: "horizontal",
        spacing: "md",
        className: "my-[var(--app-separator-spacing-md)]",
      },
      {
        orientation: "horizontal",
        spacing: "lg",
        className: "my-[var(--app-separator-spacing-lg)]",
      },

      {
        orientation: "vertical",
        spacing: "xs",
        className: "mx-[var(--app-separator-spacing-xs)]",
      },
      {
        orientation: "vertical",
        spacing: "sm",
        className: "mx-[var(--app-separator-spacing-sm)]",
      },
      {
        orientation: "vertical",
        spacing: "md",
        className: "mx-[var(--app-separator-spacing-md)]",
      },
      {
        orientation: "vertical",
        spacing: "lg",
        className: "mx-[var(--app-separator-spacing-lg)]",
      },
    ],

    defaultVariants: {
      orientation: "horizontal",
      size: "xs",
      tone: "default",
      spacing: "sm",
      decorative: true,
    },
  },
);
