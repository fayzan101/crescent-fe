import { useQuery } from '@tanstack/react-query';
import employeeService from '@/services/employee.service';

export const useEmployeeById = (id, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: ['employees', 'detail', id],
    queryFn: () => employeeService.getEmployeeById(id),
    enabled: Boolean(id) && enabled,
    ...rest,
  });
};
