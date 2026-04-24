import { useMutation } from "@tanstack/react-query";
import { rejectPurchaseOrder } from "@/services/inventory-po.service";

export const useRejectPurchaseOrder = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, reason }) => rejectPurchaseOrder(id, reason),
    ...options,
  });
};
