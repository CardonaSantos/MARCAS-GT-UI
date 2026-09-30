import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { appButtonVariants } from "../theme/app-button.variants";
import { AppLoader } from "./app-loader";

export interface AppButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    VariantProps<typeof appButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      className,
      variant,
      size,
      radius,
      width,
      asChild = false,
      loading = false,
      loadingText,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      type = "button",
      onClick,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const buttonClassName = cn(
      appButtonVariants({
        variant,
        size,
        radius,
        width,
      }),
      className,
    );

    /*
     * Slot debe recibir directamente el elemento que sustituirá
     * al botón: <a>, <Link>, etc.
     */
    if (asChild) {
      return (
        <Slot
          ref={ref}
          aria-disabled={isDisabled || undefined}
          data-loading={loading ? "true" : undefined}
          className={buttonClassName}
          onClick={(event) => {
            if (isDisabled) {
              event.preventDefault();
              event.stopPropagation();
              return;
            }

            onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
          }}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        data-loading={loading ? "true" : undefined}
        className={buttonClassName}
        onClick={onClick}
        {...props}
      >
        {loading ? <AppLoader size="sm" tone="current" /> : leftIcon}

        {loading && loadingText ? loadingText : children}

        {!loading && rightIcon}
      </button>
    );
  },
);

AppButton.displayName = "AppButton";

export { AppButton, appButtonVariants };
