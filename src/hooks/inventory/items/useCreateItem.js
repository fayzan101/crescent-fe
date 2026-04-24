import { useMutation } from "@tanstack/react-query";
import { createInventoryItem } from "@/services/inventory-items.service";

export const useCreateItem = (options = {}) => {
  return useMutation({
    mutationFn: (data) => createInventoryItem(data),
    ...options,
  });
};
