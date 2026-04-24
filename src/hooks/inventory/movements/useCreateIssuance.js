import { useMutation } from "@tanstack/react-query";
import { createIssuance } from "@/services/inventory-mov.service";

export const useCreateIssuance = (options = {}) => {
  return useMutation({
    mutationFn: createIssuance,
    ...options,
  });
};
