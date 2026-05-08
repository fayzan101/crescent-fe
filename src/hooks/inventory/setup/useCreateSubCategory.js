import { useMutation } from '@tanstack/react-query';
import { createInventorySubcategory } from '@/services/inventory-setup.service';

export const useCreateSubCategory = (options = {}) => {
  return useMutation({
    mutationFn: (data) => createInventorySubcategory(data),
    ...options,
  });
};

export default useCreateSubCategory;
