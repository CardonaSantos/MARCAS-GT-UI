import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  }),

  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});
