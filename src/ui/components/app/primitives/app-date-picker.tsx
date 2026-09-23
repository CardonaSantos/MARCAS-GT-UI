import * as React from "react";
import dayjs, { type Dayjs } from "dayjs";

import { cn } from "@/lib/utils";
import { AppInput, type AppInputProps } from "./app-input";

export type AppDateLike = string | Date | Dayjs | null | undefined;

export type AppDateBoundary = "none" | "startOfDay" | "endOfDay";

export type AppDateOutputFormat = "iso" | string;

export interface AppDateChangeMeta {
  inputValue: string | null;
  date: Dayjs | null;
  iso: string | null;
  boundary: AppDateBoundary;
}

export interface AppDateRangeValue {
  start: string | null;
  end: string | null;
}

export interface AppDateRangeChangeMeta {
  changed: "start" | "end";
  start: AppDateChangeMeta;
  end: AppDateChangeMeta;
}

type DateInputBaseProps = Omit<
  AppInputProps,
  | "type"
  | "value"
  | "onChange"
  | "clearable"
  | "onClear"
  | "leftIcon"
  | "rightIcon"
  | "min"
  | "max"
  | "name"
  | "id"
>;

interface AppDatePickerBaseProps extends DateInputBaseProps {
  outputFormat?: AppDateOutputFormat;
  minDate?: AppDateLike;
  maxDate?: AppDateLike;
  inputContainerClassName?: string;
}

export interface AppDatePickerSingleProps extends AppDatePickerBaseProps {
  mode?: "single";
  value?: AppDateLike;
  name?: string;
  id?: string;
  boundary?: AppDateBoundary;
  onChange?: (value: string | null, meta: AppDateChangeMeta) => void;
}

export interface AppDatePickerRangeProps extends AppDatePickerBaseProps {
  mode: "range";
  value?: {
    start?: AppDateLike;
    end?: AppDateLike;
  };
  startName?: string;
  endName?: string;
  startId?: string;
  endId?: string;
  startAriaLabel?: string;
  endAriaLabel?: string;
  separator?: React.ReactNode;
  startInvalid?: boolean;
  endInvalid?: boolean;
  rangeClassName?: string;
  onChange?: (value: AppDateRangeValue, meta: AppDateRangeChangeMeta) => void;
}

export type AppDatePickerProps =
  | AppDatePickerSingleProps
  | AppDatePickerRangeProps;

function toInputDateValue(value: AppDateLike): string {
  if (!value) return "";

  const parsed = dayjs(value);

  if (!parsed.isValid()) return "";

  return parsed.format("YYYY-MM-DD");
}

function applyBoundary(date: Dayjs, boundary: AppDateBoundary): Dayjs {
  if (boundary === "startOfDay") return date.startOf("day");
  if (boundary === "endOfDay") return date.endOf("day");

  return date;
}

function resolveOutputFormat(outputFormat: AppDateOutputFormat) {
  if (outputFormat === "date") return "YYYY-MM-DD";
  return outputFormat;
}

function formatOutputDate(
  inputValue: string,
  outputFormat: AppDateOutputFormat = "YYYY-MM-DD",
  boundary: AppDateBoundary = "none",
): string | null {
  if (!inputValue) return null;

  const parsed = dayjs(inputValue);

  if (!parsed.isValid()) return null;

  const bounded = applyBoundary(parsed, boundary);

  if (outputFormat === "iso") {
    return bounded.toISOString();
  }

  return bounded.format(resolveOutputFormat(outputFormat));
}

function buildDateMeta(
  inputValue: string,
  outputFormat: AppDateOutputFormat = "YYYY-MM-DD",
  boundary: AppDateBoundary = "none",
): AppDateChangeMeta {
  if (!inputValue) {
    return {
      inputValue: null,
      date: null,
      iso: null,
      boundary,
    };
  }
  console.log(outputFormat);

  const parsed = dayjs(inputValue);

  if (!parsed.isValid()) {
    return {
      inputValue: null,
      date: null,
      iso: null,
      boundary,
    };
  }

  const bounded = applyBoundary(parsed, boundary);

  return {
    inputValue,
    date: bounded,
    iso: bounded.toISOString(),
    boundary,
  };
}

function AppDatePicker(props: AppDatePickerProps) {
  if (props.mode === "range") {
    return <AppDateRangePickerInner {...props} />;
  }

  return <AppDateSinglePickerInner {...props} />;
}

