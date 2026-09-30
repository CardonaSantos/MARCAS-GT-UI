import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { Loader2, Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { cn } from "@/lib/utils";
import { AppInput, type AppInputProps } from "./app-input";
import {
  appSearchInputIconVariants,
  appSearchInputWrapperVariants,
} from "../theme/app-search-input.variants";

type AppSearchInputChangeMeta = {
  source: "change" | "clear" | "enter" | "escape";
  rawValue: string;
  searchValue: string;
};

type AppSearchInputWrapperVariantProps = VariantProps<
  typeof appSearchInputWrapperVariants
>;

export interface AppSearchInputProps extends Omit<
  AppInputProps,
  | "type"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onClear"
  | "leftIcon"
  | "rightIcon"
  | "clearable"
  | "width"
> {
  wrapperWidth?: AppSearchInputWrapperVariantProps["wrapperWidth"];
  minWidth?: AppSearchInputWrapperVariantProps["minWidth"];

  value?: string;
  defaultValue?: string;

  onValueChange?: (value: string, meta: AppSearchInputChangeMeta) => void;

  onDebouncedChange?: (value: string, meta: AppSearchInputChangeMeta) => void;

  onSearch?: (value: string, meta: AppSearchInputChangeMeta) => void;

  onClear?: () => void;

  debounceMs?: number;
  minLength?: number;
  trimOnSearch?: boolean;

  isSearching?: boolean;
  showSearchIcon?: boolean;
  clearable?: boolean;
  clearOnEscape?: boolean;
  searchOnEnter?: boolean;

  wrapperClassName?: string;
  iconClassName?: string;
}

const AppSearchInput = React.forwardRef<HTMLInputElement, AppSearchInputProps>(
  (
    {
      className,
      containerClassName,
      wrapperClassName,
      iconClassName,

      value,
      defaultValue = "",
      onValueChange,
      onDebouncedChange,
      onSearch,
      onClear,

      debounceMs = 400,
      minLength = 0,
      trimOnSearch = true,

      isSearching = false,
      showSearchIcon = true,
      clearable = true,
      clearOnEscape = true,
      searchOnEnter = true,

      wrapperWidth = "full",
      minWidth = "none",

      placeholder = "Buscar...",
      size = "sm",
      radius = "sm",
      variant = "default",
      fieldWidth = "full",
      disabled,
      readOnly,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;

    const [internalValue, setInternalValue] = React.useState(defaultValue);

    const currentValue = isControlled ? value : internalValue;

    const normalizeValue = React.useCallback(
      (nextValue: string) => {
        const valueToSearch = trimOnSearch ? nextValue.trim() : nextValue;

        if (valueToSearch.length < minLength) {
          return "";
        }

        return valueToSearch;
      },
      [minLength, trimOnSearch],
    );

    const buildMeta = React.useCallback(
      (
        source: AppSearchInputChangeMeta["source"],
        rawValue: string,
      ): AppSearchInputChangeMeta => {
        return {
          source,
          rawValue,
          searchValue: normalizeValue(rawValue),
        };
      },
      [normalizeValue],
    );

    const debouncedChange = useDebouncedCallback(
      (nextValue: string, meta: AppSearchInputChangeMeta) => {
        onDebouncedChange?.(nextValue, meta);
      },
      debounceMs,
    );

    const emitValueChange = React.useCallback(
      (nextRawValue: string, source: AppSearchInputChangeMeta["source"]) => {
        const meta = buildMeta(source, nextRawValue);

        if (!isControlled) {
          setInternalValue(nextRawValue);
        }

        onValueChange?.(nextRawValue, meta);
        debouncedChange(meta.searchValue, meta);
      },
      [buildMeta, debouncedChange, isControlled, onValueChange],
    );

    const handleClear = React.useCallback(
      (source: AppSearchInputChangeMeta["source"] = "clear") => {
        const meta = buildMeta(source, "");

        if (!isControlled) {
          setInternalValue("");
        }

        onValueChange?.("", meta);
        onDebouncedChange?.("", meta);
        onSearch?.("", meta);
        onClear?.();
      },
      [
        buildMeta,
        isControlled,
        onClear,
        onDebouncedChange,
        onSearch,
        onValueChange,
      ],
    );

    const handleSearch = React.useCallback(() => {
      const meta = buildMeta("enter", currentValue ?? "");
      onSearch?.(meta.searchValue, meta);
    }, [buildMeta, currentValue, onSearch]);

    const hasValue = Boolean(currentValue);
    const showLoading = Boolean(isSearching);
    const iconActive = hasValue || showLoading;

    return (
      <div
        className={cn(
          appSearchInputWrapperVariants({
            wrapperWidth,
            minWidth,
          }),
          wrapperClassName,
        )}
      >
        <AppInput
          ref={ref}
          {...props}
          type="search"
          role="searchbox"
          value={currentValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          size={size}
          radius={radius}
          variant={variant}
          fieldWidth={fieldWidth}
          clearable={clearable && hasValue && !disabled && !readOnly}
          onClear={() => handleClear("clear")}
          containerClassName={containerClassName}
          className={className}
          leftIcon={
            showSearchIcon ? (
              showLoading ? (
                <Loader2
                  className={cn(
                    "animate-spin",
                    appSearchInputIconVariants({
                      active: iconActive,
                      loading: true,
                    }),
                    iconClassName,
                  )}
                />
              ) : (
                <Search
                  className={cn(
                    appSearchInputIconVariants({
                      active: iconActive,
                      loading: false,
                    }),
                    iconClassName,
                  )}
                />
              )
            ) : undefined
          }
          onChange={(event) => {
            emitValueChange(event.target.value, "change");
          }}
          onKeyDown={(event) => {
            props.onKeyDown?.(event);

            if (event.defaultPrevented) return;

            if (event.key === "Enter" && searchOnEnter) {
              handleSearch();
            }

            if (
              event.key === "Escape" &&
              clearOnEscape &&
              currentValue &&
              !disabled &&
              !readOnly
            ) {
              handleClear("escape");
            }
          }}
        />
      </div>
    );
  },
);

AppSearchInput.displayName = "AppSearchInput";

export {
  AppSearchInput,
  appSearchInputWrapperVariants,
  appSearchInputIconVariants,
};

export type { AppSearchInputChangeMeta };
