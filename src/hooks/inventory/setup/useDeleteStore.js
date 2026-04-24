import { useMutation } from "@tanstack/react-query";
import { deleteStore } from "@/services/inventory-setup.service";

export const useDeleteStore = (options = {}) => {
  return useMutation({
    mutationFn: (id) => deleteStore(id),
    ...options,
  });
};
