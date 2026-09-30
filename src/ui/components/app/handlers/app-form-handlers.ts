import * as React from "react";
import type {
  FieldPath,
  FieldValues,
  PathValue,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

import type { AppSetValueOptions } from "./app-handler-types";
import {
  normalizeAppPayload,
  type NormalizeAppPayloadOptions,
} from "./app-payload-handlers";

export interface UseAppFormHandlersOptions {
  defaultSetOptions?: AppSetValueOptions;
}

export function useAppFormHandlers<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  options: UseAppFormHandlersOptions = {},
) {
  const defaultSetOptions = options.defaultSetOptions ?? {
    shouldDirty: true,
    shouldTouch: true,
    shouldValidate: false,
  };

  const setField = React.useCallback(
    <TName extends FieldPath<TFieldValues>>(
      name: TName,
      value: PathValue<TFieldValues, TName>,
      setOptions: AppSetValueOptions = defaultSetOptions,
    ) => {
      form.setValue(name, value, setOptions);
    },
    [defaultSetOptions, form],
  );

  const patch = React.useCallback(
    (
      values: Partial<TFieldValues>,
      setOptions: AppSetValueOptions = defaultSetOptions,
    ) => {
      Object.entries(values).forEach(([key, value]) => {
        form.setValue(
          key as FieldPath<TFieldValues>,
          value as PathValue<TFieldValues, FieldPath<TFieldValues>>,
          setOptions,
        );
      });
    },
    [defaultSetOptions, form],
  );

  const reset = React.useCallback(
    (values?: Partial<TFieldValues>) => {
      form.reset(values as TFieldValues);
    },
    [form],
  );

  const clearField = React.useCallback(
    <TName extends FieldPath<TFieldValues>>(
      name: TName,
      emptyValue: PathValue<TFieldValues, TName>,
      setOptions: AppSetValueOptions = defaultSetOptions,
    ) => {
      form.setValue(name, emptyValue, setOptions);
    },
    [defaultSetOptions, form],
  );

  const clearMany = React.useCallback(
    (
      fields: Array<{
        name: FieldPath<TFieldValues>;
        value: PathValue<TFieldValues, FieldPath<TFieldValues>>;
      }>,
      setOptions: AppSetValueOptions = defaultSetOptions,
    ) => {
      fields.forEach((field) => {
        form.setValue(field.name, field.value, setOptions);
      });
    },
    [defaultSetOptions, form],
  );

  const toggle = React.useCallback(
    <TName extends FieldPath<TFieldValues>>(
      name: TName,
      setOptions: AppSetValueOptions = defaultSetOptions,
    ) => {
      const currentValue = form.getValues(name);

      form.setValue(
        name,
        !Boolean(currentValue) as PathValue<TFieldValues, TName>,
        setOptions,
      );
    },
    [defaultSetOptions, form],
  );

  const toPayload = React.useCallback(
    <TPayload = TFieldValues>(
      payloadOptions?: NormalizeAppPayloadOptions,
    ): TPayload => {
      return normalizeAppPayload<TPayload>(form.getValues(), payloadOptions);
    },
    [form],
  );

  const toSubmitHandler = React.useCallback(
    <TPayload = TFieldValues>(
      handler: (
        payload: TPayload,
        rawValues: TFieldValues,
      ) => void | Promise<void>,
      payloadOptions?: NormalizeAppPayloadOptions,
    ): SubmitHandler<TFieldValues> => {
      return async (values) => {
        const payload = normalizeAppPayload<TPayload>(values, payloadOptions);

        await handler(payload, values);
      };
    },
    [],
  );

  const handleSubmitWithPayload = React.useCallback(
    <TPayload = TFieldValues>(
      handler: (
        payload: TPayload,
        rawValues: TFieldValues,
      ) => void | Promise<void>,
      payloadOptions?: NormalizeAppPayloadOptions,
    ) => {
      const submitHandler: SubmitHandler<TFieldValues> = async (values) => {
        const payload = normalizeAppPayload<TPayload>(values, payloadOptions);

        await handler(payload, values);
      };

      return form.handleSubmit(submitHandler);
    },
    [form],
  );

  return {
    form,
    setField,
    patch,
    reset,
    clearField,
    clearMany,
    toggle,
    toPayload,
    toSubmitHandler,
    handleSubmitWithPayload,
  };
}
