import { useMutation } from "@tanstack/react-query";
import { updateStore } from "@/services/inventory-setup.service";

export const useUpdateStore = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, data }) => updateStore(id, data),
    ...options,
  });
};
