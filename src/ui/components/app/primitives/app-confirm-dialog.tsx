import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import type { VariantProps } from "class-variance-authority";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Info,
  Send,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { AppButton } from "./app-button";
import { AppSelectPortalProvider } from "./app-select-portal-context";
import {
  appConfirmDialogBodyVariants,
  appConfirmDialogContentCardVariants,
  appConfirmDialogContentVariants,
  appConfirmDialogDescriptionVariants,
  appConfirmDialogFooterVariants,
  appConfirmDialogIconVariants,
  appConfirmDialogOverlayVariants,
  appConfirmDialogTitleVariants,
} from "../theme/app-confirm-dialog.variants";

export type AppConfirmDialogTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type AppConfirmDialogPreset =
  | "confirm"
  | "delete"
  | "send"
  | "warning"
  | "success"
  | "info";

const PRESET_TONE: Record<AppConfirmDialogPreset, AppConfirmDialogTone> = {
  confirm: "neutral",
  delete: "danger",
  send: "info",
  warning: "warning",
  success: "success",
  info: "info",
};

const PRESET_ICON: Record<AppConfirmDialogPreset, React.ReactNode> = {
  confirm: <HelpCircle />,
  delete: <Trash2 />,
  send: <Send />,
  warning: <AlertTriangle />,
  success: <CheckCircle2 />,
  info: <Info />,
};

const TONE_DEFAULT_CONFIRM_TEXT: Record<AppConfirmDialogTone, string> = {
  neutral: "Confirmar",
  info: "Continuar",
  success: "Aceptar",
  warning: "Continuar",
  danger: "Eliminar",
};

const TONE_CONFIRM_VARIANT: Record<
  AppConfirmDialogTone,
  React.ComponentProps<typeof AppButton>["variant"]
> = {
  neutral: "primary",
  info: "primary",
  success: "primary",
  warning: "primary",
  danger: "danger",
};

export interface AppConfirmDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  trigger?: React.ReactNode;

  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;

  preset?: AppConfirmDialogPreset;
  tone?: AppConfirmDialogTone;
  icon?: React.ReactNode;
  showIcon?: boolean;

  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  loadingText?: string;

  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  onConfirmError?: (error: unknown) => void;

  isLoading?: boolean;
  disabled?: boolean;

  closeOnConfirm?: boolean;
  closeOnCancel?: boolean;

  /**
   * Evita cerrar por Escape, click externo, botón X o cancelar.
   * Confirmar sí puede cerrar si closeOnConfirm=true.
   */
  preventClose?: boolean;

  showCloseButton?: boolean;
  showDivider?: boolean;
  contentCard?: boolean;

  size?: VariantProps<typeof appConfirmDialogBodyVariants>["size"];
  maxWidth?: VariantProps<typeof appConfirmDialogContentVariants>["maxWidth"];
  radius?: VariantProps<typeof appConfirmDialogContentVariants>["radius"];
  align?: VariantProps<typeof appConfirmDialogBodyVariants>["align"];
  footerAlign?: VariantProps<typeof appConfirmDialogFooterVariants>["align"];

  confirmButtonVariant?: React.ComponentProps<typeof AppButton>["variant"];
  cancelButtonVariant?: React.ComponentProps<typeof AppButton>["variant"];

  className?: string;
  overlayClassName?: string;
  bodyClassName?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentCardClassName?: string;
  footerClassName?: string;
}

const AppConfirmDialog = React.forwardRef<
  React.ElementRef<typeof AlertDialog.Content>,
  AppConfirmDialogProps
