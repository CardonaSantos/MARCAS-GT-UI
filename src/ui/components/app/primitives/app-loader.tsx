import * as React from "react";
import { Loader2 } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  appLoaderContainerVariants,
  appLoaderLabelVariants,
  appLoaderVariants,
} from "../theme/app-loader.variants";

export interface AppLoaderProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof appLoaderContainerVariants> {
  size?: VariantProps<typeof appLoaderVariants>["size"];
  tone?: VariantProps<typeof appLoaderVariants>["tone"];
  speed?: VariantProps<typeof appLoaderVariants>["speed"];
  label?: React.ReactNode;
  iconClassName?: string;
  labelClassName?: string;
  icon?: React.ReactNode;
}

const AppLoader = React.forwardRef<HTMLDivElement, AppLoaderProps>(
  (
    {
      className,
      iconClassName,
      labelClassName,
      size,
      tone,
      speed,
      label,
      icon,
      gap,
      block,
      centered,
      role = "status",
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const loaderIcon = icon ?? <Loader2 aria-hidden="true" />;

    return (
      <div
        ref={ref}
        role={role}
        aria-label={
          ariaLabel ?? (typeof label === "string" ? label : "Cargando")
        }
        className={cn(
          appLoaderContainerVariants({
            gap,
            block,
            centered,
          }),
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            appLoaderVariants({
              size,
              tone,
              speed,
            }),
            "[&_svg]:h-full [&_svg]:w-full",
            iconClassName,
          )}
        >
          {loaderIcon}
        </span>

        {label ? (
          <span
            className={cn(
              appLoaderLabelVariants({
                size,
              }),
              labelClassName,
            )}
          >
            {label}
          </span>
        ) : null}
      </div>
    );
  },
);

AppLoader.displayName = "AppLoader";

export {
  AppLoader,
  appLoaderVariants,
  appLoaderLabelVariants,
  appLoaderContainerVariants,
};
