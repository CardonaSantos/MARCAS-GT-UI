import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";
import { getApiErrorMessage } from "@/lib/api-error";
import type { CreatedCustomer, CreateCustomerPayload } from "./customer.types";

export function useCreateCustomer() {
  return API.useMutation<CreatedCustomer, CreateCustomerPayload>({
    method: "POST",
    endpoint: marcasEndpoints.customers.root,
    invalidateKeys: [
      marcasQueryKeys.clientes.all,
      marcasQueryKeys.pedidos.all,
      marcasQueryKeys.creditos.all,
    ],
    options: {
      onSuccess: () => toast.success("Cliente creado correctamente."),
      onError: (error) =>
        toast.error(getApiErrorMessage(error, "No se pudo crear el cliente.")),
    },
  });
}
