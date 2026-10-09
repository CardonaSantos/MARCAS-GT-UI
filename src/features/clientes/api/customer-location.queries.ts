import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";
import type { CustomerDepartment, CustomerMunicipality } from "./customer.types";

export function useCustomerDepartments() {
  return API.useQuery<CustomerDepartment[]>({
    queryKey: marcasQueryKeys.clientes.custom("departamentos"),
    endpoint: marcasEndpoints.customerLocation.departments,
    options: { staleTime: 30 * 60_000 },
  });
}

/** El backend devuelve municipios únicamente del departamento solicitado. */
export function useCustomerMunicipalities(departmentId: number) {
  return API.useQuery<CustomerMunicipality[]>({
    queryKey: marcasQueryKeys.clientes.custom("municipios", departmentId),
    endpoint: marcasEndpoints.customerLocation.municipalities(departmentId),
    options: {
      enabled: departmentId > 0,
      staleTime: 30 * 60_000,
    },
  });
}
