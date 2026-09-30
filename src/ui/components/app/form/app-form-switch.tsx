import {
  useController,
  useFormContext,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { AppField } from "../primitives/app-field";
import { AppSwitch, type AppSwitchProps } from "../primitives/app-switch";

export interface AppFormSwitchProps<
  TFieldValues extends FieldValues,
> extends Omit<
  AppSwitchProps,
  "name" | "checked" | "defaultChecked" | "onCheckedChange"
> {
  name: FieldPath<TFieldValues>;
  control?: Control<TFieldValues>;
  fieldLabel?: React.ReactNode;
  fieldDescription?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;
}

export function AppFormSwitch<TFieldValues extends FieldValues>({
  name,
  control,
  fieldLabel,
  fieldDescription,
  hint,
  required,
  disabled,
  ...props
}: AppFormSwitchProps<TFieldValues>) {
  const methods = useFormContext<TFieldValues>();
  const { field, fieldState } = useController({
    name,
    control: control ?? methods.control,
    disabled,
  });

  return (
    <AppField
      label={fieldLabel}
      description={fieldDescription}
      hint={hint}
      error={fieldState.error?.message}
      required={required}
      disabled={disabled}
      invalid={fieldState.invalid}
    >
      {(fieldUi) => (
        <AppSwitch
          checked={Boolean(field.value)}
          onCheckedChange={field.onChange}
          disabled={fieldUi.disabled}
          aria-invalid={fieldUi.invalid}
          aria-describedby={fieldUi.describedBy}
          {...props}
        />
      )}
    </AppField>
  );
}
