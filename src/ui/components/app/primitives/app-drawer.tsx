"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type AppDrawerSide = "right" | "left";

type AppDrawerRootProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Root
>;

interface AppDrawerContentProps extends React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> {
  side?: AppDrawerSide;
  showCloseButton?: boolean;
}

function cleanupDrawerPointerLock() {
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

const AppDrawer = ({
  open,
  onOpenChange,
  modal = false,
  ...props
}: AppDrawerRootProps) => {
  React.useEffect(() => {
    if (!open) cleanupDrawerPointerLock();
  }, [open]);

  React.useEffect(() => {
    return () => cleanupDrawerPointerLock();
  }, []);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      onOpenChange?.(nextOpen);
      if (!nextOpen) cleanupDrawerPointerLock();
    },
    [onOpenChange],
  );

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={handleOpenChange}
      modal={modal}
      {...props}
    />
  );
};

const AppDrawerTrigger = DialogPrimitive.Trigger;
const AppDrawerClose = DialogPrimitive.Close;
const AppDrawerPortal = DialogPrimitive.Portal;

const AppDrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[80] bg-black/35 backdrop-blur-[1px]",
      "transition-opacity duration-500 ease-out",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
      className,
    )}
    {...props}
  />
));
AppDrawerOverlay.displayName = DialogPrimitive.Overlay.displayName;

const AppDrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  AppDrawerContentProps
>(
  (
    {
      className,
      children,
      side = "right",
      showCloseButton = true,
      onCloseAutoFocus,
      ...props
    },
    ref,
  ) => (
    <AppDrawerPortal>
      <AppDrawerOverlay />

      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed inset-y-0 z-[90] flex h-screen w-[92vw] flex-col",
          "border-[hsl(var(--app-border,var(--border)))]",
          "bg-[hsl(var(--app-background,var(--background)))]",
          "text-[hsl(var(--app-foreground,var(--foreground)))] shadow-xl",
          "transition-transform duration-500 ease-out",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          side === "right" &&
            "right-0 border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
          side === "left" &&
            "left-0 border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
          className,
        )}
        onCloseAutoFocus={(event) => {
          onCloseAutoFocus?.(event);
          cleanupDrawerPointerLock();
        }}
        {...props}
      >
        {children}

        {showCloseButton ? (
          <DialogPrimitive.Close
            className={cn(
              "absolute right-3 top-3 z-10 inline-flex h-7 w-7 items-center justify-center",
              "rounded-[var(--app-radius-md)] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
              "transition-colors hover:bg-[hsl(var(--app-muted,var(--muted))/0.65)]",
              "hover:text-[hsl(var(--app-foreground,var(--foreground)))]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
            )}
          >
            <X size={14} />
            <span className="sr-only">Cerrar</span>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </AppDrawerPortal>
  ),
);
AppDrawerContent.displayName = DialogPrimitive.Content.displayName;

const AppDrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "shrink-0 border-b border-[hsl(var(--app-border,var(--border)))] px-4 py-3 pr-11",
      className,
    )}
    {...props}
  />
);

const AppDrawerBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("min-h-0 flex-1 overflow-y-auto", className)} {...props} />
);

const AppDrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-sm font-semibold leading-none text-[hsl(var(--app-foreground,var(--foreground)))]",
      className,
    )}
    {...props}
  />
));
AppDrawerTitle.displayName = DialogPrimitive.Title.displayName;

const AppDrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      "mt-1 text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
      className,
    )}
    {...props}
  />
));
AppDrawerDescription.displayName = DialogPrimitive.Description.displayName;

export {
  AppDrawer,
  AppDrawerTrigger,
  AppDrawerClose,
  AppDrawerPortal,
  AppDrawerOverlay,
  AppDrawerContent,
  AppDrawerHeader,
  AppDrawerBody,
  AppDrawerTitle,
  AppDrawerDescription,
};
