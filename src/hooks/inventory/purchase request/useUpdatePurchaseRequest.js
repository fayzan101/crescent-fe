import { useMutation } from "@tanstack/react-query";
import { updatePurchaseRequest } from "@/services/inventory.pr.service";

export const useUpdatePurchaseRequest = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, data }) => updatePurchaseRequest(id, data),
    ...options,
  });
};
