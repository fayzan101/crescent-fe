import { useMutation } from "@tanstack/react-query";
import { updateTransfer } from "@/services/inventory-mov.service";

export const useUpdateTransfer = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, data }) => updateTransfer(id, data),
    ...options,
  });
};
