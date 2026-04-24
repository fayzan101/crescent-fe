import { useQuery } from '@tanstack/react-query';
import userRolesService from '@/services/user-roles.service';

/**
 * React Query hook to fetch all user roles
 * @returns query object
 */
export function useFetchRoles() {
  return useQuery({
    queryKey: ['roles', 'list'],
    queryFn: () => userRolesService.fetchRoles(),
  });
}
