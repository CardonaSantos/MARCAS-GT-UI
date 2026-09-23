import * as React from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  appSplitPaneVariants,
  appSplitVariants,
} from "../theme/app-split.variants";

type AppLayoutBreakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";

type AppSplitRatio = "1-1" | "1-2" | "2-1" | "1-3" | "3-1" | "1-4" | "4-1";

type AppSplitCssVar =
  | "--app-split-template-base"
  | "--app-split-template-sm"
  | "--app-split-template-md"
  | "--app-split-template-lg"
  | "--app-split-template-xl"
  | "--app-split-template-2xl";

type AppSplitStyle = React.CSSProperties &
  Partial<Record<AppSplitCssVar, string>>;

const BREAKPOINTS: AppLayoutBreakpoint[] = [
  "base",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
];

const RATIO_TEMPLATES: Record<AppSplitRatio, string> = {
  "1-1": "minmax(0, 1fr) minmax(0, 1fr)",
  "1-2": "minmax(0, 1fr) minmax(0, 2fr)",
  "2-1": "minmax(0, 2fr) minmax(0, 1fr)",
  "1-3": "minmax(0, 1fr) minmax(0, 3fr)",
  "3-1": "minmax(0, 3fr) minmax(0, 1fr)",
  "1-4": "minmax(0, 1fr) minmax(0, 4fr)",
  "4-1": "minmax(0, 4fr) minmax(0, 1fr)",
};

function getBreakpointIndex(breakpoint: AppLayoutBreakpoint): number {
  return BREAKPOINTS.indexOf(breakpoint);
}

function buildSplitTemplateVars({
  ratio,
  breakpoint,
  template,
}: {
  ratio: AppSplitRatio;
  breakpoint: AppLayoutBreakpoint;
  template?: string;
}): AppSplitStyle {
  const style: AppSplitStyle = {};

  const splitTemplate = template ?? RATIO_TEMPLATES[ratio];
  const stackedTemplate = "minmax(0, 1fr)";
  const splitFromIndex = getBreakpointIndex(breakpoint);

  for (const currentBreakpoint of BREAKPOINTS) {
    const currentIndex = getBreakpointIndex(currentBreakpoint);

    const cssVar =
      `--app-split-template-${currentBreakpoint}` as AppSplitCssVar;

    style[cssVar] =
      currentIndex >= splitFromIndex ? splitTemplate : stackedTemplate;
  }

  return style;
}

export interface AppSplitProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appSplitVariants> {
  /**
   * Relación entre panel izquierdo y derecho.
   */
  ratio?: AppSplitRatio;

  /**
   * Desde qué breakpoint se divide en columnas.
   * Antes de ese breakpoint se apila verticalmente.
   */
  breakpoint?: AppLayoutBreakpoint;

  /**
   * Template manual si necesitas algo especial.
   * Ejemplo:
   * "18rem minmax(0, 1fr)"
   */
  template?: string;
}

const AppSplit = React.forwardRef<HTMLDivElement, AppSplitProps>(
  (
    {
      className,
      style,
      ratio = "1-1",
      breakpoint = "lg",
      template,
      gap = "sm",
      align = "stretch",
      ...props
    },
    ref,
  ) => {
    const templateVars = buildSplitTemplateVars({
      ratio,
      breakpoint,
      template,
    });

    return (
      <div
        ref={ref}
        className={cn(
          appSplitVariants({
            gap,
            align,
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

AppSplit.displayName = "AppSplit";

export interface AppSplitPaneProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appSplitPaneVariants> {}

const AppSplitPane = React.forwardRef<HTMLDivElement, AppSplitPaneProps>(
  ({ className, scrollable = false, sticky = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          appSplitPaneVariants({
            scrollable,
            sticky,
          }),
          className,
        )}
        {...props}
      />
    );
  },
);

AppSplitPane.displayName = "AppSplitPane";

export { AppSplit, AppSplitPane, appSplitVariants, appSplitPaneVariants };

export type { AppLayoutBreakpoint, AppSplitRatio };
