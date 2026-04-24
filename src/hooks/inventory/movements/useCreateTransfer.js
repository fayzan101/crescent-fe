import { useMutation } from "@tanstack/react-query";
import { createTransfer } from "@/services/inventory-mov.service";

export const useCreateTransfer = (options = {}) => {
  return useMutation({
    mutationFn: createTransfer,
    ...options,
  });
};
