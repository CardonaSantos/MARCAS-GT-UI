import {
  useController,
  useFormContext,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { AppField } from "../primitives/app-field";
import { AppInput, type AppInputProps } from "../primitives/app-input";

export interface AppFormInputProps<
  TFieldValues extends FieldValues,
> extends Omit<
  AppInputProps,
  "name" | "value" | "defaultValue" | "onChange" | "onBlur"
> {
  name: FieldPath<TFieldValues>;
  control?: Control<TFieldValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;
}

export function AppFormInput<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  description,
  hint,
  required,
  disabled,
  ...props
}: AppFormInputProps<TFieldValues>) {
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
        <AppInput
          id={fieldUi.id}
          name={field.name}
          ref={field.ref}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          disabled={fieldUi.disabled}
          required={fieldUi.required}
          aria-invalid={fieldUi.invalid}
          aria-describedby={fieldUi.describedBy}
          invalid={fieldState.invalid}
          {...props}
        />
      )}
    </AppField>
  );
}
