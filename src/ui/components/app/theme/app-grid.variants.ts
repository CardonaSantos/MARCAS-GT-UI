import { cva } from "class-variance-authority";

export const appGridVariants = cva(
  [
    "grid",
    "w-full",
    "min-w-0",
    "[font-family:var(--app-font-sans)]",

    /**
     * Las columnas vienen por CSS variables.
     * Esto evita usar clases dinámicas tipo `grid-cols-${cols}`.
     */
    "grid-cols-[var(--app-grid-template-base)]",
    "sm:grid-cols-[var(--app-grid-template-sm)]",
    "md:grid-cols-[var(--app-grid-template-md)]",
    "lg:grid-cols-[var(--app-grid-template-lg)]",
    "xl:grid-cols-[var(--app-grid-template-xl)]",
    "2xl:grid-cols-[var(--app-grid-template-2xl)]",
  ],
  {
    variants: {
      gap: {
        none: "gap-[var(--app-grid-gap-none)]",
        xs: "gap-[var(--app-grid-gap-xs)]",
        sm: "gap-[var(--app-grid-gap-sm)]",
        md: "gap-[var(--app-grid-gap-md)]",
        lg: "gap-[var(--app-grid-gap-lg)]",
        xl: "gap-[var(--app-grid-gap-xl)]",
        "2xl": "gap-[var(--app-grid-gap-2xl)]",
      },

      rowGap: {
        inherit: "",
        none: "gap-y-[var(--app-grid-gap-none)]",
        xs: "gap-y-[var(--app-grid-gap-xs)]",
        sm: "gap-y-[var(--app-grid-gap-sm)]",
        md: "gap-y-[var(--app-grid-gap-md)]",
        lg: "gap-y-[var(--app-grid-gap-lg)]",
        xl: "gap-y-[var(--app-grid-gap-xl)]",
        "2xl": "gap-y-[var(--app-grid-gap-2xl)]",
      },

      columnGap: {
        inherit: "",
        none: "gap-x-[var(--app-grid-gap-none)]",
        xs: "gap-x-[var(--app-grid-gap-xs)]",
        sm: "gap-x-[var(--app-grid-gap-sm)]",
        md: "gap-x-[var(--app-grid-gap-md)]",
        lg: "gap-x-[var(--app-grid-gap-lg)]",
        xl: "gap-x-[var(--app-grid-gap-xl)]",
        "2xl": "gap-x-[var(--app-grid-gap-2xl)]",
      },

      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
      },

      justify: {
        start: "justify-items-start",
        center: "justify-items-center",
        end: "justify-items-end",
        stretch: "justify-items-stretch",
      },

      dense: {
        true: "grid-flow-dense",
        false: "",
      },
    },

    defaultVariants: {
      gap: "sm",
      rowGap: "inherit",
      columnGap: "inherit",
      align: "stretch",
      justify: "stretch",
      dense: false,
    },
  },
);

export const appGridItemVariants = cva(
  [
    "min-w-0",

    /**
     * El span también viene por CSS variables.
     */
    "[grid-column:var(--app-grid-item-base)]",
    "sm:[grid-column:var(--app-grid-item-sm)]",
    "md:[grid-column:var(--app-grid-item-md)]",
    "lg:[grid-column:var(--app-grid-item-lg)]",
    "xl:[grid-column:var(--app-grid-item-xl)]",
    "2xl:[grid-column:var(--app-grid-item-2xl)]",
  ],
  {
    variants: {
      align: {
        auto: "",
        start: "self-start",
        center: "self-center",
        end: "self-end",
        stretch: "self-stretch",
      },
    },

    defaultVariants: {
      align: "auto",
    },
  },
);
