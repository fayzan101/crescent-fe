import { useMutation } from "@tanstack/react-query";
import { createStore } from "@/services/inventory-setup.service";

export const useCreateStore = (options = {}) => {
  return useMutation({
    mutationFn: (data) => createStore(data),
    ...options,
  });
};
