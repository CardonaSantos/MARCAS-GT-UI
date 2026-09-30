import * as React from "react";

import type {
  AppCheckedValue,
  AppDateRangeValue,
  AppDateSingleValue,
  AppFieldKey,
  AppInputChangeEvent,
  AppTextareaChangeEvent,
} from "./app-handler-types";
import {
  normalizeAppPayload,
  type NormalizeAppPayloadOptions,
} from "./app-payload-handlers";

export interface UseAppStateHandlersOptions<TState> {
  onChange?: (nextState: TState) => void;
}

export function useAppStateHandlers<TState extends Record<string, any>>(
  initialState: TState | (() => TState),
  options: UseAppStateHandlersOptions<TState> = {},
) {
  const initialStateRef = React.useRef<TState | null>(null);

  const [state, internalSetState] = React.useState<TState>(() => {
    const resolved =
      typeof initialState === "function"
        ? (initialState as () => TState)()
        : initialState;

    initialStateRef.current = resolved;

    return resolved;
  });

  const setState = React.useCallback(
    (updater: React.SetStateAction<TState>) => {
      internalSetState((prev) => {
        const next =
          typeof updater === "function"
            ? (updater as (old: TState) => TState)(prev)
            : updater;

        options.onChange?.(next);

        return next;
      });
    },
    [options],
  );

  const setField = React.useCallback(
    <K extends AppFieldKey<TState>>(
      key: K,
      value: TState[K] | ((previousValue: TState[K]) => TState[K]),
    ) => {
      setState((prev) => {
        const previousValue = prev[key];

        const nextValue =
          typeof value === "function"
            ? (value as (previousValue: TState[K]) => TState[K])(previousValue)
            : value;

        return {
          ...prev,
          [key]: nextValue,
        };
      });
    },
    [setState],
  );

  const patch = React.useCallback(
    (values: Partial<TState>) => {
      setState((prev) => ({
        ...prev,
        ...values,
      }));
    },
    [setState],
  );

  const reset = React.useCallback(
    (nextState?: TState) => {
      setState(nextState ?? initialStateRef.current ?? ({} as TState));
    },
    [setState],
  );

  const clearField = React.useCallback(
    <K extends AppFieldKey<TState>>(key: K, emptyValue = "" as TState[K]) => {
      setField(key, emptyValue);
    },
    [setField],
  );

  const toggle = React.useCallback(
    <K extends AppFieldKey<TState>>(key: K) => {
      setField(key, (previousValue) => !Boolean(previousValue) as TState[K]);
    },
    [setField],
  );

  const text = React.useCallback(
    <K extends AppFieldKey<TState>>(
      key: K,
      transform?: (value: string) => TState[K],
    ) => {
      return (event: AppInputChangeEvent) => {
        const value = event.target.value;

        setField(key, transform ? transform(value) : (value as TState[K]));
      };
    },
    [setField],
  );

  const textarea = React.useCallback(
    <K extends AppFieldKey<TState>>(
      key: K,
      transform?: (value: string) => TState[K],
    ) => {
      return (event: AppTextareaChangeEvent) => {
        const value = event.target.value;

        setField(key, transform ? transform(value) : (value as TState[K]));
      };
    },
    [setField],
  );

  const numberText = React.useCallback(
    <K extends AppFieldKey<TState>>(
      key: K,
      emptyValue: TState[K] = null as TState[K],
    ) => {
      return (event: AppInputChangeEvent) => {
        const rawValue = event.target.value.trim();

        if (rawValue === "") {
          setField(key, emptyValue);
          return;
        }

        const parsed = Number(rawValue);

        setField(
          key,
          (Number.isNaN(parsed) ? emptyValue : parsed) as TState[K],
        );
      };
    },
    [setField],
  );

  const boolean = React.useCallback(
    <K extends AppFieldKey<TState>>(key: K) => {
      return (value: boolean) => {
        setField(key, value as TState[K]);
      };
    },
    [setField],
  );

  const checkbox = React.useCallback(
    <K extends AppFieldKey<TState>>(key: K) => {
      return (value: AppCheckedValue) => {
        setField(key, (value === true) as TState[K]);
      };
    },
    [setField],
  );

  const select = React.useCallback(
    <K extends AppFieldKey<TState>, TValue>(key: K) => {
      return (value: TValue | null) => {
        setField(key, value as TState[K]);
      };
    },
    [setField],
  );

  const multiSelect = React.useCallback(
    <K extends AppFieldKey<TState>, TValue>(key: K) => {
      return (values: TValue[]) => {
        setField(key, values as TState[K]);
      };
    },
    [setField],
  );

  const date = React.useCallback(
    <K extends AppFieldKey<TState>>(
      key: K,
      emptyValue: TState[K] = "" as TState[K],
    ) => {
      return (value: AppDateSingleValue) => {
        setField(key, (value ?? emptyValue) as TState[K]);
      };
    },
    [setField],
  );

  const dateRange = React.useCallback(
    <K extends AppFieldKey<TState>>(key: K) => {
      return (value: AppDateRangeValue) => {
        setField(key, {
          start: value.start ?? "",
          end: value.end ?? "",
        } as TState[K]);
      };
    },
    [setField],
  );

  const search = React.useCallback(
    <K extends AppFieldKey<TState>>(key: K) => {
      return (value: string) => {
        setField(key, value as TState[K]);
      };
    },
    [setField],
  );

  const inputProps = React.useCallback(
    <K extends AppFieldKey<TState>>(key: K) => ({
      value: String(state[key] ?? ""),
      onChange: text(key),
    }),
    [state, text],
  );

  const textareaProps = React.useCallback(
    <K extends AppFieldKey<TState>>(key: K) => ({
      value: String(state[key] ?? ""),
      onChange: textarea(key),
    }),
    [state, textarea],
  );

  const switchProps = React.useCallback(
    <K extends AppFieldKey<TState>>(key: K) => ({
      checked: Boolean(state[key]),
      onCheckedChange: boolean(key),
    }),
    [boolean, state],
  );

  const checkboxProps = React.useCallback(
    <K extends AppFieldKey<TState>>(key: K) => ({
      checked: Boolean(state[key]),
      onCheckedChange: checkbox(key),
    }),
    [checkbox, state],
  );

  const singleSelectProps = React.useCallback(
    <K extends AppFieldKey<TState>, TValue>(key: K) => ({
      value: (state[key] ?? null) as TValue | null,
      onChange: select<K, TValue>(key),
    }),
    [select, state],
  );

  const multiSelectProps = React.useCallback(
    <K extends AppFieldKey<TState>, TValue>(key: K) => ({
      value: (state[key] ?? []) as TValue[],
      onChange: multiSelect<K, TValue>(key),
    }),
    [multiSelect, state],
  );

  const datePickerSingleProps = React.useCallback(
    <K extends AppFieldKey<TState>>(key: K) => ({
      value: (state[key] ?? "") as string,
      onChange: date(key),
    }),
    [date, state],
  );

  const datePickerRangeProps = React.useCallback(
    <K extends AppFieldKey<TState>>(key: K) => ({
      value: (state[key] ?? { start: "", end: "" }) as AppDateRangeValue,
      onChange: dateRange(key),
    }),
    [dateRange, state],
  );

  const searchInputProps = React.useCallback(
    <K extends AppFieldKey<TState>, D extends AppFieldKey<TState> = K>(
      key: K,
      options?: {
        debouncedKey?: D;
      },
    ) => ({
      value: String(state[key] ?? ""),
      onValueChange: search(key),
      onDebouncedChange: options?.debouncedKey
        ? search(options.debouncedKey)
        : undefined,
    }),
    [search, state],
  );

  const toPayload = React.useCallback(
    <TPayload = TState>(payloadOptions?: NormalizeAppPayloadOptions) => {
      return normalizeAppPayload<TPayload>(state, payloadOptions);
    },
    [state],
  );

  return {
    state,
    setState,
    setField,
    patch,
    reset,
    clearField,
    toggle,

    text,
    textarea,
    numberText,
    boolean,
    checkbox,
    select,
    multiSelect,
    date,
    dateRange,
    search,

    inputProps,
    textareaProps,
    switchProps,
    checkboxProps,
    singleSelectProps,
    multiSelectProps,
    datePickerSingleProps,
    datePickerRangeProps,
    searchInputProps,

    toPayload,
  };
}
