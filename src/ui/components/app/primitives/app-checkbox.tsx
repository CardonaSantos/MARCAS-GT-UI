import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  appCheckboxIconVariants,
  appCheckboxLabelVariants,
  appCheckboxRootVariants,
} from "../theme/app-checkbox.variants";

export interface AppCheckboxProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
      "className"
    >,
    VariantProps<typeof appCheckboxRootVariants> {
  className?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  containerClassName?: string;
  rootClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  labelPosition?: "left" | "right";
  invalid?: boolean;
}

const AppCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  AppCheckboxProps
>(
  (
    {
      className,
      containerClassName,
      rootClassName,
      iconClassName,
      labelClassName,
      descriptionClassName,
      size,
      radius,
      variant,
      intent,
      label,
      description,
      labelPosition = "right",
      disabled,
      id,
      checked,
      defaultChecked,
      invalid = false,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const checkboxId = id ?? generatedId;

    const isIndeterminate =
      checked === "indeterminate" || defaultChecked === "indeterminate";

    const resolvedIntent = invalid ? "error" : intent;

    const checkboxElement = (
      <CheckboxPrimitive.Root
        id={checkboxId}
        ref={ref}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cn(
          appCheckboxRootVariants({
            size,
            radius,
            variant,
            intent: resolvedIntent,
          }),
          rootClassName,
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn(
            "flex items-center justify-center text-current",
            iconClassName,
          )}
        >
          {isIndeterminate ? (
            <Minus
              aria-hidden="true"
              className={cn(appCheckboxIconVariants({ size }))}
            />
          ) : (
            <Check
              aria-hidden="true"
              className={cn(appCheckboxIconVariants({ size }))}
            />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );

    if (!label && !description) {
      return checkboxElement;
    }

    const textElement = (
      <div className="grid gap-0.5 leading-none">
        {label ? (
          <label
            htmlFor={checkboxId}
            className={cn(
              appCheckboxLabelVariants({
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
          "flex items-start gap-2",
          labelPosition === "left" && "justify-between",
          containerClassName,
        )}
      >
        {labelPosition === "left" ? textElement : null}
        <div className="pt-0.5">{checkboxElement}</div>
        {labelPosition === "right" ? textElement : null}
      </div>
    );
  },
);

AppCheckbox.displayName = "AppCheckbox";

export { AppCheckbox, appCheckboxRootVariants };
