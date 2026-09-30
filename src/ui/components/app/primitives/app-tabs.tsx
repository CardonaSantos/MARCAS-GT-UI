"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  appTabsContentVariants,
  appTabsListVariants,
  appTabsRootVariants,
  appTabsTriggerVariants,
} from "../theme/app-tabs.variants";

export interface AppTabItem<TValue extends string = string> {
  value: TValue;
  label: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface AppTabsProps<TValue extends string = string> extends Omit<
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
  "value" | "defaultValue" | "onValueChange" | "children"
> {
  tabs: Array<AppTabItem<TValue>>;
  value?: TValue;
  defaultValue?: TValue;
  onValueChange?: (value: TValue) => void;

  variant?: VariantProps<typeof appTabsListVariants>["variant"];
  size?: VariantProps<typeof appTabsTriggerVariants>["size"];
  align?: VariantProps<typeof appTabsListVariants>["align"];
  contentSpacing?: VariantProps<typeof appTabsContentVariants>["spacing"];

  fullWidth?: boolean;
  fullWidthTriggers?: boolean;
  hideIconsOnMobile?: boolean;
  renderContent?: boolean;

  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  triggerIconClassName?: string;
  contentClassName?: string;
}

function AppTabsInner<TValue extends string = string>(
  {
    tabs,
    value,
    defaultValue,
    onValueChange,
    variant = "default",
    size = "sm",
    align = "start",
    contentSpacing = "sm",
    fullWidth = true,
    fullWidthTriggers = false,
    hideIconsOnMobile = true,
    renderContent = true,
    className,
    listClassName,
    triggerClassName,
    triggerIconClassName,
    contentClassName,
    ...props
  }: AppTabsProps<TValue>,
  ref: React.ForwardedRef<React.ElementRef<typeof TabsPrimitive.Root>>,
) {
  return (
    <TabsPrimitive.Root
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(nextValue) => onValueChange?.(nextValue as TValue)}
      className={cn(appTabsRootVariants({ fullWidth }), className)}
      {...props}
    >
      <TabsPrimitive.List
        className={cn(
          appTabsListVariants({
            variant,
            align,
          }),
          listClassName,
        )}
      >
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className={cn(
              appTabsTriggerVariants({
                variant,
                size,
                fullWidthTrigger: fullWidthTriggers,
              }),
              triggerClassName,
            )}
          >
            {tab.icon ? (
              <span
                className={cn(
                  "shrink-0 [&_svg]:h-3.5 [&_svg]:w-3.5",
                  hideIconsOnMobile && "hidden sm:inline-flex",
                  triggerIconClassName,
                )}
              >
                {tab.icon}
              </span>
            ) : null}

            <span className="min-w-0 truncate">{tab.label}</span>

            {tab.badge ? <span className="shrink-0">{tab.badge}</span> : null}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      {renderContent
        ? tabs.map((tab) => (
            <TabsPrimitive.Content
              key={tab.value}
              value={tab.value}
              className={cn(
                appTabsContentVariants({
                  spacing: contentSpacing,
                }),
                contentClassName,
              )}
            >
              {tab.content}
            </TabsPrimitive.Content>
          ))
        : null}
    </TabsPrimitive.Root>
  );
}

const AppTabs = React.forwardRef(AppTabsInner) as <
  TValue extends string = string,
>(
  props: AppTabsProps<TValue> & {
    ref?: React.ForwardedRef<React.ElementRef<typeof TabsPrimitive.Root>>;
  },
) => React.ReactElement;

export { AppTabs };
