import { useMutation } from "@tanstack/react-query";
import { approvePurchaseOrder } from "@/services/inventory-po.service";

export const useApprovePurchaseOrder = (options = {}) => {
  return useMutation({
    mutationFn: (id) => approvePurchaseOrder(id),
    ...options,
  });
};
