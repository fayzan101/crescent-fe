import { useQuery } from '@tanstack/react-query';
import vendorService from '@/services/vendor.service';

export const useVendorById = (id, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: ['vendors', 'detail', id],
    queryFn: () => vendorService.getVendorById(id),
    enabled: Boolean(id) && enabled,
    ...rest,
  });
};
