import { useMutation } from "@tanstack/react-query";
import { deleteInventoryGroup } from "@/services/inventory-setup.service";

export const useDeleteGroup = (options = {}) => {
  return useMutation({
    mutationFn: (id) => deleteInventoryGroup(id),
    ...options,
  });
};
