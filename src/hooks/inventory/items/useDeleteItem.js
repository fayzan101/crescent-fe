import { useMutation } from "@tanstack/react-query";
import { deleteInventoryItem } from "@/services/inventory-items.service";

export const useDeleteItem = (options = {}) => {
  return useMutation({
    mutationFn: (id) => deleteInventoryItem(id),
    ...options,
  });
};
