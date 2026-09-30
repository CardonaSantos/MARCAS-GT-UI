import { cva } from "class-variance-authority";

export const appContainerVariants = cva(
  ["w-full", "min-w-0", "[font-family:var(--app-font-sans)]"],
  {
    variants: {
      size: {
        none: "max-w-none",
        xs: "max-w-[var(--app-container-max-xs)]",
        sm: "max-w-[var(--app-container-max-sm)]",
        md: "max-w-[var(--app-container-max-md)]",
        lg: "max-w-[var(--app-container-max-lg)]",
        xl: "max-w-[var(--app-container-max-xl)]",
        "2xl": "max-w-[var(--app-container-max-2xl)]",
        full: "max-w-full",
      },

      paddingX: {
        none: "px-0",
        xs: "px-[var(--app-container-padding-x-xs)]",
        sm: "px-[var(--app-container-padding-x-sm)]",
        md: "px-[var(--app-container-padding-x-md)]",
        lg: "px-[var(--app-container-padding-x-lg)]",
        xl: "px-[var(--app-container-padding-x-xl)]",
      },

      paddingY: {
        none: "py-0",
        xs: "py-[var(--app-container-padding-y-xs)]",
        sm: "py-[var(--app-container-padding-y-sm)]",
        md: "py-[var(--app-container-padding-y-md)]",
        lg: "py-[var(--app-container-padding-y-lg)]",
        xl: "py-[var(--app-container-padding-y-xl)]",
      },

      centered: {
        true: "mx-auto",
        false: "",
      },

      fullHeight: {
        true: "min-h-screen",
        false: "",
      },
    },

    defaultVariants: {
      size: "xl",
      paddingX: "sm",
      paddingY: "none",
      centered: true,
      fullHeight: false,
    },
  },
);
