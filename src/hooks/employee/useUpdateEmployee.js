import { useMutation } from '@tanstack/react-query';
import employeeService from '@/services/employee.service';

export const useUpdateEmployee = (options = {}) => {
  const { onSuccess, onError, onSettled, ...rest } = options;

  return useMutation({
    mutationFn: ({ id, payload }) => employeeService.updateEmployee(id, payload),
    onSuccess: (data, variables, context) => {
      if (onSuccess) onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (onError) onError(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      if (onSettled) onSettled(data, error, variables, context);
    },
    ...rest,
  });
};
