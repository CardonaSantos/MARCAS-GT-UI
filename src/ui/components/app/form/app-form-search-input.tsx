import {
  useController,
  useFormContext,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { AppField } from "../primitives/app-field";
import {
  AppSearchInput,
  type AppSearchInputProps,
} from "../primitives/app-search-input";

export interface AppFormSearchInputProps<
  TFieldValues extends FieldValues,
> extends Omit<
  AppSearchInputProps,
  "value" | "defaultValue" | "onValueChange"
> {
  name: FieldPath<TFieldValues>;
  control?: Control<TFieldValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;
}

export function AppFormSearchInput<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  description,
  hint,
  required,
  disabled,
  ...props
}: AppFormSearchInputProps<TFieldValues>) {
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
        <AppSearchInput
          id={fieldUi.id}
          value={field.value ?? ""}
          onValueChange={(value) => field.onChange(value)}
          disabled={fieldUi.disabled}
          aria-invalid={fieldUi.invalid}
          aria-describedby={fieldUi.describedBy}
          invalid={fieldState.invalid}
          {...props}
        />
      )}
    </AppField>
  );
}
