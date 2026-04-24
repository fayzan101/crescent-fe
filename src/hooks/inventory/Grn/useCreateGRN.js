import { useMutation } from "@tanstack/react-query";
import { createGRN } from "@/services/inventory-grn.service";

export const useCreateGRN = (options = {}) => {
  return useMutation({
    mutationFn: createGRN,
    ...options,
  });
};
