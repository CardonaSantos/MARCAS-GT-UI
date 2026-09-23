import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  appBadgeDotVariants,
  appBadgeVariants,
} from "../theme/app-badge.variants";

export interface AppBadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof appBadgeVariants> {
  asChild?: boolean;
  dot?: boolean;
  dotPulse?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const AppBadge = React.forwardRef<HTMLSpanElement, AppBadgeProps>(
  (
    {
      className,
      tone,
      appearance,
      size,
      radius,
      shadow,
      clickable,
      asChild = false,
      dot = false,
      dotPulse = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        className={cn(
          appBadgeVariants({
            tone,
            appearance,
            size,
            radius,
            shadow,
            clickable,
          }),
          className,
        )}
        {...props}
      >
        {dot ? (
          <span
            aria-hidden="true"
            className={cn(
              appBadgeDotVariants({
                size,
                tone,
                pulse: dotPulse,
              }),
            )}
          />
        ) : null}

        {leftIcon ? (
          <span aria-hidden="true" className="[&_svg]:h-3 [&_svg]:w-3">
            {leftIcon}
          </span>
        ) : null}

        {children}

        {rightIcon ? (
          <span aria-hidden="true" className="[&_svg]:h-3 [&_svg]:w-3">
            {rightIcon}
          </span>
        ) : null}
      </Comp>
    );
  },
);

AppBadge.displayName = "AppBadge";

export { AppBadge, appBadgeVariants, appBadgeDotVariants };
