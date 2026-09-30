import * as React from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { appContainerVariants } from "../theme/app-container.variants";

export interface AppContainerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appContainerVariants> {}

const AppContainer = React.forwardRef<HTMLDivElement, AppContainerProps>(
  (
    {
      className,
      size = "xl",
      paddingX = "sm",
      paddingY = "none",
      centered = true,
      fullHeight = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          appContainerVariants({
            size,
            paddingX,
            paddingY,
            centered,
            fullHeight,
          }),
          className,
        )}
        {...props}
      />
    );
  },
);

AppContainer.displayName = "AppContainer";

export { AppContainer, appContainerVariants };
