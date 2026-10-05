import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

import {
  ApiError,
  type ApiClient,
  type ApiQueryParams,
  type ApiRequestConfig,
  type HttpMethod,
} from "./createApiClient";

type MutationMethod = HttpMethod | Lowercase<HttpMethod>;

type EndpointResolver<TVariables> =
  | string
  | ((variables: TVariables) => string);

type ParamsResolver<TVariables> =
  | ApiQueryParams
  | ((variables: TVariables) => ApiQueryParams | undefined);

type BodyResolver<TVariables> = (variables: TVariables) => unknown;

type InvalidationResolver<TData, TVariables> =
  | QueryKey[]
  | ((data: TData, variables: TVariables) => QueryKey[] | Promise<QueryKey[]>);

type ApiUseQueryOptions<
  TQueryFnData,
  TError,
  TData,
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, QueryKey>,
  "queryKey" | "queryFn" | "initialData"
>;

export type ApiQueryDefinition<
  TQueryFnData,
  TError = ApiError,
  TData = TQueryFnData,
> = {
  queryKey: QueryKey;
  endpoint: string;
  params?: ApiQueryParams;
  request?: Omit<ApiRequestConfig, "params" | "signal">;
  options?: ApiUseQueryOptions<TQueryFnData, TError, TData>;
};

export type ApiMutationDefinition<
  TData,
  TVariables = void,
  TError = ApiError,
  TOnMutateResult = unknown,
> = {
  method: MutationMethod;
  endpoint: EndpointResolver<TVariables>;
  params?: ParamsResolver<TVariables>;
  body?: BodyResolver<TVariables>;
  request?: Omit<ApiRequestConfig, "params" | "signal">;
  invalidateKeys?: InvalidationResolver<TData, TVariables>;
  invalidateExact?: boolean;
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TOnMutateResult>,
    "mutationFn"
  >;
};

function normalizeMethod(method: MutationMethod): HttpMethod {
  return method.toUpperCase() as HttpMethod;
}

function resolveEndpoint<TVariables>(
  endpoint: EndpointResolver<TVariables>,
  variables: TVariables,
) {
  return typeof endpoint === "function" ? endpoint(variables) : endpoint;
}

function resolveParams<TVariables>(
  params: ParamsResolver<TVariables> | undefined,
  variables: TVariables,
) {
  if (!params) {
    return undefined;
  }

  return typeof params === "function" ? params(variables) : params;
}

export function createApiHooks(client: ApiClient) {
  function useQueryApi<
    TQueryFnData,
    TError = ApiError,
    TData = TQueryFnData,
  >({
    queryKey,
    endpoint,
    params,
    request,
    options,
  }: ApiQueryDefinition<
    TQueryFnData,
    TError,
    TData
  >): UseQueryResult<TData, TError> {
    return useQuery<TQueryFnData, TError, TData, QueryKey>({
      queryKey,
      queryFn: ({ signal }) =>
        client.get<TQueryFnData>(endpoint, {
          ...request,
          params,
          signal,
        }),
      ...options,
    });
  }

  function useMutationApi<
    TData,
    TVariables = void,
    TError = ApiError,
    TOnMutateResult = unknown,
  >({
    method,
    endpoint,
    params,
    body,
    request,
    invalidateKeys,
    invalidateExact = false,
    options,
  }: ApiMutationDefinition<TData, TVariables, TError, TOnMutateResult>) {
    const queryClient = useQueryClient();
    const onSuccess = options?.onSuccess;

    return useMutation<TData, TError, TVariables, TOnMutateResult>({
      ...(options ?? {}),
      mutationFn: (variables) =>
        client.request<TData>(
          normalizeMethod(method),
          resolveEndpoint(endpoint, variables),
          body ? body(variables) : variables,
          {
            ...request,
            params: resolveParams(params, variables),
          },
        ),
      onSuccess: async (data, variables, onMutateResult, context) => {
        const keys =
          typeof invalidateKeys === "function"
            ? await invalidateKeys(data, variables)
            : (invalidateKeys ?? []);

        if (keys.length > 0) {
          await Promise.all(
            keys.map((queryKey) =>
              queryClient.invalidateQueries({
                queryKey,
                exact: invalidateExact,
              }),
            ),
          );
        }

        await onSuccess?.(data, variables, onMutateResult, context);
      },
    });
  }

  function useInvalidateQueries() {
    const queryClient = useQueryClient();

    return (
      queryKeys: QueryKey[],
      options: { exact?: boolean } = {},
    ) =>
      Promise.all(
        queryKeys.map((queryKey) =>
          queryClient.invalidateQueries({
            queryKey,
            exact: options.exact ?? false,
          }),
        ),
      );
  }

  return {
    useQuery: useQueryApi,
    useMutation: useMutationApi,
    useInvalidateQueries,
    useQueryApi,
    useMutationApi,
  };
}
