import {
  useController,
  useFormContext,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { AppField } from "../primitives/app-field";
import {
  AppDatePicker,
  type AppDateRangeValue,
} from "../primitives/app-date-picker";

export interface AppFormDatePickerProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control?: Control<TFieldValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function AppFormDatePicker<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  description,
  hint,
  required,
  disabled,
  ...props
}: AppFormDatePickerProps<TFieldValues>) {
  const methods = useFormContext<TFieldValues>();
  const { field, fieldState } = useController({
    name,
    control: control ?? methods.control,
    disabled,
  });

  return (
    <AppField
      label={label}
      description={description}
      hint={hint}
      error={fieldState.error?.message}
      required={required}
      disabled={disabled}
      invalid={fieldState.invalid}
    >
      {(fieldUi) => (
        <AppDatePicker
          id={fieldUi.id}
          mode="single"
          value={(field.value ?? null) as string | null}
          onChange={(value) => field.onChange(value)}
          disabled={fieldUi.disabled}
          {...props}
        />
      )}
    </AppField>
  );
}

export interface AppFormDateRangePickerProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control?: Control<TFieldValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
}

export function AppFormDateRangePicker<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  description,
  hint,
  required,
  disabled,
}: AppFormDateRangePickerProps<TFieldValues>) {
  const methods = useFormContext<TFieldValues>();
  const { field, fieldState } = useController({
    name,
    control: control ?? methods.control,
    disabled,
  });

  const value = (field.value ?? {
    start: "",
    end: "",
  }) as AppDateRangeValue;

  return (
    <AppField
      label={label}
      description={description}
      hint={hint}
      error={fieldState.error?.message}
      required={required}
      disabled={disabled}
      invalid={fieldState.invalid}
    >
      <AppDatePicker
        mode="range"
        value={value}
        onChange={(nextValue) => field.onChange(nextValue)}
        disabled={disabled}
      />
    </AppField>
  );
}
