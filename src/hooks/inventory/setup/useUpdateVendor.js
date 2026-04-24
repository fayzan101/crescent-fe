import { useMutation } from "@tanstack/react-query";
import { updateInventoryVendor } from "@/services/inventory-setup.service";

export const useUpdateVendor = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, data }) => updateInventoryVendor(id, data),
    ...options,
  });
};
