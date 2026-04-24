import { useMutation } from "@tanstack/react-query";
import { deleteInventoryVendor } from "@/services/inventory-setup.service";

export const useDeleteVendor = (options = {}) => {
  return useMutation({
    mutationFn: (id) => deleteInventoryVendor(id),
    ...options,
  });
};
