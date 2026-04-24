import { useMutation } from "@tanstack/react-query";
import { updateInventoryCategory } from "@/services/inventory-setup.service";

export const useUpdateCategory = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, data }) => updateInventoryCategory(id, data),
    ...options,
  });
};
