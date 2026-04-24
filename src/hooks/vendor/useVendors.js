import { useQuery } from '@tanstack/react-query';
import vendorService from '@/services/vendor.service';

export const useVendors = (params, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: ['vendors', 'list', params],
    queryFn: () => vendorService.fetchVendors(params),
    enabled,
    ...rest,
  });
};
