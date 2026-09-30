import * as React from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  appFieldContentVariants,
  appFieldDescriptionVariants,
  appFieldHeaderVariants,
  appFieldLabelVariants,
  appFieldMessageVariants,
  appFieldRequiredVariants,
  appFieldVariants,
} from "../theme/app-field.variants";

export interface AppFieldControlA11yProps extends React.AriaAttributes {
  id: string;
}

export interface AppFieldNativeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

export interface AppFieldRenderContext {
  id: string;
  labelId: string;
  descriptionId?: string;
  messageId?: string;
  describedBy?: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;

  /**
   * Para AppInput, AppTextarea o inputs nativos.
   */
  inputProps: AppFieldNativeInputProps;

  /**
   * Para componentes no nativos como react-select.
   * Ejemplo: inputId={field.id} {...field.a11yProps}
   */
  a11yProps: AppFieldControlA11yProps;
}

type AppFieldChildren =
  | React.ReactNode
  | ((field: AppFieldRenderContext) => React.ReactNode);

export interface AppFieldProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof appFieldVariants> {
  children?: AppFieldChildren;

  label?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;

  /**
   * ID del input/control asociado.
   * Equivale al htmlFor del label.
   */
  htmlFor?: string;

  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;

  labelId?: string;
  descriptionId?: string;
  messageId?: string;

  requiredIndicator?: React.ReactNode;

  headerClassName?: string;
  contentClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  messageClassName?: string;
}

const AppField = React.forwardRef<HTMLDivElement, AppFieldProps>(
  (
    {
      className,
      children,
      size = "xs",
      orientation = "vertical",
      disabled = false,
      invalid = false,
      required = false,
      label,
      description,
      hint,
      error,
      htmlFor,
      labelId,
      descriptionId,
      messageId,
      requiredIndicator = "*",
      headerClassName,
      contentClassName,
      labelClassName,
      descriptionClassName,
      messageClassName,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();

    const controlId = htmlFor ?? `app-field-${reactId}-control`;
    const resolvedLabelId = labelId ?? `app-field-${reactId}-label`;
    const resolvedDescriptionId =
      descriptionId ?? `app-field-${reactId}-description`;
    const resolvedMessageId = messageId ?? `app-field-${reactId}-message`;

    const hasDescription = Boolean(description);
    const hasError = Boolean(error);
    const hasHint = Boolean(hint);
    const hasMessage = hasError || hasHint;
    const isInvalid = Boolean(invalid || hasError);

    const describedBy = [
      hasDescription ? resolvedDescriptionId : null,
      hasMessage ? resolvedMessageId : null,
    ]
      .filter(Boolean)
      .join(" ");

    const finalDescribedBy = describedBy || undefined;

    const fieldContext: AppFieldRenderContext = {
      id: controlId,
      labelId: resolvedLabelId,
      descriptionId: hasDescription ? resolvedDescriptionId : undefined,
      messageId: hasMessage ? resolvedMessageId : undefined,
      describedBy: finalDescribedBy,
      invalid: isInvalid,
      disabled: Boolean(disabled),
      required: Boolean(required),

      inputProps: {
        id: controlId,
        disabled: disabled || undefined,
        required: required || undefined,
        "aria-invalid": isInvalid || undefined,
        "aria-describedby": finalDescribedBy,
      },

      a11yProps: {
        id: controlId,
        "aria-invalid": isInvalid || undefined,
        "aria-describedby": finalDescribedBy,
        "aria-required": required || undefined,
      },
    };

    const renderedChildren =
      typeof children === "function" ? children(fieldContext) : children;

    return (
      <div
        ref={ref}
        className={cn(
          appFieldVariants({
            size,
            orientation,
            disabled,
          }),
          className,
        )}
        {...props}
      >
        {label || description ? (
          <AppFieldHeader
            size={size}
            orientation={orientation}
            className={headerClassName}
          >
            {label ? (
              <AppFieldLabel
                id={resolvedLabelId}
                htmlFor={controlId}
                size={size}
                disabled={disabled}
                className={labelClassName}
              >
                {label}

                {required ? (
                  <AppFieldRequired>{requiredIndicator}</AppFieldRequired>
                ) : null}
              </AppFieldLabel>
            ) : null}

            {description ? (
              <AppFieldDescription
                id={resolvedDescriptionId}
                size={size}
                className={descriptionClassName}
              >
                {description}
              </AppFieldDescription>
            ) : null}
          </AppFieldHeader>
        ) : null}

        <AppFieldContent size={size} className={contentClassName}>
          {renderedChildren}

          {hasMessage ? (
            <AppFieldMessage
              id={resolvedMessageId}
              size={size}
              tone={hasError ? "error" : "hint"}
              role={hasError ? "alert" : undefined}
              aria-live={hasError ? "polite" : undefined}
              className={messageClassName}
            >
              {hasError ? error : hint}
            </AppFieldMessage>
          ) : null}
        </AppFieldContent>
      </div>
    );
  },
);

AppField.displayName = "AppField";

export interface AppFieldHeaderProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appFieldHeaderVariants> {}

const AppFieldHeader = React.forwardRef<HTMLDivElement, AppFieldHeaderProps>(
  ({ className, size, orientation, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(appFieldHeaderVariants({ size, orientation }), className)}
        {...props}
      />
    );
  },
);

AppFieldHeader.displayName = "AppFieldHeader";

export interface AppFieldContentProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appFieldContentVariants> {}

const AppFieldContent = React.forwardRef<HTMLDivElement, AppFieldContentProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(appFieldContentVariants({ size }), className)}
        {...props}
      />
    );
  },
);

AppFieldContent.displayName = "AppFieldContent";

export interface AppFieldLabelProps
  extends
    React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof appFieldLabelVariants> {}

const AppFieldLabel = React.forwardRef<HTMLLabelElement, AppFieldLabelProps>(
  ({ className, size, disabled, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(appFieldLabelVariants({ size, disabled }), className)}
        {...props}
      />
    );
  },
);

AppFieldLabel.displayName = "AppFieldLabel";

export interface AppFieldDescriptionProps
  extends
    React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof appFieldDescriptionVariants> {}

const AppFieldDescription = React.forwardRef<
  HTMLParagraphElement,
  AppFieldDescriptionProps
>(({ className, size, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(appFieldDescriptionVariants({ size }), className)}
      {...props}
    />
  );
});

AppFieldDescription.displayName = "AppFieldDescription";

export interface AppFieldMessageProps
  extends
    React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof appFieldMessageVariants> {}

const AppFieldMessage = React.forwardRef<
  HTMLParagraphElement,
  AppFieldMessageProps
>(({ className, size, tone, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(appFieldMessageVariants({ size, tone }), className)}
      {...props}
    />
  );
});

AppFieldMessage.displayName = "AppFieldMessage";

export interface AppFieldRequiredProps extends React.HTMLAttributes<HTMLSpanElement> {}

const AppFieldRequired = React.forwardRef<
  HTMLSpanElement,
  AppFieldRequiredProps
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(appFieldRequiredVariants(), className)}
      {...props}
    />
  );
});

AppFieldRequired.displayName = "AppFieldRequired";

export {
  AppField,
  AppFieldHeader,
  AppFieldContent,
  AppFieldLabel,
  AppFieldDescription,
  AppFieldMessage,
  AppFieldRequired,
  appFieldVariants,
  appFieldHeaderVariants,
  appFieldContentVariants,
  appFieldLabelVariants,
  appFieldDescriptionVariants,
  appFieldMessageVariants,
  appFieldRequiredVariants,
};
