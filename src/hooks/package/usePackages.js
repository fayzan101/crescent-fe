import { useQuery } from '@tanstack/react-query';
import packageService from '@/services/package.service';

export const usePackages = (params, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: ['packages', 'list', params],
    queryFn: () => packageService.fetchPackages(params),
    enabled,
    ...rest,
  });
};
