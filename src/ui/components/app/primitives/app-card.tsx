import * as React from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  appCardContentVariants,
  appCardDescriptionVariants,
  appCardFooterVariants,
  appCardHeaderVariants,
  appCardIconVariants,
  appCardTitleVariants,
  appCardVariants,
} from "../theme/app-card.variants";

// type AppCardElement = "div" | "section" | "article" | "aside";

export interface AppCardProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof appCardVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;

  headerDivider?: boolean;
  footerDivider?: boolean;
  footerAlign?: VariantProps<typeof appCardFooterVariants>["align"];

  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  iconClassName?: string;

  contentFlush?: boolean;
  truncateTitle?: boolean;
  truncateDescription?: boolean;
}

const AppCard = React.forwardRef<HTMLDivElement, AppCardProps>(
  (
    {
      className,
      children,
      variant,
      size,
      radius,
      shadow,
      bordered,
      interactive,
      selected,
      title,
      description,
      icon,
      action,
      footer,
      headerDivider,
      footerDivider,
      footerAlign,
      headerClassName,
      contentClassName,
      footerClassName,
      titleClassName,
      descriptionClassName,
      iconClassName,
      contentFlush,
      truncateTitle,
      truncateDescription,
      tabIndex,
      ...props
    },
    ref,
  ) => {
    const hasHeader = Boolean(title || description || icon || action);
    const hasFooter = Boolean(footer);
    const hasQuickLayout = hasHeader || hasFooter;

    const resolvedTabIndex =
      interactive && tabIndex === undefined ? 0 : tabIndex;

    return (
      <div
        ref={ref}
        tabIndex={resolvedTabIndex}
        className={cn(
          appCardVariants({
            variant,
            size,
            radius,
            shadow,
            bordered,
            interactive,
            selected,
          }),
          className,
        )}
        {...props}
      >
        {hasQuickLayout ? (
          <>
            {hasHeader ? (
              <AppCardHeader
                size={size}
                divider={headerDivider}
                className={headerClassName}
              >
                <div className="flex min-w-0 items-start gap-2">
                  {icon ? (
                    <AppCardIcon size={size} className={iconClassName}>
                      {icon}
                    </AppCardIcon>
                  ) : null}

                  <div className="min-w-0 space-y-0.5">
                    {title ? (
                      <AppCardTitle
                        size={size}
                        truncate={truncateTitle}
                        className={titleClassName}
                      >
                        {title}
                      </AppCardTitle>
                    ) : null}

                    {description ? (
                      <AppCardDescription
                        size={size}
                        truncate={truncateDescription}
                        className={descriptionClassName}
                      >
                        {description}
                      </AppCardDescription>
                    ) : null}
                  </div>
                </div>

                {action ? (
                  <div className="flex shrink-0 items-center gap-2">
                    {action}
                  </div>
                ) : null}
              </AppCardHeader>
            ) : null}

            {children ? (
              <AppCardContent
                size={size}
                flush={contentFlush}
                className={contentClassName}
              >
                {children}
              </AppCardContent>
            ) : null}

            {footer ? (
              <AppCardFooter
                size={size}
                divider={footerDivider}
                align={footerAlign}
                className={footerClassName}
              >
                {footer}
              </AppCardFooter>
            ) : null}
          </>
        ) : (
          children
        )}
      </div>
    );
  },
);

AppCard.displayName = "AppCard";

AppCard.displayName = "AppCard";

export interface AppCardHeaderProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appCardHeaderVariants> {}

const AppCardHeader = React.forwardRef<HTMLDivElement, AppCardHeaderProps>(
  ({ className, size, divider, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(appCardHeaderVariants({ size, divider }), className)}
        {...props}
      />
    );
  },
);

AppCardHeader.displayName = "AppCardHeader";

export interface AppCardContentProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appCardContentVariants> {}

const AppCardContent = React.forwardRef<HTMLDivElement, AppCardContentProps>(
  ({ className, size, flush, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(appCardContentVariants({ size, flush }), className)}
        {...props}
      />
    );
  },
);

AppCardContent.displayName = "AppCardContent";

export interface AppCardFooterProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appCardFooterVariants> {}

const AppCardFooter = React.forwardRef<HTMLDivElement, AppCardFooterProps>(
  ({ className, size, align, divider, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          appCardFooterVariants({ size, align, divider }),
          className,
        )}
        {...props}
      />
    );
  },
);

AppCardFooter.displayName = "AppCardFooter";

export interface AppCardTitleProps
  extends
    React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof appCardTitleVariants> {
  as?: "h2" | "h3" | "h4" | "p" | "span";
}

const AppCardTitle = React.forwardRef<HTMLHeadingElement, AppCardTitleProps>(
  ({ as: Comp = "h3", className, size, truncate, ...props }, ref) => {
    return (
      <Comp
        ref={ref}
        className={cn(appCardTitleVariants({ size, truncate }), className)}
        {...props}
      />
    );
  },
);

AppCardTitle.displayName = "AppCardTitle";

export interface AppCardDescriptionProps
  extends
    React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof appCardDescriptionVariants> {
  as?: "p" | "span" | "div";
}

const AppCardDescription = React.forwardRef<
  HTMLParagraphElement,
  AppCardDescriptionProps
>(({ as: Comp = "p", className, size, truncate, ...props }, ref) => {
  return (
    <Comp
      ref={ref}
      className={cn(appCardDescriptionVariants({ size, truncate }), className)}
      {...props}
    />
  );
});

AppCardDescription.displayName = "AppCardDescription";

export interface AppCardIconProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appCardIconVariants> {}

const AppCardIcon = React.forwardRef<HTMLDivElement, AppCardIconProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(appCardIconVariants({ size }), className)}
        {...props}
      />
    );
  },
);

AppCardIcon.displayName = "AppCardIcon";

export {
  AppCard,
  AppCardHeader,
  AppCardContent,
  AppCardFooter,
  AppCardTitle,
  AppCardDescription,
  AppCardIcon,
  appCardVariants,
  appCardHeaderVariants,
  appCardContentVariants,
  appCardFooterVariants,
  appCardTitleVariants,
  appCardDescriptionVariants,
  appCardIconVariants,
};
