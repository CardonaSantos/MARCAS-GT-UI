import { toast } from "sonner";
import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";
import { getApiErrorMessage } from "@/lib/api-error";
import type { ConvertProspectResult } from "./prospect-history.types";

export function useConvertProspectToCustomer() {
  return API.useMutation<ConvertProspectResult, { id: number }>({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.prospects.convertToCustomer(id),
    invalidateKeys: [
      marcasQueryKeys.prospectos.all,
      marcasQueryKeys.clientes.all,
    ],
    options: {
      onSuccess: () => toast.success("Cliente generado y vinculado al prospecto."),
      onError: (error) =>
        toast.error(getApiErrorMessage(error, "No se pudo generar el cliente.")),
    },
  });
}
