import { useMutation } from "@tanstack/react-query";
import { createInventoryCategory } from "@/services/inventory-setup.service";

export const useCreateCategory = (options = {}) => {
  return useMutation({
    mutationFn: (data) => createInventoryCategory(data),
    ...options,
  });
};
