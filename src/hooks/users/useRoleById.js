import { useQuery } from '@tanstack/react-query';
import userRolesService from '@/services/user-roles.service';

/**
 * React Query hook to fetch a user role by id
 * @param {number|string} id
 * @returns query object
 */
export function useRoleById(id) {
  return useQuery({
    queryKey: ['roles', 'detail', id],
    queryFn: () => userRolesService.getRoleById(id),
    enabled: !!id,
  });
}
