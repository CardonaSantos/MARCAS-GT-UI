import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  appSwitchLabelVariants,
  appSwitchRootVariants,
  appSwitchThumbVariants,
} from "../theme/app-switch.variants";

export interface AppSwitchProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
      "className"
    >,
    VariantProps<typeof appSwitchRootVariants> {
  className?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  containerClassName?: string;
  rootClassName?: string;
  thumbClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  labelPosition?: "left" | "right";
}

const AppSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  AppSwitchProps
>(
  (
    {
      className,
      containerClassName,
      rootClassName,
      thumbClassName,
      labelClassName,
      descriptionClassName,
      size,
      radius,
      variant,
      label,
      description,
      labelPosition = "right",
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const switchId = id ?? generatedId;

    const switchElement = (
      <SwitchPrimitive.Root
        id={switchId}
        ref={ref}
        disabled={disabled}
        className={cn(
          appSwitchRootVariants({ size, radius, variant }),
          rootClassName,
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(appSwitchThumbVariants({ size }), thumbClassName)}
        />
      </SwitchPrimitive.Root>
    );

    if (!label && !description) {
      return switchElement;
    }

    const textElement = (
      <div className="grid gap-0.5 leading-none">
        {label ? (
          <label
            htmlFor={switchId}
            className={cn(
              appSwitchLabelVariants({
                size,
                disabled: Boolean(disabled),
              }),
              labelClassName,
            )}
          >
            {label}
          </label>
        ) : null}

        {description ? (
          <p
            className={cn(
              "text-xs text-muted-foreground",
              disabled && "opacity-[var(--app-disabled-opacity)]",
              descriptionClassName,
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    );

    return (
      <div
        className={cn(
          "flex items-center gap-2",
          labelPosition === "left" && "justify-between",
          containerClassName,
        )}
      >
        {labelPosition === "left" ? textElement : null}
        {switchElement}
        {labelPosition === "right" ? textElement : null}
      </div>
    );
  },
);

AppSwitch.displayName = "AppSwitch";

export { AppSwitch, appSwitchRootVariants, appSwitchThumbVariants };
