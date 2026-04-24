import { useMutation } from "@tanstack/react-query";
import { createInventoryVendor } from "@/services/inventory-setup.service";

export const useCreateVendor = (options = {}) => {
  return useMutation({
    mutationFn: (data) => createInventoryVendor(data),
    ...options,
  });
};
