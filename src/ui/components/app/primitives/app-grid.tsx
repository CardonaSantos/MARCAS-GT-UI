import * as React from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  appGridItemVariants,
  appGridVariants,
} from "../theme/app-grid.variants";

type Breakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";

type AppGridColumnCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type AppGridColumnValue = AppGridColumnCount | "auto";

type AppGridResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

type AppGridSpanValue = AppGridColumnCount | "full" | "auto";

type AppGridTemplateMode = "fixed" | "autoFit";

type AppGridTemplateCssVar =
  | "--app-grid-template-base"
  | "--app-grid-template-sm"
  | "--app-grid-template-md"
  | "--app-grid-template-lg"
  | "--app-grid-template-xl"
  | "--app-grid-template-2xl";

type AppGridItemCssVar =
  | "--app-grid-item-base"
  | "--app-grid-item-sm"
  | "--app-grid-item-md"
  | "--app-grid-item-lg"
  | "--app-grid-item-xl"
  | "--app-grid-item-2xl";

type AppGridCssVar = AppGridTemplateCssVar | AppGridItemCssVar;

type AppGridStyle = React.CSSProperties &
  Partial<Record<AppGridCssVar, string>>;

const BREAKPOINTS: Breakpoint[] = ["base", "sm", "md", "lg", "xl", "2xl"];

function normalizeResponsiveValue<T>(
  value: AppGridResponsiveValue<T> | undefined,
  fallback: T,
): Record<Breakpoint, T> {
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

  const responsiveValue = value as Partial<Record<Breakpoint, T>>;

  let current = responsiveValue.base ?? fallback;

  return BREAKPOINTS.reduce(
    (acc, breakpoint) => {
      current = responsiveValue[breakpoint] ?? current;
      acc[breakpoint] = current;
      return acc;
    },
    {} as Record<Breakpoint, T>,
  );
}

function buildFixedTemplate(value: AppGridColumnValue): string {
  if (value === "auto") {
    return "repeat(auto-fit, minmax(min(var(--app-grid-auto-min-md), 100%), 1fr))";
  }

  return `repeat(${value}, minmax(0, 1fr))`;
}

function buildAutoFitTemplate(minWidth: string): string {
  return `repeat(auto-fit, minmax(min(${minWidth}, 100%), 1fr))`;
}

function buildGridTemplateVars({
  mode,
  cols,
  autoFitMin,
}: {
  mode: AppGridTemplateMode;
  cols?: AppGridResponsiveValue<AppGridColumnValue>;
  autoFitMin?: string;
}): AppGridStyle {
  const templates =
    mode === "autoFit"
      ? normalizeResponsiveValue<string>(
          autoFitMin,
          "var(--app-grid-auto-min-md)",
        )
      : normalizeResponsiveValue<AppGridColumnValue>(cols, 1);

  const style: AppGridStyle = {};

  for (const breakpoint of BREAKPOINTS) {
    const cssVar = `--app-grid-template-${breakpoint}` as AppGridTemplateCssVar;

    style[cssVar] =
      mode === "autoFit"
        ? buildAutoFitTemplate(templates[breakpoint] as string)
        : buildFixedTemplate(templates[breakpoint] as AppGridColumnValue);
  }

  return style;
}

function buildGridItemValue(value: AppGridSpanValue): string {
  if (value === "full") return "1 / -1";
  if (value === "auto") return "auto";

  return `span ${value} / span ${value}`;
}

function buildGridItemVars(
  span?: AppGridResponsiveValue<AppGridSpanValue>,
): AppGridStyle {
  const spans = normalizeResponsiveValue<AppGridSpanValue>(span, "auto");

  const style: AppGridStyle = {};

  for (const breakpoint of BREAKPOINTS) {
    const cssVar = `--app-grid-item-${breakpoint}` as AppGridItemCssVar;

    style[cssVar] = buildGridItemValue(spans[breakpoint]);
  }

  return style;
}

export interface AppGridProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appGridVariants> {
  /**
   * Columnas responsivas.
   *
   * Ejemplo:
   * cols={{ base: 1, md: 2, xl: 4 }}
   */
  cols?: AppGridResponsiveValue<AppGridColumnValue>;

  /**
   * fixed: columnas exactas.
   * autoFit: columnas automáticas según ancho mínimo.
   */
  mode?: AppGridTemplateMode;

  /**
   * Solo aplica cuando mode="autoFit".
   */
  autoFitMin?: string;
}

const AppGrid = React.forwardRef<HTMLDivElement, AppGridProps>(
  (
    {
      className,
      style,
      cols = 1,
      mode = "fixed",
      autoFitMin = "var(--app-grid-auto-min-md)",
      gap = "sm",
      rowGap = "inherit",
      columnGap = "inherit",
      align = "stretch",
      justify = "stretch",
      dense = false,
      ...props
    },
    ref,
  ) => {
    const templateVars = buildGridTemplateVars({
      mode,
      cols,
      autoFitMin,
    });

    return (
      <div
        ref={ref}
        className={cn(
          appGridVariants({
            gap,
            rowGap,
            columnGap,
            align,
            justify,
            dense,
          }),
          className,
        )}
        style={{
          ...templateVars,
          ...style,
        }}
        {...props}
      />
    );
  },
);

AppGrid.displayName = "AppGrid";

export interface AppGridItemProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appGridItemVariants> {
  /**
   * Span responsivo.
   *
   * Ejemplo:
   * span={{ base: "full", md: 1, xl: 2 }}
   */
  span?: AppGridResponsiveValue<AppGridSpanValue>;
}

const AppGridItem = React.forwardRef<HTMLDivElement, AppGridItemProps>(
  ({ className, style, span = "auto", align = "auto", ...props }, ref) => {
    const itemVars = buildGridItemVars(span);

    return (
      <div
        ref={ref}
        className={cn(
          appGridItemVariants({
            align,
          }),
          className,
        )}
        style={{
          ...itemVars,
          ...style,
        }}
        {...props}
      />
    );
  },
);

AppGridItem.displayName = "AppGridItem";

export { AppGrid, AppGridItem, appGridVariants, appGridItemVariants };

export type {
  AppGridColumnCount,
  AppGridColumnValue,
  AppGridResponsiveValue,
  AppGridSpanValue,
  AppGridTemplateMode,
};
