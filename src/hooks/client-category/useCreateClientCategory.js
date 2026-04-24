import { useMutation } from '@tanstack/react-query';
import clientCategoryService from '@/services/client-category.service';

export const useCreateClientCategory = (options = {}) => {
  const { onSuccess, onError, onSettled, ...rest } = options;

  return useMutation({
    mutationFn: (payload) => clientCategoryService.createClientCategory(payload),
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
