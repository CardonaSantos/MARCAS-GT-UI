import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  appAlertCloseVariants,
  appAlertDescriptionVariants,
  appAlertIconVariants,
  appAlertTitleVariants,
  appAlertVariants,
} from "../theme/app-alert.variants";

type AppAlertTone = NonNullable<VariantProps<typeof appAlertVariants>["tone"]>;

const DEFAULT_ICONS: Record<AppAlertTone, React.ReactNode> = {
  neutral: <Info />,
  info: <Info />,
  success: <CheckCircle2 />,
  warning: <AlertTriangle />,
  danger: <AlertCircle />,
};

export interface AppAlertProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof appAlertVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  /**
   * Si children existe, se usa como contenido principal.
   * Si no, se usa description.
   */
  children?: React.ReactNode;

  showIcon?: boolean;
  closable?: boolean;
  closeLabel?: string;
  onClose?: () => void;

  iconClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionClassName?: string;
  closeClassName?: string;
}

const AppAlert = React.forwardRef<HTMLDivElement, AppAlertProps>(
  (
    {
      className,
      title,
      description,
      children,
      icon,
      action,
      showIcon = true,
      closable = false,
      closeLabel = "Cerrar alerta",
      onClose,
      tone = "neutral",
      size = "sm",
      radius = "md",
      variant = "soft",
      animation = "fade",
      iconClassName,
      contentClassName,
      titleClassName,
      descriptionClassName,
      actionClassName,
      closeClassName,
      role,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);

    if (!isVisible) {
      return null;
    }

    const resolvedTone = tone ?? "neutral";
    const resolvedIcon = icon ?? DEFAULT_ICONS[resolvedTone];
    const content = children ?? description;
    const alertRole =
      role ??
      (resolvedTone === "danger" || resolvedTone === "warning"
        ? "alert"
        : "status");

    const handleClose = () => {
      setIsVisible(false);
      onClose?.();
    };

    return (
      <div
        ref={ref}
        role={alertRole}
        className={cn(
          appAlertVariants({
            tone: resolvedTone,
            size,
            radius,
            variant,
            animation,
          }),
          className,
        )}
        {...props}
      >
        {showIcon ? (
          <div
            className={cn(
              appAlertIconVariants({
                tone: resolvedTone,
                size,
              }),
              iconClassName,
            )}
          >
            {resolvedIcon}
          </div>
        ) : null}

        <div className={cn("min-w-0 flex-1 space-y-1", contentClassName)}>
          {title ? (
            <div
              className={cn(appAlertTitleVariants({ size }), titleClassName)}
            >
              {title}
            </div>
          ) : null}

          {content ? (
            <div
              className={cn(
                appAlertDescriptionVariants({ size }),
                descriptionClassName,
              )}
            >
              {content}
            </div>
          ) : null}

          {action ? (
            <div className={cn("pt-1", actionClassName)}>{action}</div>
          ) : null}
        </div>

        {closable ? (
          <button
            type="button"
            aria-label={closeLabel}
            onClick={handleClose}
            className={cn(appAlertCloseVariants({ size }), closeClassName)}
          >
            <X />
          </button>
        ) : null}
      </div>
    );
  },
);

AppAlert.displayName = "AppAlert";

export {
  AppAlert,
  appAlertVariants,
  appAlertIconVariants,
  appAlertTitleVariants,
  appAlertDescriptionVariants,
  appAlertCloseVariants,
};
