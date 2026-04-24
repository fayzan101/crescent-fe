import { useQuery } from '@tanstack/react-query';
import productService from '@/services/product.service';
import { queryKeys } from '@/lib/queryKeys';

export const useProductById = (id, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: queryKeys.items.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: Boolean(id) && enabled,
    ...rest,
  });
};
