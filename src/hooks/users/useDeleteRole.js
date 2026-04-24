import { useMutation } from '@tanstack/react-query';
import userRolesService from '@/services/user-roles.service';
/**
 * React Query hook to delete a user role by id
 * @returns mutation object
 */
export function useDeleteRole() {
  return useMutation({
    mutationFn: (id) => userRolesService.deleteRole(id),
  });
}
