import * as React from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  appSkeletonCardVariants,
  appSkeletonTextVariants,
  appSkeletonVariants,
} from "../theme/app-skeleton.variants";

export interface AppSkeletonProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appSkeletonVariants> {}

const AppSkeleton = React.forwardRef<HTMLDivElement, AppSkeletonProps>(
  (
    {
      className,
      tone = "default",
      radius = "sm",
      size = "md",
      width = "full",
      shape = "block",
      animation = "pulse",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          appSkeletonVariants({
            tone,
            radius,
            size,
            width,
            shape,
            animation,
          }),
          className,
        )}
        {...props}
      />
    );
  },
);

AppSkeleton.displayName = "AppSkeleton";

export interface AppSkeletonTextProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appSkeletonTextVariants> {
  lines?: number;
  lineSize?: VariantProps<typeof appSkeletonVariants>["size"];
  tone?: VariantProps<typeof appSkeletonVariants>["tone"];
  animation?: VariantProps<typeof appSkeletonVariants>["animation"];
  lastLineWidth?: VariantProps<typeof appSkeletonVariants>["width"];
}

const AppSkeletonText = React.forwardRef<HTMLDivElement, AppSkeletonTextProps>(
  (
    {
      className,
      lines = 3,
      gap = "xs",
      lineSize = "sm",
      tone = "default",
      animation = "pulse",
      lastLineWidth = "2/3",
      ...props
    },
    ref,
  ) => {
    const safeLines = Math.max(1, lines);

    return (
      <div
        ref={ref}
        className={cn(appSkeletonTextVariants({ gap }), className)}
        {...props}
      >
        {Array.from({ length: safeLines }).map((_, index) => {
          const isLast = index === safeLines - 1;

          return (
            <AppSkeleton
              key={index}
              shape="text"
              radius="xs"
              size={lineSize}
              width={isLast && safeLines > 1 ? lastLineWidth : "full"}
              tone={tone}
              animation={animation}
            />
          );
        })}
      </div>
    );
  },
);

AppSkeletonText.displayName = "AppSkeletonText";

export interface AppSkeletonCardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appSkeletonCardVariants> {
  withHeader?: boolean;
  withAvatar?: boolean;
  lines?: number;
  animation?: VariantProps<typeof appSkeletonVariants>["animation"];
}

const AppSkeletonCard = React.forwardRef<HTMLDivElement, AppSkeletonCardProps>(
  (
    {
      className,
      size = "sm",
      radius = "md",
      shadow = "none",
      withHeader = true,
      withAvatar = false,
      lines = 3,
      animation = "pulse",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        aria-busy="true"
        className={cn(
          appSkeletonCardVariants({
            size,
            radius,
            shadow,
          }),
          className,
        )}
        {...props}
      >
        {withHeader ? (
          <div className="flex min-w-0 items-start gap-2">
            {withAvatar ? (
              <AppSkeleton
                shape="circle"
                size="2xl"
                width="auto"
                animation={animation}
                className="shrink-0"
              />
            ) : null}

            <div className="min-w-0 flex-1 space-y-1.5">
              <AppSkeleton
                size="sm"
                width="1/2"
                radius="xs"
                animation={animation}
              />
              <AppSkeleton
                size="xs"
                width="3/4"
                radius="xs"
                tone="muted"
                animation={animation}
              />
            </div>
          </div>
        ) : null}

        <AppSkeletonText
          lines={lines}
          lineSize="sm"
          gap="sm"
          tone="default"
          animation={animation}
        />
      </div>
    );
  },
);

AppSkeletonCard.displayName = "AppSkeletonCard";

export {
  AppSkeleton,
  AppSkeletonText,
  AppSkeletonCard,
  appSkeletonVariants,
  appSkeletonTextVariants,
  appSkeletonCardVariants,
};
