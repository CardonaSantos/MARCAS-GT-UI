import { useFormContext, type FieldValues } from "react-hook-form";

import { AppButton, type AppButtonProps } from "../primitives/app-button";

export interface AppFormSubmitProps extends AppButtonProps {
  loadingText?: string;
  disableWhenInvalid?: boolean;
}

export function AppFormSubmit<TFieldValues extends FieldValues>({
  children = "Guardar",
  loadingText = "Guardando...",
  disableWhenInvalid = false,
  disabled,
  ...props
}: AppFormSubmitProps) {
  const {
    formState: { isSubmitting, isValid },
  } = useFormContext<TFieldValues>();

  return (
    <AppButton
      type="submit"
      loading={isSubmitting}
      loadingText={loadingText}
      disabled={disabled || isSubmitting || (disableWhenInvalid && !isValid)}
      {...props}
    >
      {children}
    </AppButton>
  );
}
