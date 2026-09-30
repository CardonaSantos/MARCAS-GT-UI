"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  appDialogBodyVariants,
  appDialogContentVariants,
  appDialogDescriptionVariants,
  appDialogFooterVariants,
  appDialogHeaderVariants,
  appDialogOverlayVariants,
  appDialogTitleVariants,
} from "../theme/app-dialog.variants";
import { AppSelectPortalProvider } from "./app-select-portal-context";

type AppDialogProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Root
>;

function cleanupDialogPointerLock() {
  if (typeof window === "undefined") return;

  const cleanup = () => {
    const hasOpenDialog = document.querySelector(
      '[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]',
    );

    if (!hasOpenDialog && document.body.style.pointerEvents === "none") {
      document.body.style.pointerEvents = "";
    }
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(cleanup);
  });

  window.setTimeout(cleanup, 120);
}

const AppDialog = ({ open, onOpenChange, ...props }: AppDialogProps) => {
  React.useEffect(() => {
    if (!open) {
      cleanupDialogPointerLock();
    }
  }, [open]);

  React.useEffect(() => {
    return () => {
      cleanupDialogPointerLock();
    };
  }, []);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      onOpenChange?.(nextOpen);

      if (!nextOpen) {
        cleanupDialogPointerLock();
      }
    },
    [onOpenChange],
  );

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={handleOpenChange}
      {...props}
    />
  );
};

const AppDialogTrigger = DialogPrimitive.Trigger;
const AppDialogClose = DialogPrimitive.Close;
const AppDialogPortal = DialogPrimitive.Portal;

const AppDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(appDialogOverlayVariants(), className)}
    {...props}
  />
));
AppDialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

type AppDialogSize = NonNullable<
  VariantProps<typeof appDialogContentVariants>["size"]
>;

export interface AppDialogContentProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
      "className"
    >,
    Omit<VariantProps<typeof appDialogContentVariants>, "size"> {
  className?: string;
  size?: AppDialogSize;

  /**
   * Alias temporal para no romper usos anteriores como width="2xl".
   * Preferir size.
   */
  width?: AppDialogSize;

  showCloseButton?: boolean;
}

type AppDialogContentPrimitiveProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
>;

const AppDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  AppDialogContentProps
>(
  (
    {
      className,
      children,
      size,
      width,
      viewport,
      radius,
      padding,
      showCloseButton = true,
      onCloseAutoFocus,
      onPointerDownOutside,
      onInteractOutside,
      ...props
    },
    ref,
  ) => {
    const resolvedSize = size ?? width;

    const [selectPortalTarget, setSelectPortalTarget] =
      React.useState<HTMLDivElement | null>(null);

    const handlePointerDownOutside = React.useCallback<
      NonNullable<AppDialogContentPrimitiveProps["onPointerDownOutside"]>
    >(
      (event) => {
        const target = event.target as HTMLElement | null;

        if (target?.closest("[data-app-select-menu-portal-root]")) {
          event.preventDefault();
          return;
        }

        onPointerDownOutside?.(event);
      },
      [onPointerDownOutside],
    );

    const handleInteractOutside = React.useCallback<
      NonNullable<AppDialogContentPrimitiveProps["onInteractOutside"]>
    >(
      (event) => {
        const target = event.target as HTMLElement | null;

        if (target?.closest("[data-app-select-menu-portal-root]")) {
          event.preventDefault();
          return;
        }

        onInteractOutside?.(event);
      },
      [onInteractOutside],
    );

    return (
      <AppDialogPortal>
        <AppDialogOverlay />

        <AppSelectPortalProvider target={selectPortalTarget}>
          <DialogPrimitive.Content
            ref={ref}
            data-app-dialog-content
            className={cn(
              appDialogContentVariants({
                size: resolvedSize,
                viewport,
                radius,
                padding,
              }),
              className,
            )}
            onCloseAutoFocus={(event) => {
              onCloseAutoFocus?.(event);
              cleanupDialogPointerLock();
            }}
            onPointerDownOutside={handlePointerDownOutside}
            onInteractOutside={handleInteractOutside}
            {...props}
          >
            {children}

            {showCloseButton ? (
              <DialogPrimitive.Close
                className={cn(
                  "absolute right-3 top-3 z-10 rounded-[var(--app-radius-sm)]",
                  "p-1 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
                  "transition-colors hover:bg-[hsl(var(--app-muted,var(--muted)))]",
                  "hover:text-[hsl(var(--app-foreground,var(--foreground)))]",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
                )}
              >
                <X size={15} />
                <span className="sr-only">Cerrar</span>
              </DialogPrimitive.Close>
            ) : null}
          </DialogPrimitive.Content>

          <div
            ref={setSelectPortalTarget}
            data-app-select-menu-portal-root
            className="fixed inset-0 z-[2147483647] pointer-events-none"
          />
        </AppSelectPortalProvider>
      </AppDialogPortal>
    );
  },
);
AppDialogContent.displayName = DialogPrimitive.Content.displayName;

export interface AppDialogHeaderProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appDialogHeaderVariants> {}

const AppDialogHeader = ({
  className,
  divider,
  ...props
}: AppDialogHeaderProps) => (
  <div
    className={cn(appDialogHeaderVariants({ divider }), className)}
    {...props}
  />
);
AppDialogHeader.displayName = "AppDialogHeader";

export interface AppDialogBodyProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appDialogBodyVariants> {}

const AppDialogBody = ({
  className,
  padding,
  divider,
  ...props
}: AppDialogBodyProps) => (
  <div
    className={cn(appDialogBodyVariants({ padding, divider }), className)}
    {...props}
  />
);
AppDialogBody.displayName = "AppDialogBody";

export interface AppDialogFooterProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appDialogFooterVariants> {}

const AppDialogFooter = ({
  className,
  divider,
  ...props
}: AppDialogFooterProps) => (
  <div
    className={cn(appDialogFooterVariants({ divider }), className)}
    {...props}
  />
);
AppDialogFooter.displayName = "AppDialogFooter";

const AppDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(appDialogTitleVariants(), className)}
    {...props}
  />
));
AppDialogTitle.displayName = DialogPrimitive.Title.displayName;

const AppDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(appDialogDescriptionVariants(), className)}
    {...props}
  />
));
AppDialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  AppDialog,
  AppDialogTrigger,
  AppDialogClose,
  AppDialogPortal,
  AppDialogOverlay,
  AppDialogContent,
  AppDialogHeader,
  AppDialogBody,
  AppDialogFooter,
  AppDialogTitle,
  AppDialogDescription,
};