function AppDateSinglePickerInner(props: AppDatePickerSingleProps) {
  const {
    value,
    onChange,
    outputFormat = "YYYY-MM-DD",
    minDate,
    maxDate,
    boundary = "none",
    className,
    containerClassName,
    inputContainerClassName,
    disabled,
    readOnly,
    variant,
    size,
    radius,
    intent,
    fieldWidth,
    invalid,
    id,
    name,
    ...inputProps
  } = props;

  const inputValue = toInputDateValue(value);
  const min = toInputDateValue(minDate);
  const max = toInputDateValue(maxDate);

  return (
    <AppInput
      {...inputProps}
      id={id}
      name={name}
      type="date"
      value={inputValue}
      min={min || undefined}
      max={max || undefined}
      disabled={disabled}
      readOnly={readOnly}
      variant={variant}
      size={size}
      radius={radius}
      intent={intent}
      fieldWidth={fieldWidth}
      invalid={invalid}
      containerClassName={cn(containerClassName, inputContainerClassName)}
      className={cn("[color-scheme:light] dark:[color-scheme:dark]", className)}
      onChange={(event) => {
        const nextInputValue = event.target.value;

        const nextValue = formatOutputDate(
          nextInputValue,
          outputFormat,
          boundary,
        );

        onChange?.(
          nextValue,
          buildDateMeta(nextInputValue, outputFormat, boundary),
        );
      }}
    />
  );
}

function AppDateRangePickerInner(props: AppDatePickerRangeProps) {
  const {
    value,
    onChange,
    outputFormat = "YYYY-MM-DD",
    minDate,
    maxDate,
    className,
    containerClassName,
    inputContainerClassName,
    disabled,
    readOnly,
    variant,
    size,
    radius,
    intent,
    fieldWidth,
    invalid,
    startName,
    endName,
    startId,
    endId,
    startAriaLabel = "Fecha inicial",
    endAriaLabel = "Fecha final",
    separator = "—",
    startInvalid,
    endInvalid,
    rangeClassName,
    ...inputProps
  } = props;

  const startInputValue = toInputDateValue(value?.start);
  const endInputValue = toInputDateValue(value?.end);

  const min = toInputDateValue(minDate);
  const max = toInputDateValue(maxDate);

  const emitRangeChange = (
    changed: "start" | "end",
    nextInputValue: string,
  ) => {
    const nextStartInput =
      changed === "start" ? nextInputValue : startInputValue;

    const nextEndInput = changed === "end" ? nextInputValue : endInputValue;

    const nextStart = formatOutputDate(
      nextStartInput,
      outputFormat,
      "startOfDay",
    );

    const nextEnd = formatOutputDate(nextEndInput, outputFormat, "endOfDay");

    onChange?.(
      {
        start: nextStart,
        end: nextEnd,
      },
      {
        changed,
        start: buildDateMeta(nextStartInput, outputFormat, "startOfDay"),
        end: buildDateMeta(nextEndInput, outputFormat, "endOfDay"),
      },
    );
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1.5 sm:flex-row sm:items-center",
        containerClassName,
        rangeClassName,
      )}
    >
      <AppInput
        {...inputProps}
        id={startId}
        name={startName}
        type="date"
        value={startInputValue}
        min={min || undefined}
        max={endInputValue || max || undefined}
        disabled={disabled}
        readOnly={readOnly}
        variant={variant}
        size={size}
        radius={radius}
        intent={intent}
        fieldWidth={fieldWidth}
        invalid={invalid || startInvalid}
        aria-label={startAriaLabel}
        containerClassName={inputContainerClassName}
        className={cn(
          "[color-scheme:light] dark:[color-scheme:dark]",
          className,
        )}
        onChange={(event) => {
          emitRangeChange("start", event.target.value);
        }}
      />

      <span className="hidden text-xs text-muted-foreground sm:inline">
        {separator}
      </span>

      <AppInput
        {...inputProps}
        id={endId}
        name={endName}
        type="date"
        value={endInputValue}
        min={startInputValue || min || undefined}
        max={max || undefined}
        disabled={disabled}
        readOnly={readOnly}
        variant={variant}
        size={size}
        radius={radius}
        intent={intent}
        fieldWidth={fieldWidth}
        invalid={invalid || endInvalid}
        aria-label={endAriaLabel}
        containerClassName={inputContainerClassName}
        className={cn(
          "[color-scheme:light] dark:[color-scheme:dark]",
          className,
        )}
        onChange={(event) => {
          emitRangeChange("end", event.target.value);
        }}
      />
    </div>
  );
}

export { AppDatePicker, toInputDateValue, formatOutputDate, buildDateMeta };
