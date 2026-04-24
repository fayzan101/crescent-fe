import { useMutation } from "@tanstack/react-query";
import { deleteTransfer } from "@/services/inventory-mov.service";

export const useDeleteTransfer = (options = {}) => {
  return useMutation({
    mutationFn: deleteTransfer,
    ...options,
  });
};
