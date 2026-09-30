import * as React from "react";
import { X } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { appInputVariants } from "../theme/app-input.variants";

export interface AppInputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof appInputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  containerClassName?: string;
  invalid?: boolean;
  clearButtonAriaLabel?: string;
}

const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  (
    {
      className,
      containerClassName,
      variant,
      size,
      radius,
      intent,
      fieldWidth,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      invalid = false,
      clearButtonAriaLabel = "Limpiar campo",
      disabled,
      readOnly,
      value,
      type = "text",
      ...props
    },
    ref,
  ) => {
    const hasLeftIcon = Boolean(leftIcon);
    const hasValue =
      value !== undefined && value !== null && String(value).length > 0;

    const showClearButton = clearable && hasValue && !disabled && !readOnly;
    const hasRightElement = Boolean(rightIcon) || showClearButton;
    const resolvedIntent = invalid ? "error" : intent;

    return (
      <div
        className={cn(
          "relative",
          fieldWidth === "auto" ? "w-auto" : "w-full",
          containerClassName,
        )}
      >
        {leftIcon ? (
          <span
            className={cn(
              "pointer-events-none absolute left-[var(--app-input-icon-offset)] top-1/2",
              "-translate-y-1/2 text-[hsl(var(--app-input-placeholder))]",
              "[&_svg]:h-[var(--app-input-icon-size)] [&_svg]:w-[var(--app-input-icon-size)]",
            )}
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        ) : null}

        <input
          ref={ref}
          type={type}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={invalid || undefined}
          className={cn(
            appInputVariants({
              variant,
              size,
              radius,
              intent: resolvedIntent,
              fieldWidth,
              withLeftIcon: hasLeftIcon,
              withRightElement: hasRightElement,
            }),
            className,
          )}
          {...props}
        />

        {hasRightElement ? (
          <span
            className={cn(
              "absolute right-[var(--app-input-icon-offset)] top-1/2",
              "flex -translate-y-1/2 items-center gap-1",
              "text-[hsl(var(--app-input-placeholder))]",
              "[&_svg]:h-[var(--app-input-icon-size)] [&_svg]:w-[var(--app-input-icon-size)]",
            )}
          >
            {rightIcon && !showClearButton ? (
              <span className="pointer-events-none" aria-hidden="true">
                {rightIcon}
              </span>
            ) : null}

            {showClearButton ? (
              <button
                type="button"
                tabIndex={-1}
                aria-label={clearButtonAriaLabel}
                className={cn(
                  "inline-flex items-center justify-center",
                  "rounded-[var(--app-radius-xs)]",
                  "text-[hsl(var(--app-input-placeholder))]",
                  "hover:text-[hsl(var(--app-input-foreground))]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-[hsl(var(--app-ring))]",
                )}
                onMouseDown={(event) => event.preventDefault()}
                onClick={(event) => {
                  event.stopPropagation();
                  onClear?.();
                }}
              >
                <X aria-hidden="true" />
              </button>
            ) : null}
          </span>
        ) : null}
      </div>
    );
  },
);

AppInput.displayName = "AppInput";

export { AppInput, appInputVariants };
