import { useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

interface UseUrlTabStateOptions<TValue extends string> {
  param?: string;
  defaultValue: TValue;
  allowedValues: readonly TValue[];
}

export function useUrlTabState<TValue extends string>({
  param = "tab",
  defaultValue,
  allowedValues,
}: UseUrlTabStateOptions<TValue>) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawValue = searchParams.get(param);

  const value =
    rawValue && allowedValues.includes(rawValue as TValue)
      ? (rawValue as TValue)
      : defaultValue;

  const setValue = useCallback(
    (nextValue: TValue) => {
      const next = new URLSearchParams(searchParams);

      if (nextValue === defaultValue) {
        next.delete(param);
      } else {
        next.set(param, nextValue);
      }

      setSearchParams(next, {
        replace: true,
        state: location.state,
      });
    },
    [
      defaultValue,
      location.state,
      param,
      searchParams,
      setSearchParams,
    ],
  );

  return {
    value,
    setValue,
  };
}
