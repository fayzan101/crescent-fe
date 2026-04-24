import { useQuery } from '@tanstack/react-query';
import employeeService from '@/services/employee.service';

export const useEmployees = (options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: ['employees', 'list'],
    queryFn: () => employeeService.fetchEmployees(),
    enabled,
    ...rest,
  });
};
