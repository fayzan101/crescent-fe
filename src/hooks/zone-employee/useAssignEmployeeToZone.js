import { useMutation } from '@tanstack/react-query';
import zoneEmployeeService from '@/services/zone-employee.service';

/**
 * @param {object} options - React Query mutation options (onSuccess, onError, etc)
 * @returns {object}
 */
export function useAssignEmployeeToZone(options = {}) {
  return useMutation({
    mutationFn: (payload) =>
      zoneEmployeeService.assignEmployeeToZone(payload),
    ...options,
  });
}
