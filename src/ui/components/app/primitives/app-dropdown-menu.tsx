"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { VariantProps } from "class-variance-authority";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  appDropdownMenuContentVariants,
  appDropdownMenuItemVariants,
  appDropdownMenuLabelVariants,
  appDropdownMenuSeparatorVariants,
  appDropdownMenuShortcutVariants,
} from "../theme/app-dropdown-menu.variants";

const AppDropdownMenu = DropdownMenuPrimitive.Root;
const AppDropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const AppDropdownMenuGroup = DropdownMenuPrimitive.Group;
const AppDropdownMenuPortal = DropdownMenuPrimitive.Portal;
const AppDropdownMenuSub = DropdownMenuPrimitive.Sub;
const AppDropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export interface AppDropdownMenuContentProps
  extends
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>,
    VariantProps<typeof appDropdownMenuContentVariants> {}

const AppDropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  AppDropdownMenuContentProps
>(
  (
    {
      className,
      align = "end",
      sideOffset = 6,
      size,
      radius,
      width,
      collisionPadding = 8,
      ...props
    },
    ref,
  ) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          appDropdownMenuContentVariants({
            size,
            radius,
            width,
          }),
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  ),
);
AppDropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

export interface AppDropdownMenuItemProps
  extends
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>,
    VariantProps<typeof appDropdownMenuItemVariants> {
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
}

const AppDropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  AppDropdownMenuItemProps
>(
  (
    { className, size, tone, inset, icon, shortcut, children, ...props },
    ref,
  ) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        appDropdownMenuItemVariants({
          size,
          tone,
          inset,
        }),
        className,
      )}
      {...props}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span className="min-w-0 truncate">{children}</span>
      {shortcut ? (
        <span className={appDropdownMenuShortcutVariants()}>{shortcut}</span>
      ) : null}
    </DropdownMenuPrimitive.Item>
  ),
);
AppDropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

export interface AppDropdownMenuCheckboxItemProps
  extends
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    VariantProps<typeof appDropdownMenuItemVariants> {}

const AppDropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  AppDropdownMenuCheckboxItemProps
>(({ className, children, checked, size, tone, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    checked={checked}
    className={cn(
      appDropdownMenuItemVariants({
        size,
        tone,
        inset: true,
      }),
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-3.5 w-3.5" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    <span className="min-w-0 truncate">{children}</span>
  </DropdownMenuPrimitive.CheckboxItem>
));
AppDropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

export interface AppDropdownMenuRadioItemProps
  extends
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>,
    VariantProps<typeof appDropdownMenuItemVariants> {}

const AppDropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  AppDropdownMenuRadioItemProps
>(({ className, children, size, tone, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      appDropdownMenuItemVariants({
        size,
        tone,
        inset: true,
      }),
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    <span className="min-w-0 truncate">{children}</span>
  </DropdownMenuPrimitive.RadioItem>
));
AppDropdownMenuRadioItem.displayName =
  DropdownMenuPrimitive.RadioItem.displayName;

export interface AppDropdownMenuLabelProps
  extends
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>,
    VariantProps<typeof appDropdownMenuLabelVariants> {}

const AppDropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  AppDropdownMenuLabelProps
>(({ className, size, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(appDropdownMenuLabelVariants({ size }), className)}
    {...props}
  />
));
AppDropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const AppDropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn(appDropdownMenuSeparatorVariants(), className)}
    {...props}
  />
));
AppDropdownMenuSeparator.displayName =
  DropdownMenuPrimitive.Separator.displayName;

const AppDropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(appDropdownMenuShortcutVariants(), className)}
    {...props}
  />
);
AppDropdownMenuShortcut.displayName = "AppDropdownMenuShortcut";

const AppDropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> &
    VariantProps<typeof appDropdownMenuItemVariants> & {
      icon?: React.ReactNode;
    }
>(({ className, children, size, tone, inset, icon, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      appDropdownMenuItemVariants({
        size,
        tone,
        inset,
      }),
      className,
    )}
    {...props}
  >
    {icon ? <span className="shrink-0">{icon}</span> : null}
    <span className="min-w-0 truncate">{children}</span>
    <ChevronRight className="ml-auto h-3.5 w-3.5" />
  </DropdownMenuPrimitive.SubTrigger>
));
AppDropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const AppDropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  AppDropdownMenuContentProps
>(({ className, size, radius, width, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      appDropdownMenuContentVariants({
        size,
        radius,
        width,
      }),
      className,
    )}
    {...props}
  />
));
AppDropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

export {
  AppDropdownMenu,
  AppDropdownMenuTrigger,
  AppDropdownMenuContent,
  AppDropdownMenuItem,
  AppDropdownMenuCheckboxItem,
  AppDropdownMenuRadioItem,
  AppDropdownMenuLabel,
  AppDropdownMenuSeparator,
  AppDropdownMenuShortcut,
  AppDropdownMenuGroup,
  AppDropdownMenuPortal,
  AppDropdownMenuSub,
  AppDropdownMenuSubTrigger,
  AppDropdownMenuSubContent,
  AppDropdownMenuRadioGroup,
};
