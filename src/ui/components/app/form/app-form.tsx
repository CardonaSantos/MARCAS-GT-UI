import * as React from "react";
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";

import { cn } from "@/lib/utils";

export interface AppFormProps<TFieldValues extends FieldValues> extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  "onSubmit"
> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
}

export function AppForm<TFieldValues extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  ...props
}: AppFormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form
        noValidate
        className={cn("min-w-0", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}
