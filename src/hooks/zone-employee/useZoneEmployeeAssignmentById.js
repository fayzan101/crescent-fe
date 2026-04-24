import { useQuery } from '@tanstack/react-query';
import zoneEmployeeService from '@/services/zone-employee.service';

/**
 * React Query hook to fetch a zone-employee assignment by id
 * @param {number} id Assignment id
 * @returns {object} Query object from useQuery
 */
export function useZoneEmployeeAssignmentById(id) {
  return useQuery({
    queryKey: ['zone-employee-assignment', id],
    queryFn: () => zoneEmployeeService.fetchZoneEmployeeAssignmentById(id),
    enabled: !!id,
  });
}
