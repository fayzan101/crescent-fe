import { useMutation } from "@tanstack/react-query";
import { deletePurchaseRequest } from "@/services/inventory.pr.service";

export const useDeletePurchaseRequest = (options = {}) => {
  return useMutation({
    mutationFn: (id) => deletePurchaseRequest(id),
    ...options,
  });
};
