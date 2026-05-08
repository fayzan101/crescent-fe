import { useMutation } from '@tanstack/react-query';
import { deleteInventorySubcategory } from '@/services/inventory-setup.service';

export const useDeleteSubCategory = (options = {}) => {
  return useMutation({
    mutationFn: (id) => deleteInventorySubcategory(id),
    ...options,
  });
};

export default useDeleteSubCategory;
