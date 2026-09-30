import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { appSeparatorVariants } from "../theme/app-separator.variants";

export interface AppSeparatorProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appSeparatorVariants> {
  decorative?: boolean;
}

const AppSeparator = React.forwardRef<HTMLDivElement, AppSeparatorProps>(
  (
    {
      className,
      orientation = "horizontal",
      size = "xs",
      tone = "default",
      spacing = "sm",
      decorative = true,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role={decorative ? undefined : "separator"}
        aria-hidden={decorative ? true : undefined}
        aria-orientation={
          decorative ? undefined : (orientation ?? "horizontal")
        }
        className={cn(
          appSeparatorVariants({
            orientation,
            size,
            tone,
            spacing,
            decorative,
          }),
          className,
        )}
        {...props}
      />
    );
  },
);

AppSeparator.displayName = "AppSeparator";

export { AppSeparator, appSeparatorVariants };
