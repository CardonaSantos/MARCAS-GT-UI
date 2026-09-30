import { cva } from "class-variance-authority";

export const appSplitVariants = cva(
  [
    "grid",
    "w-full",
    "min-w-0",
    "[font-family:var(--app-font-sans)]",

    /**
     * Grid template responsive por CSS variables.
     * Mobile first.
     */
    "grid-cols-[var(--app-split-template-base)]",
    "sm:grid-cols-[var(--app-split-template-sm)]",
    "md:grid-cols-[var(--app-split-template-md)]",
    "lg:grid-cols-[var(--app-split-template-lg)]",
    "xl:grid-cols-[var(--app-split-template-xl)]",
    "2xl:grid-cols-[var(--app-split-template-2xl)]",
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
      },
    },

    defaultVariants: {
      gap: "sm",
      align: "stretch",
    },
  },
);

export const appSplitPaneVariants = cva(["min-w-0", "min-h-0"], {
  variants: {
    scrollable: {
      true: "overflow-auto",
      false: "",
    },

    sticky: {
      true: ["self-start", "lg:sticky", "top-[var(--app-split-sticky-top)]"],
      false: "",
    },
  },

  defaultVariants: {
    scrollable: false,
    sticky: false,
  },
});
