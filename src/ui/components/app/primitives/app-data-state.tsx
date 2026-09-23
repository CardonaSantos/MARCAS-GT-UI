import * as React from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { AppAlert } from "./app-alert";
import { AppButton } from "./app-button";
import { AppEmptyState, type AppEmptyStatePreset } from "./app-empty-state";
import { AppLoader } from "./app-loader";
import { AppSkeleton, AppSkeletonCard, AppSkeletonText } from "./app-skeleton";
import {
  appDataStateLoadingVariants,
  appDataStateVariants,
} from "../theme/app-data-state.variants";

type AppDataStateLoadingVariant =
  | "none"
  | "spinner"
  | "skeleton"
  | "skeleton-text"
  | "skeleton-card"
  | "skeleton-grid";

type AppDataStateErrorFallback =
  | React.ReactNode
  | ((error: unknown) => React.ReactNode);

type AppDataStateEmptyFallback = React.ReactNode | (() => React.ReactNode);

function getDefaultErrorMessage(error: unknown): string {
  if (!error) {
    return "Ocurrió un error inesperado.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return "No se pudo cargar la información.";
}

export interface AppDataStateProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title">,
    VariantProps<typeof appDataStateVariants> {
  children?: React.ReactNode;

  isLoading?: boolean;
  isFetching?: boolean;
  isEmpty?: boolean;
  error?: unknown;

  /**
   * Loading personalizado.
   */
  loadingFallback?: React.ReactNode;

  /**
   * Error personalizado.
   */
  errorFallback?: AppDataStateErrorFallback;

  /**
   * Empty personalizado.
   */
  emptyFallback?: AppDataStateEmptyFallback;

  loadingVariant?: AppDataStateLoadingVariant;
  loadingRows?: number;
  loadingText?: React.ReactNode;

  emptyPreset?: AppEmptyStatePreset;
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  emptyAction?: React.ReactNode;

  errorTitle?: React.ReactNode;
  errorDescription?: React.ReactNode;
  retryLabel?: React.ReactNode;
  onRetry?: () => void;

  /**
   * Si true, cuando hay data pero isFetching=true, muestra children y un indicador pequeño arriba.
   */
  showFetchingIndicator?: boolean;
  fetchingText?: React.ReactNode;

  contentClassName?: string;
  loadingClassName?: string;
  emptyClassName?: string;
  errorClassName?: string;
}

const AppDataState = React.forwardRef<HTMLDivElement, AppDataStateProps>(
  (
    {
      className,
      children,

      isLoading = false,
      isFetching = false,
      isEmpty = false,
      error,

      loadingFallback,
      errorFallback,
      emptyFallback,

      loadingVariant = "skeleton-card",
      loadingRows = 3,
      loadingText = "Cargando información...",

      emptyPreset = "empty",
      emptyTitle = "No hay datos",
      emptyDescription = "No se encontraron registros para mostrar.",
      emptyAction,

      errorTitle = "No se pudo cargar la información",
      errorDescription,
      retryLabel = "Reintentar",
      onRetry,

      showFetchingIndicator = true,
      fetchingText = "Actualizando...",
      contentClassName,
      loadingClassName,
      emptyClassName,
      errorClassName,

      variant = "plain",
      size = "sm",
      gap = "sm",
      radius = "md",
      align = "stretch",
      minHeight = "none",
      centerContent = false,
      animation = "none",

      ...props
    },
    ref,
  ) => {
    const hasError = Boolean(error);
    const shouldShowLoading = Boolean(isLoading);
    const shouldShowEmpty = !shouldShowLoading && !hasError && isEmpty;
    const shouldShowSuccess = !shouldShowLoading && !hasError && !isEmpty;

    const renderLoading = () => {
      if (loadingFallback) {
        return loadingFallback;
      }

      if (loadingVariant === "none") {
        return null;
      }

      if (loadingVariant === "spinner") {
        return (
          <div
            className={cn(
              appDataStateLoadingVariants({ layout: "center" }),
              "min-h-[6rem]",
              loadingClassName,
            )}
          >
            <div className="flex items-center gap-2 text-sm text-[hsl(var(--app-muted-foreground))]">
              <AppLoader size="sm" tone="primary" />
              <span>{loadingText}</span>
            </div>
          </div>
        );
      }

      if (loadingVariant === "skeleton-text") {
        return (
          <div className={cn(loadingClassName)}>
            <AppSkeletonText lines={loadingRows} />
          </div>
        );
      }

      if (loadingVariant === "skeleton") {
        return (
          <div
            className={cn(
              appDataStateLoadingVariants({ layout: "stack" }),
              loadingClassName,
            )}
          >
            {Array.from({ length: loadingRows }).map((_, index) => (
              <AppSkeleton key={index} size="xl" radius="sm" />
            ))}
          </div>
        );
      }

      if (loadingVariant === "skeleton-grid") {
        return (
          <div
            className={cn(
              appDataStateLoadingVariants({ layout: "grid" }),
              loadingClassName,
            )}
          >
            {Array.from({ length: loadingRows }).map((_, index) => (
              <AppSkeletonCard key={index} lines={2} />
            ))}
          </div>
        );
      }

      return (
        <div className={cn(loadingClassName)}>
          <AppSkeletonCard lines={loadingRows} />
        </div>
      );
    };

    const renderError = () => {
      if (typeof errorFallback === "function") {
        return errorFallback(error);
      }

      if (errorFallback) {
        return errorFallback;
      }

      const message = errorDescription ?? getDefaultErrorMessage(error);

      return (
        <AppAlert
          tone="danger"
          title={errorTitle}
          className={errorClassName}
          action={
            onRetry ? (
              <AppButton size="xs" variant="outline" onClick={onRetry}>
                {retryLabel}
              </AppButton>
            ) : undefined
          }
        >
          {message}
        </AppAlert>
      );
    };

    const renderEmpty = () => {
      if (typeof emptyFallback === "function") {
        return emptyFallback();
      }

      if (emptyFallback) {
        return emptyFallback;
      }

      return (
        <AppEmptyState
          preset={emptyPreset}
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
          size={size}
          variant="plain"
          className={emptyClassName}
        />
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          appDataStateVariants({
            variant,
            size,
            gap,
            radius,
            align,
            minHeight,
            centerContent,
            animation,
          }),
          className,
        )}
        {...props}
      >
        {shouldShowLoading ? renderLoading() : null}

        {hasError && !shouldShowLoading ? renderError() : null}

        {shouldShowEmpty ? renderEmpty() : null}

        {shouldShowSuccess ? (
          <div className={cn("min-w-0", contentClassName)}>
            {showFetchingIndicator && isFetching ? (
              <div className="mb-2 flex items-center gap-2 text-xs text-[hsl(var(--app-muted-foreground))]">
                <AppLoader size="xs" tone="primary" />
                <span>{fetchingText}</span>
              </div>
            ) : null}

            {children}
          </div>
        ) : null}
      </div>
    );
  },
);

AppDataState.displayName = "AppDataState";

export { AppDataState, appDataStateVariants, appDataStateLoadingVariants };

export type { AppDataStateLoadingVariant };
