import { useMutation } from "@tanstack/react-query";
import { createPurchaseRequest } from "@/services/inventory.pr.service";

export const useCreatePurchaseRequest = (options = {}) => {
  return useMutation({
    mutationFn: (data) => createPurchaseRequest(data),
    ...options,
  });
};
