import {
  useMutation,
  useQuery,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

function normalizeEndpoint(endpoint: string) {
  return endpoint.startsWith("/") ? endpoint : \`/\${endpoint}\`;
}

export function createApiHooks(client: AxiosInstance) {
  return {
    useQueryApi<TData, TError = Error>(
      key: QueryKey,
      endpoint: string,
      config?: AxiosRequestConfig,
      options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
    ) {
      return useQuery<TData, TError>({
        queryKey: key,
        queryFn: async () => {
          const { data } = await client.get<TData>(
            normalizeEndpoint(endpoint),
            config,
          );

          return data;
        },
        ...options,
      });
    },

    useMutationApi<TData, TVariables = unknown, TError = Error>(
      method: "post" | "put" | "patch" | "delete",
      endpoint: string,
      config?: AxiosRequestConfig,
      options?: UseMutationOptions<TData, TError, TVariables>,
    ) {
      return useMutation<TData, TError, TVariables>({
        mutationFn: async (variables) => {
          const { data } = await client.request<TData>({
            url: normalizeEndpoint(endpoint),
            method,
            data: variables,
            ...config,
          });

          return data;
        },
        ...options,
      });
    },
  };
}
