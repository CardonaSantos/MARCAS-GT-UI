import * as React from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  appStatusDotLabelVariants,
  appStatusDotVariants,
} from "../theme/app-status-dot.variants";

export interface AppStatusDotProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof appStatusDotVariants> {
  label?: React.ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  labelMuted?: boolean;
  dotClassName?: string;
}

const AppStatusDot = React.forwardRef<HTMLSpanElement, AppStatusDotProps>(
  (
    {
      className,
      containerClassName,
      dotClassName,
      labelClassName,
      tone,
      size,
      ringed,
      pulse,
      label,
      labelMuted = false,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const dot = (
      <span
        ref={ref}
        aria-hidden={label ? "true" : undefined}
        aria-label={!label ? ariaLabel : undefined}
        className={cn(
          appStatusDotVariants({
            tone,
            size,
            ringed,
            pulse,
          }),
          dotClassName,
          className,
        )}
        {...props}
      />
    );

    if (!label) {
      return dot;
    }

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 align-middle",
          containerClassName,
        )}
      >
        {dot}

        <span
          className={cn(
            appStatusDotLabelVariants({
              size,
              muted: labelMuted,
            }),
            labelClassName,
          )}
        >
          {label}
        </span>
      </span>
    );
  },
);

AppStatusDot.displayName = "AppStatusDot";

export { AppStatusDot, appStatusDotVariants, appStatusDotLabelVariants };
