import { useMutation } from '@tanstack/react-query';
import userRolesService from '@/services/user-roles.service';

/**
 * React Query hook to update a user role by id
 * @returns mutation object
 */
export function useUpdateRole() {
  return useMutation({
    mutationFn: ({ id, payload }) => userRolesService.updateRole(id, payload),
  });
}
