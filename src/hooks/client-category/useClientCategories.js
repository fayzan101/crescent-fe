import { useQuery } from '@tanstack/react-query';
import clientCategoryService from '@/services/client-category.service';
import { queryKeys } from '@/lib/queryKeys';

export const useClientCategories = (params, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: queryKeys.clientCategories.list(params),
    queryFn: () => clientCategoryService.fetchClientCategories(params),
    enabled,
    ...rest,
  });
};
