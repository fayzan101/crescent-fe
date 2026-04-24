import { useQuery } from '@tanstack/react-query';
import packageService from '@/services/package.service';

export const usePackageById = (id, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: ['packages', 'detail', id],
    queryFn: () => packageService.getPackageById(id),
    enabled: Boolean(id) && enabled,
    ...rest,
  });
};
