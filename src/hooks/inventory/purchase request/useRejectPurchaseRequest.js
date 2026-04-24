import { useMutation } from "@tanstack/react-query";
import { rejectPurchaseRequest } from "@/services/inventory.pr.service";

export const useRejectPurchaseRequest = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, reason }) => rejectPurchaseRequest(id, reason),
    ...options,
  });
};
