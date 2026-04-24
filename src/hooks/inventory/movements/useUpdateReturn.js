import { useMutation } from "@tanstack/react-query";
import { updateReturn } from "@/services/inventory-mov.service";

export const useUpdateReturn = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, data }) => updateReturn(id, data),
    ...options,
  });
};
