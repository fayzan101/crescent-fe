import { useMutation } from "@tanstack/react-query";
import { createInventoryGroup } from "@/services/inventory-setup.service";

export const useCreateGroup = (options = {}) => {
  return useMutation({
    mutationFn: (data) => createInventoryGroup(data),
    ...options,
  });
};
