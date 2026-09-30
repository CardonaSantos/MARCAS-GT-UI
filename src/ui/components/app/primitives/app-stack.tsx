import * as React from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { appStackVariants } from "../theme/app-stack.variants";
import type { AppLayoutBreakpoint } from "./app-split";

type AppStackDirection = "row" | "column" | "row-reverse" | "column-reverse";

type AppStackResponsiveValue<T> = T | Partial<Record<AppLayoutBreakpoint, T>>;

type AppStackCssVar =
  | "--app-stack-direction-base"
  | "--app-stack-direction-sm"
  | "--app-stack-direction-md"
  | "--app-stack-direction-lg"
  | "--app-stack-direction-xl"
  | "--app-stack-direction-2xl";

type AppStackStyle = React.CSSProperties &
  Partial<Record<AppStackCssVar, string>>;

const BREAKPOINTS: AppLayoutBreakpoint[] = [
  "base",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
];

function normalizeResponsiveValue<T>(
  value: AppStackResponsiveValue<T> | undefined,
  fallback: T,
): Record<AppLayoutBreakpoint, T> {
  if (value === undefined || value === null) {
    return {
      base: fallback,
      sm: fallback,
      md: fallback,
      lg: fallback,
      xl: fallback,
      "2xl": fallback,
    };
  }

  if (typeof value !== "object") {
    return {
      base: value,
      sm: value,
      md: value,
      lg: value,
      xl: value,
      "2xl": value,
    };
  }

  const responsiveValue = value as Partial<Record<AppLayoutBreakpoint, T>>;

  let current = responsiveValue.base ?? fallback;

  return BREAKPOINTS.reduce(
    (acc, breakpoint) => {
      current = responsiveValue[breakpoint] ?? current;
      acc[breakpoint] = current;
      return acc;
    },
    {} as Record<AppLayoutBreakpoint, T>,
  );
}

function buildStackDirectionVars(
  direction: AppStackResponsiveValue<AppStackDirection>,
): AppStackStyle {
  const directions = normalizeResponsiveValue<AppStackDirection>(
    direction,
    "column",
  );

  const style: AppStackStyle = {};

  for (const breakpoint of BREAKPOINTS) {
    const cssVar = `--app-stack-direction-${breakpoint}` as AppStackCssVar;

    style[cssVar] = directions[breakpoint];
  }

  return style;
}

export interface AppStackProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appStackVariants> {
  direction?: AppStackResponsiveValue<AppStackDirection>;
}

const AppStack = React.forwardRef<HTMLDivElement, AppStackProps>(
  (
    {
      className,
      style,
      direction = "column",
      gap = "sm",
      align = "stretch",
      justify = "start",
      wrap = false,
      fullWidth = true,
      ...props
    },
    ref,
  ) => {
    const directionVars = buildStackDirectionVars(direction);

    return (
      <div
        ref={ref}
        className={cn(
          appStackVariants({
            gap,
            align,
            justify,
            wrap,
            fullWidth,
          }),
          className,
        )}
        style={{
          ...directionVars,
          ...style,
        }}
        {...props}
      />
    );
  },
);

AppStack.displayName = "AppStack";

export { AppStack, appStackVariants };

export type { AppStackDirection, AppStackResponsiveValue };
