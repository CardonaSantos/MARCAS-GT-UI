import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";
import { getApiErrorMessage } from "@/lib/api-error";

export function useDeleteCustomer() {
  return API.useMutation<unknown, { id: number }>({
    method: "DELETE",
    endpoint: ({ id }) => marcasEndpoints.customers.detail(id),
    body: () => undefined,
    invalidateKeys: [marcasQueryKeys.clientes.all],
    options: {
      onSuccess: () => toast.success("Cliente eliminado correctamente."),
      onError: (error) => toast.error(getApiErrorMessage(error, "No se pudo eliminar el cliente.")),
    },
  });
}
