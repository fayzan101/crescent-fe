import { useMutation } from '@tanstack/react-query';
import packageService from '@/services/package.service';

export const useCreatePackage = (options = {}) => {
  const { onSuccess, onError, onSettled, ...rest } = options;

  return useMutation({
    mutationFn: (payload) => packageService.createPackage(payload),
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
