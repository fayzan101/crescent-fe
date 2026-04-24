import { useMutation } from '@tanstack/react-query';
import zoneEmployeeService from '@/services/zone-employee.service';

/**
 * React Query hook to update a zone-employee assignment by id
 * @param {object} options - React Query mutation options (onSuccess, onError, etc)
 * @returns {object} Mutation object from useMutation
 */
export function useUpdateZoneEmployeeAssignment(options = {}) {
  return useMutation({
    mutationFn: ({ id, payload }) =>
      zoneEmployeeService.updateZoneEmployeeAssignment(id, payload),
    ...options,
  });
}
