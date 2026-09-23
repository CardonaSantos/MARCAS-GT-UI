import {
  useController,
  useFormContext,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { AppField } from "../primitives/app-field";
import {
  AppSingleSelect,
  type AppSingleSelectProps,
  type AppSelectValue,
} from "../primitives/app-single-select";

export interface AppFormSingleSelectProps<
  TFieldValues extends FieldValues,
  TValue extends AppSelectValue = AppSelectValue,
  TMeta = unknown,
> extends Omit<
  AppSingleSelectProps<TValue, TMeta>,
  "value" | "onChange" | "inputId"
> {
  name: FieldPath<TFieldValues>;
  control?: Control<TFieldValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;
}

export function AppFormSingleSelect<
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
}: AppFormSingleSelectProps<TFieldValues, TValue, TMeta>) {
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
        <AppSingleSelect<TValue, TMeta>
          inputId={fieldUi.id}
          value={(field.value ?? null) as TValue | null}
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
