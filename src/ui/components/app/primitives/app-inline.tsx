import * as React from "react";

import { AppStack, type AppStackProps } from "./app-stack";

export interface AppInlineProps extends Omit<AppStackProps, "direction"> {
  collapseBelow?: "never" | "sm" | "md" | "lg" | "xl" | "2xl";
}

const AppInline = React.forwardRef<HTMLDivElement, AppInlineProps>(
  (
    {
      collapseBelow = "never",
      gap = "xs",
      align = "center",
      justify = "start",
      wrap = true,
      fullWidth = false,
      ...props
    },
    ref,
  ) => {
    const direction =
      collapseBelow === "never"
        ? "row"
        : {
            base: "column" as const,
            [collapseBelow]: "row" as const,
          };

    return (
      <AppStack
        ref={ref}
        direction={direction}
        gap={gap}
        align={align}
        justify={justify}
        wrap={wrap}
        fullWidth={fullWidth}
        {...props}
      />
    );
  },
);

AppInline.displayName = "AppInline";

export { AppInline };
