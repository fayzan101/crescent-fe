import { useMutation } from "@tanstack/react-query";
import { approvePurchaseRequest } from "@/services/inventory.pr.service";

export const useApprovePurchaseRequest = (options = {}) => {
  return useMutation({
    mutationFn: (id) => approvePurchaseRequest(id),
    ...options,
  });
};
