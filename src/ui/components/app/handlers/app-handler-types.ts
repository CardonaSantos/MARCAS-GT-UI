import type * as React from "react";

export type AppCheckedValue = boolean | "indeterminate";

export type AppInputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type AppTextareaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;

export type AppSelectPrimitiveValue = string | number;

export type AppDateSingleValue = string | null;

export type AppDateRangeValue = {
  start?: string | null;
  end?: string | null;
};

export type AppSetState<TValue> = React.Dispatch<React.SetStateAction<TValue>>;

export type AppFieldKey<TState> = Extract<keyof TState, string>;

export type AppPayloadPrimitive =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date;

export type AppPayloadValue =
  | AppPayloadPrimitive
  | AppPayloadValue[]
  | {
      [key: string]: AppPayloadValue;
    };

export type AppMaybePromise<TValue> = TValue | Promise<TValue>;

export type AppSetValueOptions = {
  shouldValidate?: boolean;
  shouldDirty?: boolean;
  shouldTouch?: boolean;
};
