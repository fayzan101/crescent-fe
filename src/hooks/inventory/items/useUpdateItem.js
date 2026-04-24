import { useMutation } from "@tanstack/react-query";
import { updateInventoryItem } from "@/services/inventory-items.service";

export const useUpdateItem = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, data }) => updateInventoryItem(id, data),
    ...options,
  });
};