>(
  (
    {
      open,
      defaultOpen = false,
      onOpenChange,
      trigger,

      title,
      description,
      children,

      preset = "confirm",
      tone,
      icon,
      showIcon = true,

      confirmText,
      cancelText = "Cancelar",
      loadingText = "Procesando...",

      onConfirm,
      onCancel,
      onConfirmError,

      isLoading = false,
      disabled = false,

      closeOnConfirm = true,
      closeOnCancel = true,
      preventClose = false,

      showCloseButton = true,
      showDivider = false,
      contentCard = false,

      size = "sm",
      maxWidth = "md",
      radius = "lg",
      align = "center",
      footerAlign = "right",

      confirmButtonVariant,
      cancelButtonVariant = "secondary",

      className,
      overlayClassName,
      bodyClassName,
      iconClassName,
      titleClassName,
      descriptionClassName,
      contentCardClassName,
      footerClassName,
    },
    ref,
  ) => {
    const isControlled = open !== undefined;
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const [internalLoading, setInternalLoading] = React.useState(false);
    const [contentElement, setContentElement] = React.useState<React.ElementRef<
      typeof AlertDialog.Content
    > | null>(null);

    const currentOpen = isControlled ? open : internalOpen;
    const resolvedTone = tone ?? PRESET_TONE[preset];
    const resolvedIcon = icon ?? PRESET_ICON[preset];
    const resolvedConfirmText =
      confirmText ?? TONE_DEFAULT_CONFIRM_TEXT[resolvedTone];

    const busy = Boolean(isLoading || internalLoading);
    const confirmVariant =
      confirmButtonVariant ?? TONE_CONFIRM_VARIANT[resolvedTone];

    const setComposedContentRef = React.useCallback(
      (node: React.ElementRef<typeof AlertDialog.Content> | null) => {
        setContentElement(node);

        if (typeof ref === "function") {
          ref(node);
          return;
        }

        if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const setOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (!isControlled) {
          setInternalOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
      },
      [isControlled, onOpenChange],
    );

    const handleOpenChange = React.useCallback(
      (nextOpen: boolean) => {
        if (!nextOpen && (preventClose || busy)) {
          return;
        }

        setOpen(nextOpen);
      },
      [busy, preventClose, setOpen],
    );

    const handleCancel = React.useCallback(() => {
      if (busy || preventClose || disabled) return;

      onCancel?.();

      if (closeOnCancel) {
        setOpen(false);
      }
    }, [busy, closeOnCancel, disabled, onCancel, preventClose, setOpen]);

    const handleConfirm = React.useCallback(async () => {
      if (busy || disabled) return;

      try {
        const result = onConfirm?.();

        if (result instanceof Promise) {
          setInternalLoading(true);
          await result;
        }

        if (closeOnConfirm) {
          setOpen(false);
        }
      } catch (error) {
        onConfirmError?.(error);

        if (!onConfirmError) {
          console.error(error);
        }
      } finally {
        setInternalLoading(false);
      }
    }, [busy, closeOnConfirm, disabled, onConfirm, onConfirmError, setOpen]);

    return (
      <AlertDialog.Root
        open={currentOpen}
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
      >
        {trigger ? (
          <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
        ) : null}

        <AlertDialog.Portal>
          <AlertDialog.Overlay
            className={cn(appConfirmDialogOverlayVariants(), overlayClassName)}
          />

          <AlertDialog.Content
            ref={setComposedContentRef}
            className={cn(
              appConfirmDialogContentVariants({
                maxWidth,
                radius,
              }),
              "overflow-visible",
              className,
            )}
            onEscapeKeyDown={(event) => {
              if (preventClose || busy) {
                event.preventDefault();
              }
            }}
          >
            <AppSelectPortalProvider target={contentElement}>
              <div
                className={cn(
                  appConfirmDialogBodyVariants({
                    size,
                    align,
                  }),
                  "overflow-visible",
                  bodyClassName,
                )}
              >
                {showCloseButton ? (
                  <button
                    type="button"
                    aria-label="Cerrar"
                    disabled={busy || preventClose}
                    onClick={handleCancel}
                    className={cn(
                      "absolute right-2 top-2",
                      "inline-flex h-7 w-7 items-center justify-center",
                      "rounded-[var(--app-radius-sm)]",
                      "text-[hsl(var(--app-confirm-muted-foreground))]",
                      "transition-[color,background-color,opacity,transform]",
                      "duration-[var(--app-motion-duration-fast)]",
                      "ease-[var(--app-motion-ease-standard)]",
                      "hover:bg-black/5 hover:text-[hsl(var(--app-confirm-foreground))]",
                      "dark:hover:bg-white/10",
                      "active:scale-[var(--app-motion-scale-press)]",
                      "focus-visible:outline-none",
                      "focus-visible:ring-2",
                      "focus-visible:ring-[hsl(var(--app-ring))]",
                      "disabled:pointer-events-none disabled:opacity-50",
                    )}
                  >
                    <AlertCircle className="h-3.5 w-3.5 opacity-0" />
                    <span className="absolute text-base leading-none">×</span>
                  </button>
                ) : null}

                {showIcon ? (
                  <div
                    className={cn(
                      appConfirmDialogIconVariants({
                        tone: resolvedTone,
                        size,
                      }),
                      iconClassName,
                    )}
                  >
                    {resolvedIcon}
                  </div>
                ) : null}

                <div className="min-w-0 space-y-1">
                  <AlertDialog.Title
                    className={cn(
                      appConfirmDialogTitleVariants({ size }),
                      titleClassName,
                    )}
                  >
                    {title}
                  </AlertDialog.Title>

                  {description ? (
                    <AlertDialog.Description
                      className={cn(
                        appConfirmDialogDescriptionVariants({ size }),
                        descriptionClassName,
                      )}
                    >
                      {description}
                    </AlertDialog.Description>
                  ) : null}
                </div>

                {children ? (
                  contentCard ? (
                    <div
                      className={cn(
                        appConfirmDialogContentCardVariants({
                          size,
                          radius: "md",
                        }),
                        "overflow-visible",
                        contentCardClassName,
                      )}
                    >
                      {children}
                    </div>
                  ) : (
                    <div className="w-full min-w-0 overflow-visible">
                      {children}
                    </div>
                  )
                ) : null}

                {showDivider ? (
                  <div className="h-px w-full bg-[hsl(var(--app-confirm-border))]" />
                ) : null}

                <div
                  className={cn(
                    appConfirmDialogFooterVariants({
                      align: footerAlign,
                    }),
                    footerClassName,
                  )}
                >
                  <AppButton
                    type="button"
                    variant={cancelButtonVariant}
                    size="sm"
                    width="full"
                    disabled={busy || preventClose || disabled}
                    onClick={handleCancel}
                  >
                    {cancelText}
                  </AppButton>

                  <AppButton
                    type="button"
                    variant={confirmVariant}
                    size="sm"
                    width="full"
                    disabled={disabled}
                    loading={busy}
                    loadingText={loadingText}
                    onClick={handleConfirm}
                  >
                    {resolvedConfirmText}
                  </AppButton>
                </div>
              </div>
            </AppSelectPortalProvider>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    );
  },
);

AppConfirmDialog.displayName = "AppConfirmDialog";

export {
  AppConfirmDialog,
  appConfirmDialogOverlayVariants,
  appConfirmDialogContentVariants,
  appConfirmDialogBodyVariants,
  appConfirmDialogIconVariants,
  appConfirmDialogTitleVariants,
  appConfirmDialogDescriptionVariants,
  appConfirmDialogContentCardVariants,
  appConfirmDialogFooterVariants,
};
