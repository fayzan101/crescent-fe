import { useQuery } from '@tanstack/react-query';
import productService from '@/services/product.service';
import { queryKeys } from '@/lib/queryKeys';

export const useProducts = (params, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: queryKeys.items.list(params),
    queryFn: () => productService.fetchProducts(params),
    enabled,
    ...rest,
  });
};
