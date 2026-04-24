import { useQuery } from '@tanstack/react-query';
import zoneEmployeeService from '@/services/zone-employee.service';

/**
 * React Query hook to fetch zone-employee assignments with optional filters
 * @param {object} params Optional filters: { zoneId, employeeId }
 * @returns {object} Query object from useQuery
 */
export function useZoneEmployeeAssignments(params) {
  return useQuery({
    queryKey: ['zone-employee-assignments', params],
    queryFn: () => zoneEmployeeService.fetchZoneEmployeeAssignments(params),
    enabled: !!params,
  });
}
