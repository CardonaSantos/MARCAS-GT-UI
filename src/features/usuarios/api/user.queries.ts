import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";
import type { SystemUser, UserDirectoryFilters, UserDirectoryPage } from "./user.types";

export function useUserDirectory(filters: UserDirectoryFilters) {
  return API.useQuery<UserDirectoryPage>({
    queryKey: marcasQueryKeys.usuarios.list(filters),
    endpoint: marcasEndpoints.users.directory,
    params: { ...filters },
  });
}

export function useSystemUser(id: number | null) {
  return API.useQuery<SystemUser>({
    queryKey: marcasQueryKeys.usuarios.detail(id ?? 0),
    endpoint: marcasEndpoints.users.detail(id ?? 0),
    options: { enabled: id !== null && id > 0 },
  });
}
