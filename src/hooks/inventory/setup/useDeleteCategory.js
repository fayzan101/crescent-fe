import { useMutation } from "@tanstack/react-query";
import { deleteInventoryCategory } from "@/services/inventory-setup.service";

export const useDeleteCategory = (options = {}) => {
  return useMutation({
    mutationFn: (id) => deleteInventoryCategory(id),
    ...options,
  });
};
