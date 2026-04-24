import { useMutation } from "@tanstack/react-query";
import { createReturn } from "@/services/inventory-mov.service";

export const useCreateReturn = (options = {}) => {
  return useMutation({
    mutationFn: createReturn,
    ...options,
  });
};
