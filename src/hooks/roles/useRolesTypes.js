import { useQuery } from "@tanstack/react-query";
import rolesService from "@/services/roles.services";

/**
 * React Query hook to fetch all role types
 * @returns array of query objects
 */
export function useRolesTypes() {
  return useQuery({
    queryKey: ['roles', 'types'],
    queryFn: () => rolesService.getAllRoles(),
  });
}