import { useMutation } from '@tanstack/react-query';
import vendorService from '@/services/vendor.service';

export const useDeleteVendor = (options = {}) => {
  const { onSuccess, onError, onSettled, ...rest } = options;

  return useMutation({
    mutationFn: (id) => vendorService.deleteVendor(id),
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
