import * as React from "react";

export interface UseAppAsyncActionOptions<TResult, TArgs extends unknown[]> {
  preventConcurrent?: boolean;
  onSuccess?: (result: TResult, args: TArgs) => void;
  onError?: (error: unknown, args: TArgs) => void;
  onFinally?: (args: TArgs) => void;
}

export function useAppAsyncAction<TResult = void, TArgs extends unknown[] = []>(
  action: (...args: TArgs) => Promise<TResult> | TResult,
  options: UseAppAsyncActionOptions<TResult, TArgs> = {},
) {
  const { preventConcurrent = true, onSuccess, onError, onFinally } = options;

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);
  const [data, setData] = React.useState<TResult | null>(null);

  const reset = React.useCallback(() => {
    setError(null);
    setData(null);
    setIsLoading(false);
  }, []);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const run = React.useCallback(
    async (...args: TArgs) => {
      if (preventConcurrent && isLoading) {
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await action(...args);

        setData(result);
        onSuccess?.(result, args);

        return result;
      } catch (caughtError) {
        setError(caughtError);
        onError?.(caughtError, args);

        return null;
      } finally {
        setIsLoading(false);
        onFinally?.(args);
      }
    },
    [action, isLoading, onError, onFinally, onSuccess, preventConcurrent],
  );

  return {
    isLoading,
    error,
    data,
    run,
    reset,
    resetError,
    setError,
  };
}
