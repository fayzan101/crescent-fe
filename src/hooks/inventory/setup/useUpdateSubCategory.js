import { useMutation } from '@tanstack/react-query';
import { updateInventorySubcategory } from '@/services/inventory-setup.service';

export const useUpdateSubCategory = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, data }) => updateInventorySubcategory(id, data),
    ...options,
  });
};

export default useUpdateSubCategory;
