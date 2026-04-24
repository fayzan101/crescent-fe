import { useMutation } from "@tanstack/react-query";
import { updatePurchaseOrder } from "@/services/inventory-po.service";

export const useUpdatePurchaseOrder = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, data }) => updatePurchaseOrder(id, data),
    ...options,
  });
};
