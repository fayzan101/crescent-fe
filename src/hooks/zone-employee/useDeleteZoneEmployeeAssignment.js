import { useMutation } from '@tanstack/react-query';
import zoneEmployeeService from '@/services/zone-employee.service';

/**
 * React Query hook to delete a zone-employee assignment by id
 * @param {object} options - React Query mutation options (onSuccess, onError, etc)
 * @returns {object} Mutation object from useMutation
 */
export function useDeleteZoneEmployeeAssignment(options = {}) {
  return useMutation({
    mutationFn: (id) => zoneEmployeeService.deleteZoneEmployeeAssignment(id),
    ...options,
  });
}
