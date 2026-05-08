import { useQuery } from '@tanstack/react-query';
import { getInventorySubcategories } from '@/services/inventory-setup.service';

export const useSubCategories = (params = {}, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: ['inventory-subcategories', params],
    queryFn: () => getInventorySubcategories(params),
    enabled,
    ...rest,
  });
};

export default useSubCategories;
