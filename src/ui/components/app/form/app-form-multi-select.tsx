import {
  useController,
  useFormContext,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { AppField } from "../primitives/app-field";
import {
  AppMultiSelect,
  type AppMultiSelectProps,
} from "../primitives/app-multi-select";
import { AppSelectValue } from "../primitives/app-single-select";

export interface AppFormMultiSelectProps<
  TFieldValues extends FieldValues,
  TValue extends AppSelectValue = AppSelectValue,
  TMeta = unknown,
> extends Omit<
  AppMultiSelectProps<TValue, TMeta>,
  "value" | "onChange" | "inputId"
> {
  name: FieldPath<TFieldValues>;
  control?: Control<TFieldValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;
}

export function AppFormMultiSelect<
  TFieldValues extends FieldValues,
  TValue extends AppSelectValue = AppSelectValue,
  TMeta = unknown,
>({
  name,
  control,
  label,
  description,
  hint,
  required,
  isDisabled,
  ...props
}: AppFormMultiSelectProps<TFieldValues, TValue, TMeta>) {
  const methods = useFormContext<TFieldValues>();
  const { field, fieldState } = useController({
    name,
    control: control ?? methods.control,
    disabled: isDisabled,
  });

  return (
    <AppField
      label={label}
      description={description}
      hint={hint}
      error={fieldState.error?.message}
      required={required}
      disabled={isDisabled}
      invalid={fieldState.invalid}
    >
      {(fieldUi) => (
        <AppMultiSelect<TValue, TMeta>
          inputId={fieldUi.id}
          value={(field.value ?? []) as TValue[]}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          isDisabled={fieldUi.disabled}
          aria-invalid={fieldUi.invalid}
          aria-describedby={fieldUi.describedBy}
          invalid={fieldState.invalid}
          {...props}
        />
      )}
    </AppField>
  );
}
