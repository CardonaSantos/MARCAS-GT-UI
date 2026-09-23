import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import {
  AlertCircle,
  CheckCircle2,
  Inbox,
  SearchX,
  WifiOff,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  appEmptyStateActionsVariants,
  appEmptyStateDescriptionVariants,
  appEmptyStateIconVariants,
  appEmptyStateInnerVariants,
  appEmptyStateTitleVariants,
  appEmptyStateVariants,
} from "../theme/app-empty-state.variants";

type AppEmptyStateTone = NonNullable<
  VariantProps<typeof appEmptyStateIconVariants>["tone"]
>;

type AppEmptyStatePreset = "empty" | "search" | "error" | "offline" | "success";

const PRESET_ICONS: Record<AppEmptyStatePreset, React.ReactNode> = {
  empty: <Inbox />,
  search: <SearchX />,
  error: <AlertCircle />,
  offline: <WifiOff />,
  success: <CheckCircle2 />,
};

const PRESET_TONES: Record<AppEmptyStatePreset, AppEmptyStateTone> = {
  empty: "neutral",
  search: "neutral",
  error: "danger",
  offline: "warning",
  success: "success",
};

export interface AppEmptyStateProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof appEmptyStateVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  children?: React.ReactNode;

  preset?: AppEmptyStatePreset;
  tone?: AppEmptyStateTone;
  showIcon?: boolean;
  maxWidth?: VariantProps<typeof appEmptyStateInnerVariants>["maxWidth"];

  iconClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionsClassName?: string;
}

const AppEmptyState = React.forwardRef<HTMLDivElement, AppEmptyStateProps>(
  (
    {
      className,
      title,
      description,
      icon,
      action,
      secondaryAction,
      children,
      preset = "empty",
      tone,
      showIcon = true,
      maxWidth = "sm",
      variant = "plain",
      size = "sm",
      radius = "md",
      align = "center",
      fullHeight = false,
      animation = "fade",
      iconClassName,
      contentClassName,
      titleClassName,
      descriptionClassName,
      actionsClassName,
      role,
      ...props
    },
    ref,
  ) => {
    const resolvedTone = tone ?? PRESET_TONES[preset];
    const resolvedIcon = icon ?? PRESET_ICONS[preset];
    const hasActions = Boolean(action || secondaryAction);
    const hasContent = Boolean(title || description || children);

    return (
      <div
        ref={ref}
        role={role}
        className={cn(
          appEmptyStateVariants({
            variant,
            size,
            radius,
            align,
            fullHeight,
            animation,
          }),
          fullHeight && "flex items-center justify-center",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "flex flex-col",
            appEmptyStateInnerVariants({
              maxWidth,
              align,
              size,
            }),
            contentClassName,
          )}
        >
          {showIcon ? (
            <div
              className={cn(
                appEmptyStateIconVariants({
                  tone: resolvedTone,
                  size,
                }),
                iconClassName,
              )}
            >
              {resolvedIcon}
            </div>
          ) : null}

          {hasContent ? (
            <div className="min-w-0 space-y-1">
              {title ? (
                <div
                  className={cn(
                    appEmptyStateTitleVariants({ size }),
                    titleClassName,
                  )}
                >
                  {title}
                </div>
              ) : null}

              {description ? (
                <div
                  className={cn(
                    appEmptyStateDescriptionVariants({ size }),
                    descriptionClassName,
                  )}
                >
                  {description}
                </div>
              ) : null}

              {children ? (
                <div
                  className={cn(
                    appEmptyStateDescriptionVariants({ size }),
                    "pt-1",
                  )}
                >
                  {children}
                </div>
              ) : null}
            </div>
          ) : null}

          {hasActions ? (
            <div
              className={cn(
                appEmptyStateActionsVariants({ align }),
                actionsClassName,
              )}
            >
              {action}
              {secondaryAction}
            </div>
          ) : null}
        </div>
      </div>
    );
  },
);

AppEmptyState.displayName = "AppEmptyState";

export {
  AppEmptyState,
  appEmptyStateVariants,
  appEmptyStateInnerVariants,
  appEmptyStateIconVariants,
  appEmptyStateTitleVariants,
  appEmptyStateDescriptionVariants,
  appEmptyStateActionsVariants,
};

export type { AppEmptyStatePreset, AppEmptyStateTone };
