import { cva } from "class-variance-authority";

export const appSearchInputWrapperVariants = cva(["min-w-0"], {
  variants: {
    wrapperWidth: {
      auto: "w-auto",
      full: "w-full",
      fit: "w-fit",
    },

    minWidth: {
      none: "min-w-0",
      xs: "min-w-[var(--app-search-min-width-xs)]",
      sm: "min-w-[var(--app-search-min-width-sm)]",
      md: "min-w-[var(--app-search-min-width-md)]",
      lg: "min-w-[var(--app-search-min-width-lg)]",
    },
  },

  defaultVariants: {
    wrapperWidth: "full",
    minWidth: "none",
  },
});

export const appSearchInputIconVariants = cva(
  [
    "text-[hsl(var(--app-search-icon))]",
    "transition-colors",
    "duration-[var(--app-motion-duration-fast)]",
    "ease-[var(--app-motion-ease-standard)]",
  ],
  {
    variants: {
      active: {
        true: "text-[hsl(var(--app-search-icon-active))]",
        false: "",
      },

      loading: {
        true: "text-[hsl(var(--app-search-loading))]",
        false: "",
      },
    },

    defaultVariants: {
      active: false,
      loading: false,
    },
  },
);
