import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";

import type {
  CustomerDirectoryDetail, CustomerDirectoryFilters, CustomerDirectoryPage,
} from "./customer-directory.types";

export function useCustomerDirectory(filters: CustomerDirectoryFilters) {
  return API.useQuery<CustomerDirectoryPage>({
    queryKey: marcasQueryKeys.clientes.list(filters),
    endpoint: marcasEndpoints.customers.directory,
    params: { ...filters },
  });
}

export function useCustomerDirectoryDetail(id: number | null) {
  return API.useQuery<CustomerDirectoryDetail>({
    queryKey: marcasQueryKeys.clientes.detail(id ?? 0),
    endpoint: marcasEndpoints.customers.directoryDetail(id ?? 0),
    options: { enabled: id !== null && id > 0 },
  });
}
