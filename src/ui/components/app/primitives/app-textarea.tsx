import * as React from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { appTextareaVariants } from "../theme/app-textarea.variants";

export interface AppTextareaProps
  extends
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof appTextareaVariants> {
  containerClassName?: string;
  invalid?: boolean;
  rightElement?: React.ReactNode;
}

const AppTextarea = React.forwardRef<HTMLTextAreaElement, AppTextareaProps>(
  (
    {
      className,
      containerClassName,
      variant,
      size,
      radius,
      intent,
      fieldWidth,
      resizeMode,
      invalid = false,
      rightElement,
      disabled,
      readOnly,
      rows,
      ...props
    },
    ref,
  ) => {
    const hasRightElement = Boolean(rightElement);
    const resolvedIntent = invalid ? "error" : intent;

    return (
      <div
        className={cn(
          "relative",
          fieldWidth === "auto" ? "w-auto" : "w-full",
          containerClassName,
        )}
      >
        <textarea
          ref={ref}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          aria-invalid={invalid || undefined}
          className={cn(
            appTextareaVariants({
              variant,
              size,
              radius,
              intent: resolvedIntent,
              fieldWidth,
              resizeMode,
              withRightElement: hasRightElement,
            }),
            className,
          )}
          {...props}
        />

        {rightElement ? (
          <div
            className={cn(
              "absolute right-[var(--app-input-icon-offset)] top-2",
              "flex items-center",
              "text-[hsl(var(--app-input-placeholder))]",
              "[&_svg]:h-[var(--app-input-icon-size)] [&_svg]:w-[var(--app-input-icon-size)]",
            )}
          >
            {rightElement}
          </div>
        ) : null}
      </div>
    );
  },
);

AppTextarea.displayName = "AppTextarea";

export { AppTextarea, appTextareaVariants };
