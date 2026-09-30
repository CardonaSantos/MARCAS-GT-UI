import { cva } from "class-variance-authority";

export const appStackVariants = cva(
  [
    "flex",
    "min-w-0",
    "[font-family:var(--app-font-sans)]",

    /**
     * Dirección responsive por CSS variables.
     */
    "[flex-direction:var(--app-stack-direction-base)]",
    "sm:[flex-direction:var(--app-stack-direction-sm)]",
    "md:[flex-direction:var(--app-stack-direction-md)]",
    "lg:[flex-direction:var(--app-stack-direction-lg)]",
    "xl:[flex-direction:var(--app-stack-direction-xl)]",
    "2xl:[flex-direction:var(--app-stack-direction-2xl)]",
  ],
  {
    variants: {
      gap: {
        none: "gap-[var(--app-layout-gap-none)]",
        xs: "gap-[var(--app-layout-gap-xs)]",
        sm: "gap-[var(--app-layout-gap-sm)]",
        md: "gap-[var(--app-layout-gap-md)]",
        lg: "gap-[var(--app-layout-gap-lg)]",
        xl: "gap-[var(--app-layout-gap-xl)]",
        "2xl": "gap-[var(--app-layout-gap-2xl)]",
      },

      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline",
      },

      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      },

      wrap: {
        true: "flex-wrap",
        false: "flex-nowrap",
      },

      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },

    defaultVariants: {
      gap: "sm",
      align: "stretch",
      justify: "start",
      wrap: false,
      fullWidth: true,
    },
  },
);
