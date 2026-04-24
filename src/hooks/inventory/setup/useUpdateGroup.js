import { useMutation } from "@tanstack/react-query";
import { updateInventoryGroup } from "@/services/inventory-setup.service";

export const useUpdateGroup = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, data }) => updateInventoryGroup(id, data),
    ...options,
  });
};
