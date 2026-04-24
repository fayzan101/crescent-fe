import { useMutation } from "@tanstack/react-query";
import { deleteReturn } from "@/services/inventory-mov.service";

export const useDeleteReturn = (options = {}) => {
  return useMutation({
    mutationFn: deleteReturn,
    ...options,
  });
};
