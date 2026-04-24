import { useMutation } from '@tanstack/react-query';
import userRolesService from '@/services/user-roles.service';

/**
 * React Query hook to create a user role
 * @param {Object} options - Mutation options (onSuccess, onError, etc.)
 * @returns mutation object
 */
export function useCreateRole(options = {}) {
  return useMutation({
    mutationFn: (payload) => userRolesService.createRole(payload),
    ...options,
  });
}